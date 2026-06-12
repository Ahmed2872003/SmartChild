import apiClient from '@/api/apiClient';

const storyStartEndpoint = 'story';

const getStories = async (queryObj) => {
  const queryString = new URLSearchParams(queryObj).toString();

  const res = await apiClient.get(`${storyStartEndpoint}?${queryString}`);

  return res.data;
};

export { getStories };
