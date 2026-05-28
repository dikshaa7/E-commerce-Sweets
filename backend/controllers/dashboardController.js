const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      salesResult,
      dailyOrders,
      monthlyOrders,
      bestSelling,
      lowStock,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Order.countDocuments({ orderStatus: 'Delivered' }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Order.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $unwind: '$orderItems' },
        {
          $group: {
            _id: '$orderItems.product',
            name: { $first: '$orderItems.name' },
            totalSold: { $sum: '$orderItems.quantity' },
            revenue: {
              $sum: {
                $multiply: [
                  '$orderItems.quantity',
                  {
                    $cond: [
                      { $gt: ['$orderItems.discountPrice', 0] },
                      '$orderItems.discountPrice',
                      '$orderItems.price',
                    ],
                  },
                ],
              },
            },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ]),
      Product.find({
        $expr: { $lte: ['$stock', '$lowStockThreshold'] },
      })
        .populate('brand category')
        .limit(10),
    ]);

    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSales: salesResult[0]?.total || 0,
      dailyOrders,
      monthlyOrders,
      bestSelling,
      lowStock,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
