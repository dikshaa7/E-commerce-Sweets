const User = require('../models/User');
const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');
const Review = require('../models/Review');
const Cart = require('../models/Cart');

const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const [orders, wishlist, reviews, cart] = await Promise.all([
      Order.find({ user: req.user._id }).sort({ createdAt: -1 }),
      Wishlist.findOne({ user: req.user._id }),
      Review.find({ user: req.user._id }),
      Cart.findOne({ user: req.user._id }),
    ]);

    const activeOrders = orders.filter((o) => !['Delivered', 'Cancelled'].includes(o.orderStatus));

    res.json({
      user,
      stats: {
        totalOrders: orders.length,
        activeOrders: activeOrders.length,
        pendingOrders: orders.filter((o) => o.orderStatus === 'Pending').length,
        deliveredOrders: orders.filter((o) => o.orderStatus === 'Delivered').length,
        cancelledOrders: orders.filter((o) => o.orderStatus === 'Cancelled').length,
        totalSpent: orders
          .filter((o) => o.orderStatus !== 'Cancelled')
          .reduce((sum, o) => sum + o.totalAmount, 0),
        wishlistCount: wishlist?.products?.length || 0,
        addressCount: user.addresses?.length || 0,
        reviewCount: reviews.length,
        cartCount: cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0,
      },
      recentOrders: orders.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserDashboard };
