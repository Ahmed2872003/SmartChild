import { getTestsDesc, getTests } from '@/services/testService';
import { useQuery } from '@tanstack/react-query';

const useGetTestsConfig = () =>
  useQuery({
    queryFn: getTestsDesc,
    queryKey: ['testsConfig'],
    staleTime: Infinity,
  });

const useGetTests = () =>
  useQuery({
    queryFn: getTests,
    queryKey: ['tests'],
    staleTime: Infinity,
  });

export { useGetTestsConfig, useGetTests };
