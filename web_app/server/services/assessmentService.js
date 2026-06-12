const { StatusCodes } = require('http-status-codes/build/cjs');
const { TestModel, AssessmentTestModel, AssessmentModel } = require('../models/index');
const AppError = require('../utils/appError');

const { buildAdaptiveTestsPayload } = require('../utils/testEvaluation');

const reportService = require('./reportService');

const { assessmentEvents } = require('../events/events');

const createNextAssessment = async (childId, previousTests) => {
  try {
    const allTests = await TestModel.find().lean();
    if (!allTests.length) throw new Error('No core tests found.');

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

const handleAssessmentOnCompletion = async (assessment, child) => {
  const assessmentTests = await AssessmentTestModel.find({
    assessment_id: assessment._id,
  });

  const totalTests = assessmentTests.length;
  const completedTests = assessmentTests.filter((test) => test.isCompleted);

  if (completedTests.length < totalTests) {
    return {
      status: 'in_progress',
      progress: `${completedTests.length}/${totalTests}`,
      completionPayload: null,
    };
  }

  const TotalStarsEarned = assessmentTests.reduce((acc, test) => acc + test.starsEarned, 0);

  assessment.status = 'completed';
  await assessment.save();

  child.num_of_stars = Math.max(0, child.num_of_stars + TotalStarsEarned);
  await child.save();

  const leanPreviousTests = assessmentTests.map((test) => test.toObject());

  assessmentEvents.emit('assessmentCompleted', { child, assessment: assessment.toObject(), tests: leanPreviousTests });

  return {
    status: 'completed',
    progress: `${totalTests}/${totalTests}`,
    completionPayload: {
      TotalStarsEarned,
    },
  };
};

module.exports = { createNextAssessment, handleAssessmentOnCompletion };
