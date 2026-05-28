const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleReviewVisibility,
  getAllReviews,
  getMyReviews,
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

router.get('/all', protect, admin, getAllReviews);
router.get('/my', protect, getMyReviews);
router.get('/product/:productId', getProductReviews);
router.get('/:productId', getProductReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/toggle', protect, admin, toggleReviewVisibility);

module.exports = router;
