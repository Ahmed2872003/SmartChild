const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { StatusCodes } = require('http-status-codes');

const populateFileToBody = ({ propertyName, optional = false }) =>
  catchAsync(async (req, res, next) => {
    if (!req.file && !optional) new AppError(`Please upload ${propertyName}.`, StatusCodes.BAD_REQUEST);

    if (req.file) req.body[propertyName] = req.file.filename;

    next();
  });

module.exports = { populateFileToBody };
