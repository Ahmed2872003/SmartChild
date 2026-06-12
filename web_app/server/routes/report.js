const router = require('express').Router();

const reportController = require('../controllers/report');
const authMiddleware = require('../middlewares/auth');
const parentChildMiddleware = require('../middlewares/parentChild');

router.use(authMiddleware.protect);

router.use(
  '/*/:childId',
  parentChildMiddleware.checkParentChildLink((req) => req.params.childId),
);

router.get('/daily/:childId', reportController.getDailyReports);

router.get('/overall/:childId', reportController.getOverallReport);

module.exports = router;
