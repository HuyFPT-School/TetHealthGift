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

  // URL redirect sau khi thanh toán (về CLIENT)
  redirectUrl:
    process.env.MOMO_RETURN_URL ||
    `${process.env.CLIENT_URL || "http://localhost:5173"}/payment-result`,

  // URL nhận thông báo kết quả thanh toán (IPN - backend)
  ipnUrl:
    process.env.MOMO_IPN_URL || "http://localhost:5000/api/payment/momo-ipn",

  // Cấu hình mặc định
  requestType: "payWithMethod",
  lang: "vi",
};

module.exports = momoConfig;
