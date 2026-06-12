import apiClient from '@/api/apiClient';

const reportStartEndpoint = 'report';

const getDailyReports = async (data) => {
  const searchParams = new URLSearchParams(data.query).toString();

  return await apiClient.get(`${reportStartEndpoint}/daily/${data.params.childId}?${searchParams}`);
};

const getOverallReport = async (data) => {
  const res = await apiClient.get(`${reportStartEndpoint}/overall/${data.params.childId}`);
  return res.data;
};

export { getDailyReports, getOverallReport };
