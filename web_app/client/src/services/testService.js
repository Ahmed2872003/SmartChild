import apiClient from '@/api/apiClient';

const testStartEndpoint = 'test';

const getTestsDesc = async () => {
  const res = await apiClient.get(`${testStartEndpoint}/desc`);

  return res.data;
};

const getTests = async () => {
  const res = await apiClient.get(`${testStartEndpoint}`);

  return res.data.testList;
};

export { getTestsDesc, getTests };
