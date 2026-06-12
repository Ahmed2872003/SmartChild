import { replyCoparent, requestCoparent } from '@/services/coparent';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const useRequestCoparent = () =>
  useMutation({
    mutationFn: requestCoparent,
    onSuccess: () => toast.success('Request sent! Keep an eye on your inbox for updates.'),
  });

const useReplyCoparent = () =>
  useMutation({
    mutationFn: ({ action, token }) => replyCoparent(action, token),
  });

export { useRequestCoparent, useReplyCoparent };
