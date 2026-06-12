import { createChild, deleteChild, getChildren, updateChild, getCurrentChild } from '@/services/childService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const useGetCurrentChild = (initialData) =>
  useQuery({
    queryFn: getCurrentChild,
    queryKey: ['currentChild'],
    initialData,
    staleTime: Infinity,
  });

const useGetChildren = () =>
  useQuery({
    queryFn: getChildren,
    queryKey: ['children'],
    staleTime: Infinity,
  });

const useCreateChild = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChild,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['children']);

      toast.success('Child is created');
    },
  });
};

const useUpdateChild = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newData }) => updateChild(id, newData),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['children']);

      toast.success('Child is updated');
    },
  });
};

const useDeleteChild = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChild,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['children']);

      toast.success('Child is deleted');
    },
  });
};

export { useGetCurrentChild, useGetChildren, useCreateChild, useUpdateChild, useDeleteChild };
