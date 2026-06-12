import apiClient from '@/api/apiClient';

const childStartEndpoint = 'child';

const getCurrentChild = async () => {
  const res = await apiClient.get(`${childStartEndpoint}/me`);

  return res.data.child;
};

const getChildren = async () => {
  const { data } = await apiClient.get(childStartEndpoint);

  return { children: data.parent.children };
};

const createChild = async (data) => {
  return await apiClient.post(childStartEndpoint, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const updateChild = async (id, newData) => {
  return await apiClient.patch(`${childStartEndpoint}/${id}`, newData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const deleteChild = async (id) => {
  await apiClient.delete(`${childStartEndpoint}/${id}`);
};

export { getCurrentChild, getChildren, createChild, updateChild, deleteChild };
