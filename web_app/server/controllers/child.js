const handlerFactory = require('./handlerFactory');
const ParentModel = require('../models/parent');
const ChildModel = require('../models/child');
const TestModel = require('../models/test');
const AssessmentModel = require('../models/assessment');
const AssessmentTestModel = require('../models/assessmentTest');
const ParentChild = require('../models/parentChild');
const catchAsync = require('../utils/catchAsync');
const { StatusCodes } = require('http-status-codes');
const OverallReportModel = require('../models/overallReport');

const getChild = handlerFactory.getOne(ChildModel);

const getChildren = handlerFactory.getOneWithDeepPopulate(
  ParentModel,
  {
    generateFilter: (req) => ({
      _id: req.user.id,
    }),
    select: 'id',
  },
  {
    firstPath: 'children',
    firstMatch: { status: 'accepted' },
    secondPath: 'child_id',
  },
);

const updateChild = handlerFactory.updateOne(ChildModel, {
  sendResponse: false,
  allowedFields: ['name', 'age', 'gender', 'photo'],
});

const getCurrentChild = catchAsync((req, res, next) => {
  res.json({
    status: 'success',
    data: {
      child: req.child,
    },
  });
});

const createChild = catchAsync(async (req, res, next) => {
  const parentId = req.user.id;

  const newChild = await ChildModel.create(req.body);

  await ParentChild.create({
    parent_id: parentId,
    child_id: newChild._id,
    is_owner: true,
    status: 'accepted',
  });

  const assessment = await AssessmentModel.create({
    child_id: newChild._id,
    status: 'in-progress',
    active_in: Date.now(),
  });

  const allTests = await TestModel.find({});

  const assessmentTests = allTests.map((test) => {
    return {
      assessment_id: assessment._id,
      test_id: test._id,
    };
  });

  await AssessmentTestModel.insertMany(assessmentTests);

  await OverallReportModel.create({ child_id: newChild._id });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      child: newChild,
    },
  });
});

const sendUpdateResponse = async (req, res, next) => {
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      child: req.newChild,
    },
  });
};

const deleteChild = handlerFactory.deleteOne(ChildModel, false);

const sendDeleteResponse = async (req, res, next) => {
  res.sendStatus(StatusCodes.NO_CONTENT);
};

module.exports = {
  createChild,
  getChildren,
  getChild,
  getCurrentChild,
  updateChild,
  sendUpdateResponse,
  deleteChild,
  sendDeleteResponse,
};
