import apiClient from '@/api/apiClient.js';

const authStartEndpoint = 'auth';

const login = async (data) => {
  return apiClient.post(`${authStartEndpoint}/login`, data);
};

const logout = (delayTimeSec = 0) => {
  localStorage.removeItem('jwt');

  setTimeout(() => (window.location.href = '/login'), delayTimeSec * 1000);
};

const signup = async (data) => {
  return apiClient.post(`${authStartEndpoint}/signup`, data);
};

const forgotPass = async (data) => {
  return apiClient.post(`${authStartEndpoint}/forgotPassword`, data);
};

const resetPass = async (data, token) => {
  return apiClient.patch(`${authStartEndpoint}/resetPassword/${token}`, data);
};

const verifyEmail = async (data) => {
  return apiClient.post(`${authStartEndpoint}/verify-email`, data);
};

const confirmEmail = async (token) => {
  return apiClient.post(`${authStartEndpoint}/confirm-email/${token}`, {}, { silent_error: true });
};

const updatePassword = async (data) => {
  return apiClient.patch(`${authStartEndpoint}/password`, data);
};

const switchToChild = async (data) => {
  const res = await apiClient.post(`${authStartEndpoint}/switch-to-child`, data);

  return { token: res.token };
};

const switchToParent = async (data, axiosConfig) => {
  const res = await apiClient.post(`${authStartEndpoint}/switch-to-parent`, data, axiosConfig);

  return { token: res.token, parent: res.data.parent };
};

export default {
  login,
  logout,
  signup,
  forgotPass,
  resetPass,
  verifyEmail,
  confirmEmail,
  updatePassword,
  switchToChild,
  switchToParent,
};
