const catchAsync = require('../utils/catchAsync');

const { AssessmentModel, TestModel, AssessmentTestModel } = require('../models/index');
const AppError = require('../utils/appError');
const { StatusCodes } = require('http-status-codes/build/cjs');
const { buildAdaptiveTestsPayload } = require('../utils/testEvaluation');

const populateChildAssessment = (extractAssessmentId) =>
  catchAsync(async (req, res, next) => {
    const assessmentId = extractAssessmentId(req);

    const assessment = await AssessmentModel.findOne({ _id: assessmentId, child_id: req.child._id });

    if (!assessment)
      throw new AppError(`Assessment With id: ${assessmentId} not found for this child.`, StatusCodes.NOT_FOUND);

    req.assessment = assessment;

    next();
  });

const createNextAssessment = async (req, res, next) => {
  const childId = req.child._id;

  const lastCompletedAssessment = req.assessment;

  try {
    const allTests = await TestModel.find().lean();

    if (!allTests.length) return new AppError('No core tests found.', StatusCodes.INTERNAL_SERVER_ERROR);

    const previousTests = lastCompletedAssessment
      ? await AssessmentTestModel.find({ assessment_id: lastCompletedAssessment._id }).lean()
      : [];

    const now = new Date();

    const newAssessment = await AssessmentModel.create({
      child_id: childId,
      status: 'in-progress',
      active_in: now.getTime() + 24 * 60 * 60 * 1000,
    });

    const testsPayload = buildAdaptiveTestsPayload(allTests, previousTests, newAssessment._id);

    await AssessmentTestModel.insertMany(testsPayload);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error(error);
  }
};

module.exports = { populateChildAssessment, createNextAssessment };
