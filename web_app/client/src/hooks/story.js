import { getStories } from '@/services/storyService';
import { useQuery } from '@tanstack/react-query';

const useGetStories = (data = {}, queryOptions = {}) =>
  useQuery({
    queryFn: () => getStories(data.query),
    queryKey: ['stories', data.childId],
    ...queryOptions,
  });

export { useGetStories };
