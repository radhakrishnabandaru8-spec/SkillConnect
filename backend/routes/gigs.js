const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Gig = require('../models/Gig');

// Create a new gig
router.post('/', auth, async (req, res) => {
  try {
    const gig = new Gig({ ...req.body, owner: req.user._id });
    await gig.save();
    res.json(gig);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all gigs
router.get('/', async (req, res) => {
  try {
    const gigs = await Gig.find().populate('owner', 'name skills rating');
    res.json(gigs);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
 
