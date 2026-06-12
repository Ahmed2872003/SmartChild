const Parent = require('../models/parent');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');
const factory = require('./handlerFactory');
const { StatusCodes } = require('http-status-codes');
const FileService = require('../services/FileService');

exports.getUser = factory.getOne(Parent);

exports.deleteUser = factory.deleteOne(Parent);

exports.getAllUsers = factory.getMany(Parent);

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for user password updates.', StatusCodes.BAD_REQUEST));
  }

  const currentUser = await Parent.findById(req.user.id);

  if (req.file) {
    FileService.deleteFile(currentUser.photo).catch((err) => {});

    req.body.photo = req.file.filename;
  }

  const filteredBody = filterObj(req.body, 'name', 'photo');

  Object.keys(filteredBody).forEach((el) => {
    currentUser[el] = filteredBody[el];
  });

  const updatedUser = await currentUser.save({ validateBeforeSave: true });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: { parent: updatedUser },
  });
});

exports.deleteMyAccount = catchAsync(async (req, res, next) => {
  await Parent.findByIdAndUpdate(req.user.id, { active: false });
  res.status(StatusCodes.NO_CONTENT).json({ status: 'success', data: null });
});
