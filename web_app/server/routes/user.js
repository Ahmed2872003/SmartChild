const express = require('express');
const router = express.Router();

const parentController = require('../controllers/parent');

const parentChecksMiddleware = require('../middlewares/parentChecks');

const authMiddleware = require('../middlewares/auth');

const setIdAsParam = require(`../middlewares/setIdAsParam.js`);

const upload = require('../middlewares/upload.js');

router.use('/me', authMiddleware.protect);

router
  .route('/me')
  .get(setIdAsParam('user'), parentController.getUser)
  .patch(upload.single('photo'), parentController.updateUser)
  .delete(parentController.deleteMyAccount);

router
  .route('/delete/:id')
  .delete(authMiddleware.protect, parentChecksMiddleware.restrictTo('admin'), parentController.deleteUser);

// router.route('/').get(parentController.getAllUsers);

router.route('/:id').get(parentController.getUser);

module.exports = router;
