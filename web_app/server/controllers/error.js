const { StatusCodes } = require('http-status-codes');
const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => new AppError(`Invalid ${err.path}: ${err.value}.`, StatusCodes.BAD_REQUEST);

const handleDuplicateKeyNameDB = (err) => {
  const value = Object.values(err.keyValue)[0];
  return new AppError(`Duplicate field value '${value}'.`, StatusCodes.BAD_REQUEST);
};

const handleFileLimitError = () =>
  new AppError(`Maximum file size is ${process.env.MAX_FILE_SIZE_MB}mb`, StatusCodes.BAD_REQUEST);

const handleValidationErrorDB = (err) => new AppError(err.message, StatusCodes.BAD_REQUEST);

const handleJWTError = () => new AppError('Invalid token. Please log in again!', StatusCodes.UNAUTHORIZED);

const handleTokenExpiredError = () => new AppError('Session expired. Please log in again!', StatusCodes.UNAUTHORIZED);

const errorHandlers = [
  { predicate: (e) => e.name === 'CastError', handler: handleCastErrorDB },
  { predicate: (e) => e.code === 11000, handler: handleDuplicateKeyNameDB },
  { predicate: (e) => e.code === 'LIMIT_FILE_SIZE', handler: handleFileLimitError },
  { predicate: (e) => e.name === 'ValidationError', handler: handleValidationErrorDB },
  { predicate: (e) => e.name === 'JsonWebTokenError', handler: handleJWTError },
  { predicate: (e) => e.name === 'TokenExpiredError', handler: handleTokenExpiredError },
];

const simplifyError = (err) => {
  const match = errorHandlers.find(({ predicate }) => predicate(err));
  return match ? match.handler(err) : err;
};

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(err.statusCode).json({
      status: err.status,
      message: 'Something went wrong!',
    });
  }
};

module.exports = async (err, req, res, next) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else {
    const userErr = simplifyError(err);
    sendErrProd(userErr, res);
  }
};
