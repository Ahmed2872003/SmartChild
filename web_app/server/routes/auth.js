const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const childController = require('../controllers/child');
const authMiddleware = require(`../middlewares/auth`);
const parentChildMiddleware = require('../middlewares/parentChild');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/verify-email', authController.verifyEmail);

router.post('/confirm-email/:token', authController.confirmEmail);

router.post('/forgotPassword', authController.forgotPassword);

router.patch('/resetPassword/:token', authController.resetPassword);

router.route('/password').patch(authMiddleware.protect, authController.updatePassword);

router.post(
  '/switch-to-child',
  authMiddleware.protect,
  parentChildMiddleware.checkParentChildLink((req) => req.body.childId),
  authController.switchToChild,
);

router.post('/switch-to-parent', authMiddleware.protectChild, authController.switchToParent);

module.exports = router;
