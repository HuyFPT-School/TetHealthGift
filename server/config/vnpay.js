require("dotenv").config();

const vnpayConfig = {
  // Mã website của merchant tại VNPAY
  vnp_TmnCode: process.env.VNP_TMN_CODE,

  // Secret key để tạo chữ ký
  vnp_HashSecret: process.env.VNP_HASH_SECRET,

  // URL thanh toán của VNPAY
  vnp_Url: process.env.VNP_URL,

  // URL return sau khi thanh toán
  vnp_ReturnUrl: process.env.VNP_RETURN_URL,

  // Cấu hình mặc định
  vnp_CurrCode: "VND",
  vnp_Locale: "vn",
};

module.exports = vnpayConfig;
