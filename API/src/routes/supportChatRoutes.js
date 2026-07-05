const express = require('express');
const router = express.Router();

const {
  getSupportMessages,
  getSupportThreads,
  sendSupportMessage,
  markThreadRead,
} = require('../controllers/supportChatController');
const authenticateToken = require('../middleware/verifyToken.js');

router.get('/threads', authenticateToken, getSupportThreads);
router.get('/:userId/messages', authenticateToken, getSupportMessages);
router.post('/:userId/messages', authenticateToken, sendSupportMessage);
router.put('/:userId/read', authenticateToken, markThreadRead);

module.exports = router;