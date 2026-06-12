const router = require('express').Router();

const authMiddleware = require('../middlewares/auth');

const chatSessionController = require('../controllers/chatSession');
const chatSessionMiddleware = require('../middlewares/chatSession');

router.use(authMiddleware.verifyToken);

router.post('/', chatSessionMiddleware.adjustReqPayload('body'), chatSessionController.createSession);

router.get('/', chatSessionMiddleware.adjustReqPayload('query'), chatSessionController.getSessions);

router.delete('/:id', chatSessionController.deleteSession);

module.exports = router;
