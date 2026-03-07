const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
});

const sendVerificationEmail = async (to, code, fullname) => {
  const mailOptions = {
    from: `"Tết Health Gift" ${process.env.MAILER_USER}`,
    to: to,
    subject: "Mã xác nhận đăng ký tài khoản",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
        <h2>Xin chào ${fullname}!</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Tết Health Gift</strong>. Vui lòng sử dụng mã xác nhận bên dưới để hoàn tất quá trình đăng ký:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #dc2626;">
          ${code}
        </p>
        <p>Mã xác nhận có hiệu lực trong <strong>10 phút</strong>.</p>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">Chúc bạn một mùa Tết an khang, thịnh vượng!</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Không thể gửi email xác nhận.");
  }
};

const sendResetPassword = async (to, code) => {
  const mailOptions = {
    from: `"Tết Health Gift" ${process.env.MAILER_USER}`,
    to: to,
    subject: "Yêu cầu đặt lại mật khẩu",
    html: `
    <div  style="font-family: Arial, sans-serif; text-align: center; color: #333;">
    <p>Bạn đã yêu cầu đặt lại mật khẩu tài khoản tại <strong>Tết Health Gift</strong>.</p>
      <p>Vui lòng sử dụng mã xác nhận bên dưới để hoàn tất quá trình đặt lại mật khẩu:</p>
      <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #dc2626;">
        ${code}
      </p>
      <p>Mã này có hiệu lực trong <strong>15 phút</strong>.</p>
      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">Chúc bạn một mùa Tết an khang, thịnh vượng!</p>
    </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Không thể gửi email đặt lại mật khẩu.");
  }
};

module.exports = { sendVerificationEmail, sendResetPassword };
