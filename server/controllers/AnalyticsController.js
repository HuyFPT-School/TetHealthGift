const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");

/**
 * GET /api/analytics/dashboard
 * Lấy tất cả dữ liệu thống kê cho dashboard admin
 */
const getDashboardStats = async (req, res) => {
  try {
    // Lấy ngày hôm nay (start và end)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Đơn hàng hôm nay
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // 2. Doanh thu hôm nay (chỉ tính đơn hợp lệ)
    const todayRevenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          orderStatus: { $ne: "cancelled" },
          $or: [{ paymentMethod: "cod" }, { paymentStatus: "paid" }],
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);
    const todayRevenue = todayRevenueResult[0]?.total || 0;

    // 3. Sản phẩm sắp hết (quantity < 10)
    const lowStockProducts = await Product.countDocuments({
      quantity: { $lt: 10 },
    });

    // 4. Tổng số sản phẩm
    const totalProducts = await Product.countDocuments();

    // 5. Tổng doanh thu (tất cả đơn hợp lệ)
    const totalRevenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: "cancelled" },
          $or: [{ paymentMethod: "cod" }, { paymentStatus: "paid" }],
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // 6. Đơn hàng chờ xác nhận (processing)
    const pendingOrders = await Order.countDocuments({
      orderStatus: "processing",
    });

    // 7. Biểu đồ doanh thu 7 ngày gần đây
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const revenueByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          orderStatus: { $ne: "cancelled" },
          $or: [{ paymentMethod: "cod" }, { paymentStatus: "paid" }],
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Format cho recharts (cần đầy đủ 7 ngày)
    const revenueChart = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayData = revenueByDay.find((d) => d._id === dateStr);
      revenueChart.push({
        date: `Th ${7 - i}`,
        revenue: dayData?.revenue || 0,
      });
    }

    // 8. Đơn hàng gần đây (10 đơn mới nhất)
    const recentOrders = await Order.find()
      .populate("customer", "fullname email")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("_id customer totalAmount orderStatus createdAt");

    // 9. Phân bố danh mục (số lượng sản phẩm theo category)
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: {
          path: "$categoryInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: { $ifNull: ["$categoryInfo.name", "Không xác định"] },
          value: "$count",
        },
      },
    ]);

    // Trả về response
    res.status(200).json({
      message: "Lấy thống kê dashboard thành công",
      data: {
        kpis: {
          todayOrders,
          todayRevenue,
          lowStockProducts,
          totalProducts,
          totalRevenue,
          pendingOrders,
        },
        revenueChart,
        recentOrders,
        categoryDistribution: categoryStats,
      },
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  getDashboardStats,
};
