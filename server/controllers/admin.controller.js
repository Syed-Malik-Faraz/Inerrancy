import Order from '../models/Order.model.js';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';

// GET /api/admin/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueAgg,
      pendingOrders,
      recentOrders,
      topProducts,
      monthlyRevenue,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments({ status: 'pending' }),
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.product', name: { $first: '$items.name' }, image: { $first: '$items.image' }, totalSold: { $sum: '$items.qty' }, revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } } } },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            revenue: { $sum: '$totalAmount' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyData = monthlyRevenue.map(m => ({
      month: monthNames[m._id.month - 1],
      revenue: m.revenue,
      orders: m.orders,
    }));

    res.json({
      success: true,
      stats: { totalUsers, totalProducts, totalOrders, totalRevenue, pendingOrders },
      recentOrders,
      topProducts,
      monthlyData,
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
