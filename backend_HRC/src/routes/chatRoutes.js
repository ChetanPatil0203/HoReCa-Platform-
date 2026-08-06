const express = require('express');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All chat routes are protected with authMiddleware
router.post('/session', authMiddleware, chatController.createSession);
router.get('/sessions', authMiddleware, chatController.getSessions);
router.delete('/sessions/:sessionId', authMiddleware, chatController.deleteSession);
router.get('/sessions/:sessionId/messages', authMiddleware, chatController.getSessionMessages);
router.post('/message', authMiddleware, chatController.sendMessage);

module.exports = router;
