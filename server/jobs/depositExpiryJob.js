const cron = require("node-cron");
const Order = require("../models/OrderModel");
const orderService = require("../services/OrderService");

/**
 * Job tự động quét và huỷ đơn hàng trả góp quá hạn
 * Chạy vào lúc 00:05 mỗi ngày: "5 0 * * *"
 */
const startDepositExpiryJob = () => {
  cron.schedule("5 0 * * *", async () => {
    console.log("[Cron Job] Bắt đầu quét các đơn trả góp quá hạn thanh toán phần còn lại...");
    try {
      const now = new Date();
      
      // Tìm các đơn là trả góp, đang cọc (deposited), trạng thái đơn processing, và đã qua hạn chót.
      const expiredOrders = await Order.find({
        isInstallment: true,
        paymentStatus: "deposited",
        orderStatus: "processing",
        depositDeadline: { $lte: now },
      });

      if (expiredOrders.length === 0) {
        console.log("[Cron Job] Không có đơn hàng cọc nào quá hạn thanh toán trong phiên quét này.");
        return;
      }

      console.log(`[Cron Job] Tìm thấy ${expiredOrders.length} đơn hàng quá hạn. Đang bắt đầu quá trình hủy và hoàn kho...`);

      for (const order of expiredOrders) {
        try {
          // Gọi hàm huỷ đơn hàng và cung cấp lý do
          await orderService.cancelOrder(
            order._id.toString(), 
            "Quá hạn thanh toán 70% (Hệ thống tự động hủy)"
          );
          console.log(`[Cron Job] Đã hủy thành công đơn hàng #${order._id.toString().slice(-6).toUpperCase()} và hoàn trả hàng tồn kho.`);
        } catch (err) {
          console.error(`[Cron Job] Lỗi khi tự động hủy đơn hàng #${order._id}:`, err.message);
        }
      }
      
      console.log("[Cron Job] Đã hoàn tất rà soát và xử lý các đơn hàng quá hạn.");
    } catch (error) {
      console.error("[Cron Job] Lỗi kết nối hoặc truy vấn CSDL:", error.message);
    }
  });
  
  console.log("[System] Deposit Expiry Cron Job đã được khởi động. Lịch: 00:05 hằng ngày.");
};

module.exports = startDepositExpiryJob;
