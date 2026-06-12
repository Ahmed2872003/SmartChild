const router = require('express').Router();

const upload = require('../middlewares/upload');
const assessmentController = require('../controllers/assessment');
const assessmentMiddleware = require('../middlewares/assessment');
const assessmentTestMiddleware = require('../middlewares/assessmentTest');

const auth = require('../middlewares/auth');

router.use(auth.protectChild);

router.get('/assigned', assessmentController.getAssignedAssessment);

router.get(
  '/:assessmentId/tests',
  assessmentMiddleware.populateChildAssessment((req) => req.params.assessmentId),
  assessmentController.getAssessmentTests,
);

router.post(
  '/test/:assessmentTestId',
  assessmentTestMiddleware.checkAssessmentTestAuthority((req) => req.params.assessmentTestId),
  upload.single('image'),
  assessmentController.storeAsessmentTestResult,
);

module.exports = router;
