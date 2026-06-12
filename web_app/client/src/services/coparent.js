import apiClient from '@/api/apiClient';

const coparentStartEndpoint = 'coparent';

const requestCoparent = async (shareCode) => {
  await apiClient.post(coparentStartEndpoint, { shareCode });
};

const replyCoparent = async (action, token) => {
  await apiClient.patch(`${coparentStartEndpoint}/${token}?action=${action}`, {}, { silent_error: true });
};

export { requestCoparent, replyCoparent };
