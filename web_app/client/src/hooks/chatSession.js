import { createSession, deleteSession, getSessions } from '@/services/chatSession';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ childId }) => createSession({ childId }),

    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['chat-sessions', variables.childId],
        refetchType: 'all',
      });

      toast.success('Session is created');
    },
  });
};

export const useGetChatSessions = (data, queryConfig = {}) => {
  const thirdKey = { sort: data.query.sort, limit: data.query.limit, page: data.query.page };

  return useQuery({
    queryKey: ['chat-sessions', data.query.childId, thirdKey],

    queryFn: () => getSessions(data),

    keepPreviousData: true,
    placeholderData: (previousData) => previousData,

    ...queryConfig,
  });
};

export const useDeleteChatSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId }) => deleteSession(sessionId),

    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['chat-sessions', variables.childId],
        refetchType: 'all',
      });

      queryClient.invalidateQueries({
        queryKey: ['session-msgs', variables.sessionId],
        refetchType: 'all',
      });

      toast.success('Session Deleted');
    },
  });
};
