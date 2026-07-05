const express = require('express');
const router = express.Router();

const {
  getCurrentAnnouncement,
  getAnnouncement,
  updateAnnouncement,
} = require('../controllers/announcementController');
const authenticateToken = require('../middleware/verifyToken.js');

router.get('/current', authenticateToken, getCurrentAnnouncement);
router.get('/', authenticateToken, getAnnouncement);
router.put('/', authenticateToken, updateAnnouncement);

module.exports = router;
