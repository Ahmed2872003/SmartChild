const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError.js');
const APIFeatures = require('./../utils/apifeatures');
const { StatusCodes } = require('http-status-codes');
const filterObj = require('../utils/filterObj.js');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    const docName = Model.modelName.toLowerCase();

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: {
        [docName]: doc,
      },
    });
  });

exports.updateOne = (Model, { sendResponse = true, allowedFields = ['name', 'age', 'gender', 'photo'] } = {}) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const docName = Model.modelName.toLowerCase();

    const capitalizedName = docName.charAt(0).toUpperCase() + docName.slice(1);

    const doc = await Model.findById(id);

    if (!doc) {
      return next(new AppError(`Document with ID '${id}' not found.`, StatusCodes.NOT_FOUND));
    }

    req[`old${capitalizedName}`] = doc.toObject();

    const filteredBody = filterObj(req.body, ...allowedFields);

    Object.keys(filteredBody).forEach((key) => {
      doc[key] = req.body[key];
    });

    await doc.save();

    req[`new${capitalizedName}`] = doc;

    if (!sendResponse) return next();

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        [docName]: doc,
      },
    });
  });

exports.deleteOne = (Model, sendResponse = true) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    const docName = Model.modelName.toLowerCase();
    const capitalizedName = docName.charAt(0).toUpperCase() + docName.slice(1);

    const doc = await Model.findById(id);

    if (!doc) {
      const err = new AppError(`Document with ID '${id}' not found.`, StatusCodes.NOT_FOUND);
      return next(err);
    }

    req[`old${capitalizedName}`] = doc.toObject();

    await doc.deleteOne();

    if (!sendResponse) return next();

    res.status(StatusCodes.NO_CONTENT).json({
      status: 'success',
      data: null,
    });
  });

exports.getOne = (Model, sendResponse = true) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findById(id);

    if (!doc) throw new AppError(`Document with ID '${id}' not found.`, StatusCodes.NOT_FOUND);

    const docName = Model.modelName.toLowerCase();

    req[docName] = doc;

    if (!sendResponse) return next();

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        [docName]: doc,
      },
    });
  });

exports.getMany = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query).sort().select().filter().paginate();

    const docs = await features.query;

    const docsName = `${Model.modelName.toLowerCase()}List`;

    res.status(StatusCodes.OK).json({
      status: 'success',
      results: docs.length,
      data: {
        [docsName]: docs,
      },
    });
  });

exports.getOneWithDeepPopulate = (Model, queryConfig, populateConfig, sendResponse = true) =>
  catchAsync(async (req, res, next) => {
    const {
      firstPath,
      firstSelect = null,
      firstMatch = {},
      secondPath,
      secondModel,
      secondSelect = null,
    } = populateConfig;

    const filter = queryConfig.generateFilter(req);

    const docName = Model.modelName.toLowerCase();

    const innerPopulate = {
      path: secondPath,
      select: secondSelect,
    };

    if (secondModel) innerPopulate.model = secondModel;

    const doc = await Model.findOne(filter).select(queryConfig.select).populate({
      path: firstPath,
      match: firstMatch,
      select: firstSelect,
      populate: innerPopulate,
    });

    if (!doc) throw new AppError(`No ${Model.modelName} found with this data.`, StatusCodes.NOT_FOUND);

    if (!sendResponse) {
      req[docName] = doc;
      return next();
    }
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        [docName]: doc,
      },
    });
  });
