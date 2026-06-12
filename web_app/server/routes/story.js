const router = require('express').Router();

const storyController = require('../controllers/story');

const storyMiddleware = require('../middlewares/story');

const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware.protectChild);

router.get('/', storyMiddleware.injectChildFeeling, storyController.getStories);

module.exports = router;
