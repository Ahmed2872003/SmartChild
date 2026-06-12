import { queryOptions, useQuery } from '@tanstack/react-query';

import { getDailyReports, getOverallReport } from '@/services/report';

const useGetDailyReports = (data, queryOptions = {}) =>
  useQuery({
    queryFn: () => getDailyReports(data),
    queryKey: ['dailyReports', data.params.childId, data.query.page],
    ...queryOptions,
  });

const useGetOverallReport = (data, queryOptions = {}) =>
  useQuery({
    queryFn: () => getOverallReport(data),
    queryKey: ['overallReport', data.params.childId],
    ...queryOptions,
  });

export { useGetDailyReports, useGetOverallReport };
