import { chatWithStream, getSessionMsgs } from '@/services/chatMsgs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetSessionMsgs = (data, queryConfig) => {
  const thirdKey = { limit: data.query.limit, sort: data.query.sort, page: data.query.page };

  return useQuery({
    queryKey: ['session-msgs', data.query.sessionId, thirdKey],
    queryFn: () => getSessionMsgs(data),

    keepPreviousData: true,
    placeholderData: (previousData) => previousData,

    ...queryConfig,
  });
};

export const useChatWithStream = () =>
  useMutation({
    mutationFn: ({ sessionId, childId, message, onChunk, onIdsReceived }) => {
      return chatWithStream({ sessionId, childId, message, onChunk, onIdsReceived });
    },
  });
