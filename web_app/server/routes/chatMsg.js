const router = require('express').Router();

const authMiddleware = require('../middlewares/auth');
const chatSessionMiddleware = require('../middlewares/chatSession');

const chatMsgController = require('../controllers/chatMsg');

router.use(authMiddleware.verifyToken);

router.post(
  '/',
  chatSessionMiddleware.adjustReqPayload('body'),
  chatSessionMiddleware.ensureChatSession,
  chatMsgController.sendMsg,
);

router.get('/', chatMsgController.getMsgs);

module.exports = router;
