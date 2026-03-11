const crypto = require("crypto");
const qs = require("qs");
const vnpayConfig = require("../config/vnpay");

class VNPayService {
  /**
   * Tạo URL thanh toán VNPAY
   * @param {Object} paymentData - Thông tin thanh toán
   * @returns {string} URL thanh toán
   */
  createPaymentUrl(paymentData) {
    const {
      orderId,
      amount,
      orderInfo,
      orderType = "other",
      locale = "vn",
      ipAddr,
    } = paymentData;

    // Validate input
    if (!orderId || !amount || !orderInfo || !ipAddr) {
      throw new Error("Thiếu thông tin bắt buộc để tạo thanh toán");
    }

    // Đảm bảo amount là số nguyên
    const roundedAmount = Math.round(Number(amount));
    if (isNaN(roundedAmount) || roundedAmount <= 0) {
      throw new Error("Số tiền thanh toán không hợp lệ");
    }

    // Tạo thời gian tạo yêu cầu (format: yyyyMMddHHmmss)
    const createDate = this.formatDate(new Date());

    // Thời gian hết hạn (15 phút sau)
    const expireDate = this.formatDate(new Date(Date.now() + 15 * 60 * 1000));

    // Loại bỏ ký tự đặc biệt và dấu tiếng Việt khỏi orderInfo
    // (VNPay yêu cầu tiếng Việt không dấu, không chứa #, &, =, spaces ...)
    const safeOrderInfo = this.removeDiacritics(orderInfo)
      .replace(/[#&=?%]/g, "")
      .replace(/\s+/g, "-"); // Thay dấu cách thành dấu gạch ngang

    // Tạo object chứa parameters
    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_Locale: locale || vnpayConfig.vnp_Locale,
      vnp_CurrCode: vnpayConfig.vnp_CurrCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: safeOrderInfo,
      vnp_OrderType: orderType,
      vnp_Amount: roundedAmount * 100, // VNPAY yêu cầu amount * 100
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    // Sắp xếp params theo thứ tự alphabet (yêu cầu của VNPAY)
    vnp_Params = this.sortObject(vnp_Params);

    // Tạo chuỗi query để ký (không encode)
    const signData = qs.stringify(vnp_Params, { encode: false });

    // Tạo secure hash
    const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    // Tạo URL thanh toán (không encode - theo official VNPay sample)
    const paymentUrl =
      vnpayConfig.vnp_Url + "?" + qs.stringify(vnp_Params, { encode: false });

    return paymentUrl;
  }

  /**
   * Xác thực chữ ký return từ VNPAY
   * @param {Object} vnpParams - Parameters từ VNPAY return
   * @returns {Object} Kết quả xác thực
   */
  verifyReturnUrl(vnpParams) {
    let vnp_Params = { ...vnpParams };
    const secureHash = vnp_Params["vnp_SecureHash"];

    // Xóa các params không cần thiết
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    // Sắp xếp params
    vnp_Params = this.sortObject(vnp_Params);

    // Tạo chuỗi để verify (không encode)
    const signData = qs.stringify(vnp_Params, { encode: false });

    // Tạo hash để verify
    const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // So sánh chữ ký
    const isValid = secureHash === signed;

    // Phân tích kết quả
    const responseCode = vnp_Params["vnp_ResponseCode"];
    const transactionStatus = vnp_Params["vnp_TransactionStatus"];

    return {
      isValid,
      isSuccess: isValid && responseCode === "00" && transactionStatus === "00",
      responseCode,
      transactionStatus,
      orderId: vnp_Params["vnp_TxnRef"],
      amount: vnp_Params["vnp_Amount"] / 100,
      bankCode: vnp_Params["vnp_BankCode"],
      transactionNo: vnp_Params["vnp_TransactionNo"],
      payDate: vnp_Params["vnp_PayDate"],
      message: this.getResponseMessage(responseCode),
    };
  }

  /**
   * Lấy message từ response code
   * @param {string} code - Response code từ VNPAY
   * @returns {string} Message tương ứng
   */
  getResponseMessage(code) {
    const messages = {
      "00": "Giao dịch thành công",
      "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
      "09": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
      10: "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
      11: "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
      12: "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
      13: "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.",
      24: "Giao dịch không thành công do: Khách hàng hủy giao dịch",
      51: "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.",
      65: "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.",
      75: "Ngân hàng thanh toán đang bảo trì.",
      79: "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch",
      99: "Các lỗi khác (lỗi từ Ngân hàng)",
    };

    return messages[code] || "Lỗi không xác định";
  }

  /**
   * Loại bỏ dấu tiếng Việt (VNPay yêu cầu không dấu)
   */
  removeDiacritics(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  /**
   * Format date theo định dạng VNPAY (yyyyMMddHHmmss)
   * @param {Date} date - Date object
   * @returns {string} Formatted date string
   */
  formatDate(date) {
    // Always use Vietnam timezone (UTC+7) regardless of server timezone.
    // Vercel runs in UTC+0, but VNPAY expects timestamps in GMT+7.
    // Using getHours() would return UTC on Vercel → VNPAY sees expired transactions.
    const vietnamOffset = 7 * 60; // minutes
    const utcMs = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
    const vnDate = new Date(utcMs + vietnamOffset * 60 * 1000);

    const year = vnDate.getFullYear();
    const month = String(vnDate.getMonth() + 1).padStart(2, "0");
    const day = String(vnDate.getDate()).padStart(2, "0");
    const hours = String(vnDate.getHours()).padStart(2, "0");
    const minutes = String(vnDate.getMinutes()).padStart(2, "0");
    const seconds = String(vnDate.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  /**
   * Sắp xếp object theo key (alphabet) VÀ ENCODE (theo VNPay spec)
   * @param {Object} obj - Object cần sắp xếp
   * @returns {Object} Object đã sắp xếp và encode
   */
  sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }
}

module.exports = new VNPayService();
