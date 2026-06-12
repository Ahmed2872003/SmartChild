const assessmentService = require('../../services/assessmentService');
const childService = require('../../services/childService');
const reportService = require('../../services/reportService');
const { sendAssessmentCompletionEmail } = require('../../utils/email.js');
const { assessmentEvents, overallReportEvents } = require('../events');

assessmentEvents.on('assessmentCompleted', async ({ child, assessment, tests }) => {
  try {
    await assessmentService.createNextAssessment(child._id, tests);

    await reportService.generateReport(assessment, tests);

    overallReportEvents.emit('updateOverallReport', { childId: child._id });

    const childWithParents = (
      await childService.getParents(child._id, { firstSelect: 'parent_id', secondSelect: 'email name' })
    )?.toObject();

    if (!childWithParents || !childWithParents.parents) return;

    childWithParents.parents.forEach(({ parent_id: parent }) => {
      const data = { parent, child: { name: child.name } };

      sendAssessmentCompletionEmail(data).catch((err) => {});
    });
  } catch (error) {
    console.error('Background task failed for assessment completion:', error);
  }
});
