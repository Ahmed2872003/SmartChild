from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, field_validator
import json

class ChatTurn(BaseModel):
    role: str
    content: str

    @field_validator('role')
    def validate_role(cls, v):
        if v not in ('user', 'assistant'):
            raise ValueError("Role must be 'user' or 'assistant'")
        return v

    @field_validator('content')
    def trim_content(cls, v):
        return v[:500]

class ChildChatRequest(BaseModel):
    childName: str = Field(default="friend", max_length=50)
    age: int = Field(default=8, ge=4, le=18)
    message: str = Field(..., min_length=1, max_length=500)
    history: List[ChatTurn] = Field(default_factory=list)

    @field_validator('childName', 'message', mode='before')
    def strip_whitespace(cls, v):
        if isinstance(v, str):
            return v.strip()
        return v

    def get_clean_history(self) -> List[Dict[str, str]]:
        return [{"role": t.role, "content": t.content} for t in self.history[-10:]]

class ParentChatRequest(BaseModel):
    childName: str = Field(default="your child", max_length=50)
    age: int = Field(default=8, ge=4, le=18)
    report: str = Field(default="")
    message: str = Field(..., min_length=1, max_length=800)
    history: List[ChatTurn] = Field(default_factory=list)
    child_history: List[ChatTurn] = Field(default_factory=list)

    @field_validator('childName', 'message', mode='before')
    def strip_whitespace(cls, v):
        if isinstance(v, str):
            return v.strip()
        return v

    def get_clean_history(self) -> List[Dict[str, str]]:
        return [{"role": t.role, "content": t.content} for t in self.history[-14:]]

    def get_clean_child_history(self) -> str:
        if not self.child_history:
            return "No recent chat history available."
        
        # Format child history into a readable string for the Parent Advisor prompt
        lines = []
        for t in self.child_history[-10:]:  # Limit to last 10 messages for context
            speaker = "Sunny" if t.role == "assistant" else self.childName
            lines.append(f"{speaker}: {t.content}")
        
        return " | ".join(lines)
