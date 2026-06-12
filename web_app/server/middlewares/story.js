const { OverallReportModel } = require('../models/index');
const catchAsync = require('../utils/catchAsync');

const injectChildFeeling = catchAsync(async (req, res, next) => {
  const childId = req.child.id;

  const report = await OverallReportModel.findOne({ child_id: childId });

  if (report && report.overall_feeling)
    req.query.category = report.overall_feeling === 'N/A' ? 'happiness' : report.overall_feeling;
  else req.query.category = 'happiness';

  next();
});

module.exports = { injectChildFeeling };
