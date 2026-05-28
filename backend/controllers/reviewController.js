const Review = require('../models/Review');
const Order = require('../models/Order');

const getProductReviews = async (req, res) => {
  try {
    const filter = { product: req.params.productId };
    if (req.user?.role !== 'admin') filter.isVisible = true;
    const reviews = await Review.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, orderId } = req.body;
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order || order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Invalid order' });
      }
      const hasProduct = order.orderItems.some((i) => i.product.toString() === productId);
      if (!hasProduct) return res.status(400).json({ message: 'Product not in order' });
    }
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) return res.status(400).json({ message: 'Review already exists' });
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      order: orderId,
      rating,
      comment: comment || '',
    });
    const populated = await Review.findById(review._id).populate('user', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (req.user.role !== 'admin' && review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleReviewVisibility = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    review.isVisible = !review.isVisible;
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'name email')
      .populate('product', 'name image')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name image brand category')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleReviewVisibility,
  getAllReviews,
  getMyReviews,
};
