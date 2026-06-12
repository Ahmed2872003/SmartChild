import apiClient from '@/api/apiClient.js';

const sessionStartEndpoint = 'session';

const createSession = async (data) => {
  return (await apiClient.post(`${sessionStartEndpoint}`, data)).data;
};

const getSessions = async (data) => {
  const searchParams = new URLSearchParams(data.query).toString();

  return (await apiClient.get(`${sessionStartEndpoint}?${searchParams}`)).data;
};

const deleteSession = async (sessionId) => {
  await apiClient.delete(`${sessionStartEndpoint}/${sessionId}`);
};

export { createSession, getSessions, deleteSession };
