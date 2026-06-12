const AppError = require('../utils/appError');
const AssessmentTest = require('../models/assessmentTest');
const catchAsync = require('../utils/catchAsync');
const { StatusCodes } = require('http-status-codes/build/cjs');
const { AssessmentModel, AssessmentTestModel } = require('../models/index');

const checkAssessmentTestAuthority = (extractAssessmentTestId) =>
  catchAsync(async (req, res, next) => {
    const assessmentTestId = extractAssessmentTestId(req);

    const assessmentTest = await AssessmentTest.findById(assessmentTestId).populate('assessment_id');

    if (!assessmentTest) throw new AppError('Assessment Test not found.', StatusCodes.NOT_FOUND);

    const childTestOwner = assessmentTest.assessment_id.child_id.toString();

    if (req.child.id !== childTestOwner)
      throw new AppError(
        'Unauthorized access. You cannot submit results for a test you do not own.',
        StatusCodes.FORBIDDEN,
      );

    req.assessmentTest = assessmentTest;

    next();
  });

module.exports = { checkAssessmentTestAuthority };
