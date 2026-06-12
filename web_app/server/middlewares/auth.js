const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { promisify } = require('node:util');
const { StatusCodes } = require('http-status-codes/build/cjs');
const Parent = require('../models/parent');
const Child = require('../models/child');
const catchAsync = require('../utils/catchAsync');

const verifyTokenAndParent = async (req) => {
  if (!req.headers.authorization?.startsWith('Bearer')) {
    throw new AppError("You're not logged in! Please log in to get access.", StatusCodes.UNAUTHORIZED);
  }

  const token = req.headers.authorization.split(' ')[1];

  let decoded;

  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    err.statusCode = StatusCodes.UNAUTHORIZED;
    throw err;
  }

  const parentId = decoded.parent?.id || decoded.id;

  const currentUser = await Parent.findById(parentId).select('+password');
  if (!currentUser) {
    throw new AppError('The user belonging to this token does not exist.', StatusCodes.UNAUTHORIZED);
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    throw new AppError('Password was recently changed! Please log in again.', StatusCodes.UNAUTHORIZED);
  }

  return { decoded, currentUser };
};

const protect = catchAsync(async (req, res, next) => {
  const { decoded, currentUser } = await verifyTokenAndParent(req);

  if (decoded.role !== 'parent') {
    throw new AppError('Access denied. Parent mode required.', StatusCodes.FORBIDDEN);
  }

  req.user = currentUser;
  next();
});

const protectChild = catchAsync(async (req, res, next) => {
  const { decoded, currentUser } = await verifyTokenAndParent(req);

  if (decoded.role !== 'child' || !decoded.childId) {
    throw new AppError('Access denied. Child mode required.', StatusCodes.FORBIDDEN);
  }

  const currentChild = await Child.findById(decoded.childId);

  if (!currentChild) {
    throw new AppError('Child profile not found or access denied.', StatusCodes.UNAUTHORIZED);
  }

  req.parent = currentUser;
  req.child = currentChild;
  next();
});

const verifyToken = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization?.startsWith('Bearer')) {
    throw new AppError("You're not logged in! Please log in to get access.", StatusCodes.UNAUTHORIZED);
  }

  const token = req.headers.authorization.split(' ')[1];

  let decoded;

  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    err.statusCode = StatusCodes.UNAUTHORIZED;
    throw err;
  }

  req.decodedJwt = decoded;

  next();
});

module.exports = { protect, protectChild, verifyToken };
