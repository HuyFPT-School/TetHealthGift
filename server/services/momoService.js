const crypto = require("crypto");
const axios = require("axios");
const momoConfig = require("../config/momo");

class MoMoService {
  /**
   * Tạo yêu cầu thanh toán MoMo
   * @param {Object} paymentData - Thông tin thanh toán
   * @returns {Object} Kết quả từ MoMo API
   */
  async createPayment(paymentData) {
    const {
      orderId,
      amount,
      orderInfo,
      extraData = "",
      autoCapture = true,
      lang = "vi",
    } = paymentData;

    // Validate input
    if (!orderId || !amount || !orderInfo) {
      throw new Error("Thiếu thông tin bắt buộc để tạo thanh toán");
    }

    // MoMo yêu cầu amount phải là số nguyên dương
    const roundedAmount = Math.round(Number(amount));
    if (isNaN(roundedAmount) || roundedAmount <= 0) {
      throw new Error("Số tiền thanh toán không hợp lệ");
    }

    // Tạo requestId và orderId unique
    const requestId = `${orderId}_${Date.now()}`;
    const orderIdUnique = orderId;

    // Tạo raw signature theo đúng format của MoMo
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${roundedAmount}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderIdUnique}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=${momoConfig.requestType}`;

    // Tạo chữ ký HMAC SHA256
    const signature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    // Tạo request body
    const requestBody = {
      partnerCode: momoConfig.partnerCode,
      partnerName: "TetHealthGift",
      storeId: "TetHealthGiftStore",
      requestId: requestId,
      amount: roundedAmount,
      orderId: orderIdUnique,
      orderInfo: orderInfo,
      redirectUrl: momoConfig.redirectUrl,
      ipnUrl: momoConfig.ipnUrl,
      lang: lang,
      requestType: momoConfig.requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      signature: signature,
    };

    try {
      // Gọi API MoMo
      const response = await axios.post(momoConfig.apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return {
        success: response.data.resultCode === 0,
        resultCode: response.data.resultCode,
        message: response.data.message,
        payUrl: response.data.payUrl,
        qrCodeUrl: response.data.qrCodeUrl,
        deeplink: response.data.deeplink,
        deeplinkMiniApp: response.data.deeplinkMiniApp,
      };
    } catch (error) {
      console.error("MoMo API Error:", error.response?.data || error.message);
      throw new Error(
        `Không thể tạo thanh toán MoMo: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  /**
   * Xác thực chữ ký IPN từ MoMo
   * @param {Object} ipnData - Data từ MoMo IPN callback
   * @returns {Object} Kết quả xác thực
   */
  verifyIPN(ipnData) {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = ipnData;

    // Tạo raw signature để verify
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    // Tạo chữ ký để verify
    const verifySignature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    // So sánh chữ ký
    const isValid = signature === verifySignature;

    return {
      isValid,
      isSuccess: isValid && resultCode === 0,
      resultCode,
      orderId,
      requestId,
      amount,
      transId,
      message: this.getResultMessage(resultCode),
      payType,
      responseTime,
    };
  }

  /**
   * Xác thực callback từ redirect URL
   * @param {Object} callbackData - Data từ MoMo redirect
   * @returns {Object} Kết quả xác thực
   */
  verifyCallback(callbackData) {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = callbackData;

    // Tạo raw signature để verify
    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    // Tạo chữ ký để verify
    const verifySignature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    // So sánh chữ ký
    const isValid = signature === verifySignature;

    return {
      isValid,
      isSuccess: isValid && resultCode === 0,
      resultCode,
      orderId,
      requestId,
      amount,
      transId,
      message: this.getResultMessage(resultCode),
      payType,
      responseTime,
    };
  }

  /**
   * Lấy message từ result code
   * @param {number} code - Result code từ MoMo
   * @returns {string} Message tương ứng
   */
  getResultMessage(code) {
    const messages = {
      0: "Giao dịch thành công",
      9000: "Giao dịch được khởi tạo, chờ khách hàng thanh toán",
      8000: "Giao dịch bị từ chối bởi MoMo",
      1000: "Giao dịch đã được khởi tạo, chờ người dùng xác nhận thanh toán",
      1001: "Giao dịch thất bại do người dùng từ chối",
      1002: "Giao dịch bị từ chối bởi Issuer",
      1003: "Giao dịch bị huỷ",
      1004: "Giao dịch thất bại do hết hạn thanh toán",
      1005: "Giao dịch thất bại do không đủ số dư",
      1006: "Giao dịch thất bại do lỗi từ phía người dùng",
      1007: "Giao dịch bị từ chối vì người dùng đã thực hiện quá nhiều giao dịch",
      2001: "Giao dịch thất bại do sai thông tin",
      3001: "Liên kết không còn khả dụng",
      3002: "Liên kết đã được sử dụng",
      3003: "Liên kết đã hết hạn",
      4001: "Giao dịch bị hạn chế",
      4010: "Giao dịch bị từ chối bởi MoMo",
      4011: "Số tiền thanh toán vượt quá hạn mức",
      4100: "Giao dịch thất bại",
      10: "Hệ thống đang được bảo trì",
      99: "Lỗi không xác định",
    };

    return messages[code] || "Lỗi không xác định";
  }

  /**
   * Query trạng thái giao dịch
   * @param {string} orderId - Mã đơn hàng
   * @param {string} requestId - Request ID
   * @returns {Object} Thông tin giao dịch
   */
  async queryTransaction(orderId, requestId) {
    // Tạo raw signature
    const rawSignature = `accessKey=${momoConfig.accessKey}&orderId=${orderId}&partnerCode=${momoConfig.partnerCode}&requestId=${requestId}`;

    // Tạo chữ ký
    const signature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    // Request body
    const requestBody = {
      partnerCode: momoConfig.partnerCode,
      requestId: requestId,
      orderId: orderId,
      lang: "vi",
      signature: signature,
    };

    try {
      // Gọi API query transaction của MoMo
      const response = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/query",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return {
        success: response.data.resultCode === 0,
        resultCode: response.data.resultCode,
        message: this.getResultMessage(response.data.resultCode),
        data: response.data,
      };
    } catch (error) {
      console.error("MoMo Query Error:", error.response?.data || error.message);
      throw new Error("Không thể query giao dịch MoMo");
    }
  }
}

module.exports = new MoMoService();
