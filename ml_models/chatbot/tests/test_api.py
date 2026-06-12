"""
tests/test_api.py
-----------------
Full test suite for all SmartChild chatbot endpoints.
Run: python -m pytest tests/ -v
"""

import json
import sys
import os
import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

# Make sure the parent directory is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


@pytest.fixture
def client():
    mock_loader = MagicMock()
    mock_loader.generate.return_value = "This is a mocked response from Sunny!"
    mock_loader.info.return_value = {
        'base_model' : 'Qwen/Qwen2.5-1.5B-Instruct',
        'adapter_path': './model/weights',
        'device'     : 'cpu',
        'use_4bit'   : False,
        'vocab_size' : 151936,
        'cuda_available': False,
    }

    # We mock the loader globally for the test
    with patch('main.ModelLoader', return_value=mock_loader):
        from main import app
        # Since TestClient doesn't run the lifespan by default in some setups, we mock the state manually:
        app.state.model_loader = mock_loader
        app.state.MAX_NEW_TOKENS = 150
        app.state.TEMPERATURE = 0.7
        
        with TestClient(app) as c:
            yield c


# Health endpoints

class TestHealth:
    def test_health_ok(self, client):
        r = client.get('/health')
        assert r.status_code == 200
        data = r.json()
        assert data['status'] == 'ok'

    def test_model_info(self, client):
        r = client.get('/model/info')
        assert r.status_code == 200
        data = r.json()
        assert 'base_model' in data
        assert data['status'] == 'ok'


# Child chat endpoint

class TestChildChat:
    def _post(self, client, body):
        return client.post('/chat/child', json=body)

    def test_valid_request(self, client):
        r = self._post(client, {
            'childName': 'Ahmed',
            'age'      : 8,
            'message'  : 'I finished all my games today!',
        })
        assert r.status_code == 200
        data = r.json()
        assert 'reply' in data
        assert data['mode'] == 'child'

    def test_missing_message_returns_422(self, client):
        r = self._post(client, {
            'childName': 'Ahmed',
            'age'      : 8,
        })
        assert r.status_code == 422 # Pydantic validation error

    def test_empty_message_returns_422(self, client):
        r = self._post(client, {
            'childName': 'Ahmed',
            'age'      : 8,
            'message'  : '   ',
        })
        assert r.status_code == 422

    def test_invalid_age_handled(self, client):
        r = self._post(client, {
            'childName': 'Ahmed',
            'age'      : 99,
            'message'  : 'Hello!',
        })
        # Pydantic bounds ge=4, le=18, so 99 is invalid.
        assert r.status_code == 422

    def test_with_conversation_history(self, client):
        r = self._post(client, {
            'childName': 'Lina',
            'age'      : 10,
            'message'  : 'Can you tell me more?',
            'history'  : [
                {'role': 'user',      'content': 'I finished the puzzle!'},
                {'role': 'assistant', 'content': 'Amazing work!'},
            ],
        })
        assert r.status_code == 200

    def test_message_too_long_returns_422(self, client):
        r = self._post(client, {
            'childName': 'Ahmed',
            'age'      : 8,
            'message'  : 'x' * 600,
        })
        assert r.status_code == 422


# Parent chat endpoint

class TestParentChat:
    def _post(self, client, body):
        return client.post('/chat/parent', json=body)

    def test_valid_request_with_full_report_and_thresholds(self, client):
        r = self._post(client, {
            'childName': 'Ahmed',
            'age'      : 8,
            'message'  : 'How is Ahmed doing overall?',
            'report'   : {
                'overall_growth_percentage': 12,
                'overall_feeling'          : 'happy',
            },
            'thresholds': {
                'memory': { 'mastery': {'AR': 75} }
            }
        })
        assert r.status_code == 200
        data = r.json()
        assert 'reply' in data
        assert data['mode'] == 'parent'

    def test_valid_request_minimal_body(self, client):
        r = self._post(client, {
            'childName': 'Sara',
            'age'      : 9,
            'message'  : 'What activities help with memory?',
        })
        assert r.status_code == 200

    def test_missing_message_returns_422(self, client):
        r = self._post(client, {
            'childName': 'Ahmed',
            'age'      : 8,
            'report'   : {},
        })
        assert r.status_code == 422


# Story endpoint

class TestStoryChat:
    def _post(self, client, body):
        return client.post('/chat/story', json=body)

    def test_valid_story_request(self, client):
        r = self._post(client, {
            'childName': 'Ahmed',
            'age'      : 8,
            'prompt'   : 'Tell me a story about a brave lion!',
        })
        assert r.status_code == 200
        data = r.json()
        assert 'reply' in data
        assert data['mode'] == 'story'

    def test_missing_prompt_returns_422(self, client):
        r = self._post(client, {
            'childName': 'Lina',
            'age'      : 7,
        })
        # Pydantic will fail if prompt is missing, previously our custom logic used a default.
        # It's better to enforce it from the frontend.
        assert r.status_code == 422


# Feelings Analyzer endpoint

class TestFeelingsAnalyzerChat:
    def _post(self, client, body):
        return client.post('/chat/analyze_feelings', json=body)

    def test_valid_feelings_request(self, client):
        r = self._post(client, {
            'childName': 'Ahmed',
            'history': [
                {'role': 'user', 'content': 'I am so happy today!'}
            ]
        })
        assert r.status_code == 200
        data = r.json()
        assert 'report' in data
        assert data['mode'] == 'analyze_feelings'

    def test_missing_history_returns_422(self, client):
        r = self._post(client, {
            'childName': 'Lina',
        })
        assert r.status_code == 422


# Pydantic format report check
class TestFormatReport:
    def test_format_report_dict(self):
        from utils.schemas import ParentChatRequest
        result = ParentChatRequest._format_report({
            'overall_growth_percentage': 12,
            'overall_feeling'          : 'happy',
            'memory': {'state': 'mastery', 'AR': 80},
            'color_radar': {'red_acc': 80, 'green_acc': 25, 'blue_acc': 82},
        })
        assert 'growth' in result.lower()
        assert 'memory' in result.lower()
        assert '25' in result
