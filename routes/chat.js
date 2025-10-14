const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const msg = new Message({ ...req.body, from: req.user._id });
    await msg.save();
    res.json(msg);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get chat messages by chatId
router.get('/:chatId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).populate('from to', 'name');
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;

