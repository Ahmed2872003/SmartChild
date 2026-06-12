const AppError = require('../utils/appError');
const { apiClient } = require('../config/axios');
const FileService = require('./FileService');
const FormData = require('form-data');
const { StatusCodes } = require('http-status-codes/build/cjs');

const classifyImage = async (imageFile) => {
  const formData = new FormData();

  const fileStream = FileService.getFileStream(imageFile.filename);

  formData.append('file', fileStream, imageFile.filename);

  try {
    const res = await apiClient.post('emotion/predict', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return res.data;
  } catch (err) {
    const res = err.response?.data;

    if (res && res.detail[0].type === 'missing') throw new AppError('Image field is requried', StatusCodes.BAD_REQUEST);

    throw err;
  }
};

module.exports = { classifyImage };
