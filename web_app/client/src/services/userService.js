import apiClient from '@/api/apiClient';

const userStartEndpoint = 'user';

const getCurrentUser = async (config) => {
  const res = await apiClient.get(`${userStartEndpoint}/me`, config);

  return res.data.parent;
};

const updateCurrentUser = async (newData) => {
  const res = await apiClient.patch(`${userStartEndpoint}/me`, newData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.parent;
};

export { getCurrentUser, updateCurrentUser };
