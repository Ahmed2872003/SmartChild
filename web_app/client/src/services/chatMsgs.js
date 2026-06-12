import apiClient from '@/api/apiClient.js';
import { cleanChunk } from '@/utils/TextFormat';

const chatStartEndpoint = 'chat';

const getSessionMsgs = async (data) => {
  const searchParams = new URLSearchParams(data.query).toString();

  return (await apiClient.get(`${chatStartEndpoint}?${searchParams}`)).data;
};

const chatWithStream = async ({ sessionId, childId, message, onChunk, onIdsReceived }) => {
  const token = localStorage.getItem('jwt');

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${chatStartEndpoint}?stream=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId, childId, message }),
  });

  if (!response.ok) {
    throw new Error('Failed to start chat stream');
  }

  const realUserMsgId = response.headers.get('X-User-Msg-Id');
  const realAiMsgId = response.headers.get('X-AI-Msg-Id');

  if (onIdsReceived && realUserMsgId && realAiMsgId) {
    onIdsReceived({ realUserMsgId, realAiMsgId });
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunkText = decoder.decode(value, { stream: true });
    if (onChunk && chunkText) {
      onChunk(cleanChunk(chunkText));
    }
  }
};

export { chatWithStream, getSessionMsgs };
