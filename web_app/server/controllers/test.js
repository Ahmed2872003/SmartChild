const factoryHandler = require('./handlerFactory');

const Test = require('../models/test');
const catchAsync = require('../utils/catchAsync');

const { assessmentThresholds: thresholds } = require('../constants/thresholds');

const getTests = factoryHandler.getMany(Test);

const getTestsDescription = catchAsync(async (req, res, next) => {
  const testsDescription = await Test.find().populate({ path: 'descriptions' }).select('-description');

  res.json({ data: { results: testsDescription.length, testsDescription, thresholds } });
});

module.exports = { getTests, getTestsDescription };
