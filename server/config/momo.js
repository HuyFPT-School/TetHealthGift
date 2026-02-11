require("dotenv").config();

const momoConfig = {
  // Partner Code của merchant
  partnerCode: process.env.MOMO_PARTNER_CODE,

  // Access Key
  accessKey: process.env.MOMO_ACCESS_KEY,

  // Secret Key để tạo chữ ký
  secretKey: process.env.MOMO_SECRET_KEY,

  // API endpoint của MoMo
  apiUrl: process.env.MOMO_API_URL,

  // URL redirect sau khi thanh toán
  redirectUrl:
    process.env.MOMO_RETURN_URL || "http://localhost:5000/payment/momo-return",

  // URL nhận thông báo kết quả thanh toán (IPN)
  ipnUrl:
    process.env.MOMO_IPN_URL || "http://localhost:5000/api/payment/momo-ipn",

  // Cấu hình mặc định
  requestType: "payWithMethod",
  lang: "vi",
};

module.exports = momoConfig;
