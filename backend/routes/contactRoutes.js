const express = require('express');
const router = express.Router();
const { createMessage, getMessages, toggleRead, deleteMessage } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

router.post('/', createMessage);
router.get('/', protect, admin, getMessages);
router.put('/:id/toggle-read', protect, admin, toggleRead);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
