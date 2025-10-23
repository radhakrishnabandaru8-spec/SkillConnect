const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const User = require('../models/User');

// Post review
router.post('/', auth, async (req, res) => {
  const { reviewee, rating, comment } = req.body;
  try {
    const review = new Review({ reviewer: req.user._id, reviewee, rating, comment });
    await review.save();

    // Update reviewee rating
    const user = await User.findById(reviewee);
    user.rating = ((user.rating * user.ratingCount) + rating) / (user.ratingCount + 1);
    user.ratingCount += 1;
    await user.save();

    res.json(review);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;

