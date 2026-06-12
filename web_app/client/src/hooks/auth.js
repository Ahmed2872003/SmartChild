import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '@/services/authService';
import { toast } from 'react-toastify';
import { useJwt } from '@/context/JwtProvider';

const useLogin = () => {
  const onAuthSuccess = useAuthSuccess();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => onAuthSuccess(data, [`Hello ${data.data.parent.name}!`]),
  });

  return loginMutation;
};

const useSignup = () => {
  const onAuthSuccess = useAuthSuccess();

  const signupMutation = useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) =>
      onAuthSuccess(data, ['Account created successfully!', 'Please check your email to verify your account.']),
  });

  return signupMutation;
};

const useAuthSuccess = () => {
  const queryClient = useQueryClient();

  const { updateToken } = useJwt();

  const handleAuthSuccess = (data, successMessages) => {
    const {
      token,
      data: { parent },
    } = data;

    updateToken(token);

    queryClient.setQueryData(['currentUser'], parent);

    for (let sucessMsg of successMessages) toast.success(sucessMsg);
  };

  return handleAuthSuccess;
};

const useForgotPass = () => {
  const forgotPassMutation = useMutation({
    mutationFn: authService.forgotPass,
  });

  return forgotPassMutation;
};

const useResetPass = () => {
  const navigate = useNavigate();

  const resetPassMutation = useMutation({
    mutationFn: ({ data, token }) => authService.resetPass(data, token),
    onSuccess: () => {
      toast.success('Password changed');
      navigate('/login');
    },
  });

  return resetPassMutation;
};

const useVerifyEmail = () => {
  const verifyEmailMutation = useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: (res) => {
      toast.success(res.message);
    },
  });

  return verifyEmailMutation;
};

const useConfirmEmail = () => {
  const confirmEmailMutation = useMutation({
    mutationFn: authService.confirmEmail,
  });

  return confirmEmailMutation;
};

const useChangePassword = () => {
  const onAuthSuccess = useAuthSuccess();

  return useMutation({
    mutationFn: authService.updatePassword,
    onSuccess: (data) => onAuthSuccess(data, ['Password is changed']),
  });
};

const useSwitchToChild = (childProfile) => {
  const { updateToken } = useJwt();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.switchToChild,
    onSuccess: ({ token }) => {
      queryClient.setQueryData(['currentChild'], childProfile);

      // queryClient.removeQueries([['children', 'currentUser']]);
      queryClient.removeQueries();

      updateToken(token);
    },
  });
};

const useSwitchToParent = (axiosConfig) => {
  const { updateToken } = useJwt();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => authService.switchToParent(data, axiosConfig),
    onSuccess: ({ token, parent }) => {
      // queryClient.removeQueries(['currentChild']);
      // queryClient.removeQueries(['assignedAssessment']);
      queryClient.removeQueries();
      queryClient.setQueryData(['currentUser'], parent);

      updateToken(token);
    },
  });
};

export {
  useLogin,
  useSignup,
  useForgotPass,
  useResetPass,
  useVerifyEmail,
  useConfirmEmail,
  useChangePassword,
  useSwitchToChild,
  useSwitchToParent,
};
