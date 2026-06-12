const AppError = require('../utils/appError');
const { apiClient } = require('../config/axios');
const { StatusCodes } = require('http-status-codes/build/cjs');

const chat = async (data, sender, isStream) => {
  try {
    const customHeaders = {
      ...(isStream && { Accept: 'text/event-stream' }),
    };

    const response = await apiClient.post(`/chatbot/${sender}?stream=${isStream}`, data, {
      responseType: isStream ? 'stream' : 'json',
      headers: customHeaders,
    });

    return response;
  } catch (error) {
    throw new AppError('AI API Error', StatusCodes.BAD_GATEWAY);
  }
};

module.exports = { chat };
