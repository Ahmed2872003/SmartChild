const router = require('express').Router();

const coparentController = require('../controllers/coparent');

const authMiddleware = require('../middlewares/auth');
const parentChecksMiddleware = require('../middlewares/parentChecks');
const parentChildMiddleware = require('../middlewares/parentChild');
const tokenMiddleware = require('../middlewares/token');

router.post(
  '/',
  authMiddleware.protect,
  parentChecksMiddleware.restrictToVerified,
  parentChildMiddleware.populateChildPrimaryParent,
  coparentController.requestCoParentAccess,
);

router.patch(
  '/:token',
  tokenMiddleware.resolveCoparentToken((req) => req.params.token),
  coparentController.populateCoparentRequestData,
  coparentController.replyCoParentAcess,
);

module.exports = router;
