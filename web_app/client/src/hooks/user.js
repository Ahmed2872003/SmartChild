import { getCurrentUser, updateCurrentUser } from '@/services/userService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const useGetUser = (queryConfig = {}, axiosConfig) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getCurrentUser(axiosConfig),
    staleTime: Infinity,
    retry: false,
    ...queryConfig,
  });
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (user) => {
      queryClient.setQueryData(['currentUser'], user);

      toast.success('Updated');
    },
  });
};

export { useGetUser, useUpdateUser };
