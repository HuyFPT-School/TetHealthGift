const cron = require("node-cron");
const Order = require("../models/OrderModel");
const orderService = require("../services/OrderService");

/**
 * Job tự động quét và hủy đơn hàng trả góp quá hạn
 * Xử lý 2 trường hợp:
 *   1. paymentStatus = "pending"  → chưa cọc lần nào, quá hạn depositDeadline
 *   2. paymentStatus = "deposited" → đã cọc 30%, chưa trả 70% còn lại, quá hạn
 * Chạy vào lúc 00:05 mỗi ngày
 */
const startDepositExpiryJob = () => {
  cron.schedule("5 0 * * *", async () => {
    console.log("[Cron Job] Bắt đầu quét các đơn trả góp quá hạn...");
    try {
      const now = new Date();

      const expiredOrders = await Order.find({
        isInstallment: true,
        paymentStatus: { $in: ["pending", "deposited"] },
        orderStatus: "processing",
        depositDeadline: { $lte: now },
      });

      if (expiredOrders.length === 0) {
        console.log("[Cron Job] Không có đơn trả góp nào quá hạn trong phiên này.");
        return;
      }

      console.log(`[Cron Job] Tìm thấy ${expiredOrders.length} đơn quá hạn. Đang xử lý...`);

      for (const order of expiredOrders) {
        try {
          const isPending = order.paymentStatus === "pending";
          const reason = isPending
            ? "Quá hạn đặt cọc 30% (Hệ thống tự động hủy)"
            : "Quá hạn thanh toán 70% còn lại (Hệ thống tự động hủy)";

          await orderService.cancelOrder(order._id.toString(), reason);

          console.log(
            `[Cron Job] Đã hủy đơn #${order._id.toString().slice(-6).toUpperCase()} | ` +
            `Lý do: ${reason}`
          );
        } catch (err) {
          console.error(`[Cron Job] Lỗi khi hủy đơn #${order._id}:`, err.message);
        }
      }

      console.log("[Cron Job] Hoàn tất xử lý các đơn quá hạn.");
    } catch (error) {
      console.error("[Cron Job] Lỗi kết nối hoặc truy vấn CSDL:", error.message);
    }
  });

  console.log("[System] Deposit Expiry Cron Job đã khởi động. Lịch: 00:05 hằng ngày.");
};

module.exports = startDepositExpiryJob;
