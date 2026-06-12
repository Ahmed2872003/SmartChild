const router = require('express').Router();

const testController = require('../controllers/test');

const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware.protectChild);

router.get('/', testController.getTests);

router.get('/desc', testController.getTestsDescription);

module.exports = router;
