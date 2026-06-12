const { StatusCodes } = require('http-status-codes/build/cjs');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const restrictTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (!req.user) throw new AppError(null, StatusCodes.INTERNAL_SERVER_ERROR);

    if (!roles.includes(req.user.role)) throw new AppError('Permission denied.', StatusCodes.FORBIDDEN);

    next();
  });

const restrictToVerified = catchAsync(async (req, res, next) => {
  if (!req.user) throw new AppError(null, StatusCodes.INTERNAL_SERVER_ERROR);

  if (!req.user.verifiedEmail)
    throw new AppError('Your email is not verified. Please verify to access this feature.', StatusCodes.FORBIDDEN);

  next();
});

module.exports = { restrictTo, restrictToVerified };
