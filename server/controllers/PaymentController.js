const vnpayService = require("../services/vnpayService");
const momoService = require("../services/momoService");
const orderService = require("../services/OrderService");

/**
 * Tạo URL thanh toán VNPAY
 */
const createVNPayPayment = async (req, res) => {
  try {
    const { orderId, orderInfo, orderType, locale } = req.body;

    // Validate input
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc: orderId",
      });
    }

    // Kiểm tra đơn hàng - sử dụng OrderService
    const order = await orderService.getOrderById(orderId);

    // Validate amount
    const amount = order.totalAmount;
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Số tiền thanh toán phải lớn hơn 0",
      });
    }

    // Kiểm tra đơn hàng đã thanh toán chưa
    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Đơn hàng đã được thanh toán",
      });
    }

    // Lấy IP address của client (VNPay yêu cầu IPv4)
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      "127.0.0.1";
    // Chuyển IPv6 sang IPv4 (::ffff:127.0.0.1 → 127.0.0.1, ::1 → 127.0.0.1)
    if (ipAddr === "::1") ipAddr = "127.0.0.1";
    if (ipAddr.startsWith("::ffff:")) ipAddr = ipAddr.slice(7);

    // Tạo URL thanh toán VNPAY
    const paymentUrl = vnpayService.createPaymentUrl({
      orderId,
      amount,
      orderInfo: orderInfo || `Thanh toán đơn hàng #${orderId}`,
      orderType: orderType || "other",
      locale: locale || "vn",
      ipAddr,
    });

    res.status(200).json({
      success: true,
      message: "Tạo URL thanh toán VNPAY thành công",
      paymentUrl,
    });
  } catch (error) {
    console.error("Create VNPAY Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo thanh toán VNPAY: " + error.message,
    });
  }
};

/**
 * Xử lý callback return từ VNPAY
 */
const vnpayReturn = async (req, res) => {
  try {
    const vnpParams = req.query;

    // Verify chữ ký và lấy kết quả
    const verifyResult = vnpayService.verifyReturnUrl(vnpParams);

    if (!verifyResult.isValid) {
      return res.status(400).json({
        success: false,
        message: "Chữ ký không hợp lệ",
      });
    }

    // Cập nhật trạng thái thanh toán - sử dụng OrderService
    if (verifyResult.isSuccess) {
      await orderService.updatePaymentStatus(
        verifyResult.orderId,
        "paid",
        "vnpay",
      );

      res.status(200).json({
        success: true,
        message: "Thanh toán thành công",
        data: {
          orderId: verifyResult.orderId,
          amount: verifyResult.amount,
          transactionNo: verifyResult.transactionNo,
          bankCode: verifyResult.bankCode,
          payDate: verifyResult.payDate,
        },
      });
    } else {
      await orderService.updatePaymentStatus(verifyResult.orderId, "failed");

      res.status(400).json({
        success: false,
        message: verifyResult.message,
        responseCode: verifyResult.responseCode,
      });
    }
  } catch (error) {
    console.error("VNPAY Return Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi xử lý callback VNPAY: " + error.message,
    });
  }
};

/**
 * Tạo thanh toán MoMo
 */
const createMoMoPayment = async (req, res) => {
  try {
    const { orderId, orderInfo, extraData, autoCapture, lang } = req.body;

    // Validate input
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc: orderId",
      });
    }

    // Kiểm tra đơn hàng - sử dụng OrderService
    const order = await orderService.getOrderById(orderId);

    // Validate amount
    const amount = order.totalAmount;
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Số tiền thanh toán phải lớn hơn 0",
      });
    }

    // Kiểm tra đơn hàng đã thanh toán chưa
    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Đơn hàng đã được thanh toán",
      });
    }

    // Tạo thanh toán MoMo
    const paymentResult = await momoService.createPayment({
      orderId,
      amount,
      orderInfo: orderInfo || `Thanh toán đơn hàng #${orderId}`,
      extraData: extraData || "",
      autoCapture: autoCapture !== false,
      lang: lang || "vi",
    });

    if (paymentResult.success) {
      res.status(200).json({
        success: true,
        message: "Tạo thanh toán MoMo thành công",
        payUrl: paymentResult.payUrl,
        qrCodeUrl: paymentResult.qrCodeUrl,
        deeplink: paymentResult.deeplink,
        deeplinkMiniApp: paymentResult.deeplinkMiniApp,
      });
    } else {
      res.status(400).json({
        success: false,
        message: paymentResult.message,
        resultCode: paymentResult.resultCode,
      });
    }
  } catch (error) {
    console.error("Create MoMo Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo thanh toán MoMo: " + error.message,
    });
  }
};

/**
 * Xử lý callback return từ MoMo (redirect URL)
 */
const momoReturn = async (req, res) => {
  try {
    const callbackData = req.query;

    // Verify chữ ký
    const verifyResult = momoService.verifyCallback(callbackData);

    if (!verifyResult.isValid) {
      return res.status(400).json({
        success: false,
        message: "Chữ ký không hợp lệ",
      });
    }

    // Tìm đơn hàng
    const order = await Order.findById(verifyResult.orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Cập nhật trạng thái thanh toán - sử dụng OrderService
    if (verifyResult.isSuccess) {
      await orderService.updatePaymentStatus(
        verifyResult.orderId,
        "paid",
        "momo",
      );

      res.status(200).json({
        success: true,
        message: "Thanh toán thành công",
        data: {
          orderId: verifyResult.orderId,
          amount: verifyResult.amount,
          transId: verifyResult.transId,
          payType: verifyResult.payType,
        },
      });
    } else {
      await orderService.updatePaymentStatus(verifyResult.orderId, "failed");

      res.status(400).json({
        success: false,
        message: verifyResult.message,
        resultCode: verifyResult.resultCode,
      });
    }
  } catch (error) {
    console.error("MoMo Return Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi xử lý callback MoMo: " + error.message,
    });
  }
};

/**
 * Xử lý IPN (Instant Payment Notification) từ MoMo
 */
const momoIPN = async (req, res) => {
  try {
    const ipnData = req.body;

    console.log("MoMo IPN received:", ipnData);

    // Verify chữ ký
    const verifyResult = momoService.verifyIPN(ipnData);

    if (!verifyResult.isValid) {
      return res.status(400).json({
        success: false,
        message: "Chữ ký không hợp lệ",
      });
    }

    // Cập nhật trạng thái thanh toán - sử dụng OrderService
    if (verifyResult.isSuccess) {
      await orderService.updatePaymentStatus(
        verifyResult.orderId,
        "paid",
        "momo",
      );

      // Response cho MoMo biết đã nhận IPN
      res.status(200).json({
        resultCode: 0,
        message: "Success",
      });
    } else {
      await orderService.updatePaymentStatus(verifyResult.orderId, "failed");

      res.status(200).json({
        resultCode: verifyResult.resultCode,
        message: verifyResult.message,
      });
    }
  } catch (error) {
    console.error("MoMo IPN Error:", error);
    res.status(500).json({
      resultCode: 99,
      message: "Lỗi xử lý IPN: " + error.message,
    });
  }
};

/**
 * Query trạng thái giao dịch MoMo
 */
const queryMoMoTransaction = async (req, res) => {
  try {
    const { orderId, requestId } = req.body;

    if (!orderId || !requestId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu orderId hoặc requestId",
      });
    }

    const result = await momoService.queryTransaction(orderId, requestId);

    res.status(200).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Query MoMo Transaction Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi query giao dịch: " + error.message,
    });
  }
};

module.exports = {
  createVNPayPayment,
  vnpayReturn,
  createMoMoPayment,
  momoReturn,
  momoIPN,
  queryMoMoTransaction,
};
