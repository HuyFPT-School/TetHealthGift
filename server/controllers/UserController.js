const UserService = require("../services/UserService");
const PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}$/;
const isStrongPassword = (pw) => PW_REGEX.test(pw);

const createUser = async (req, res) => {
  try {
    const { email, password, fullname, phone, role, gender, dateOfBirth } =
      req.body;
    if (!email || !password || !fullname || !phone || !gender || !dateOfBirth) {
      return res.status(400).json({
        message:
          "Vui lòng cung cấp email, mật khẩu, họ tên, số điện thoại, giới tính và ngày sinh",
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Mật khẩu phải có 8-30 ký tự, bao gồm chữ hoa, chữ thường và số",
      });
    }

    await UserService.createUser(req.body);

    return res.status(201).json({
      message: "Tạo người dùng thành công",
    });
  } catch (err) {
    if (err.message === "Email đã được sử dụng") {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    if (err.message === "Số điện thoại đã được sử dụng") {
      return res.status(400).json({ message: "Số điện thoại đã tồn tại" });
    }
    return res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserService.getUserById(id);
    res.status(200).json({
      message: "Tìm người dùng theo ID thành công",
      data: user,
    });
  } catch (err) {
    if (err.message === "Không tìm thấy người dùng") {
      return res.status(404).json({ message: "Lỗi tìm người dùng theo ID" });
    }
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (
      req.body.role ||
      req.body.password ||
      req.body.isVerified ||
      req.body.email
    ) {
      return res.status(403).json({
        status: 403,
        message:
          "Không thể cập nhật các trường bảo vệ (role, password, isVerified, email)",
      });
    }

    const user = await UserService.updateUser(id, req.body);
    return res.status(200).json({
      message: "Cập nhật người dùng hoàn tất",
      data: user,
    });
  } catch (err) {
    if (err.message === "Không tìm thấy người dùng") {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    if (err.message === "Số điện thoại đã được sử dụng") {
      return res.status(400).json({ message: "Số điện thoại đã được sử dụng" });
    }
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Note: UserService.deleteUser just returns a message, not the data
    const user = await UserService.getUserById(id);
    await UserService.deleteUser(id);
    
    res.status(200).json({
      message: "Xóa người dùng hoàn tất",
      data: user,
    });
  } catch (err) {
    if (err.message === "Không tìm thấy người dùng") {
      return res.status(404).json({ message: "Lỗi xóa người dùng" });
    }
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ message: "Vui lòng cung cấp role mới" });
    }
    const user = await UserService.updateRole(id, role);
    return res.status(200).json({
      message: "Cập nhật role người dùng hoàn tất",
      data: user,
    });
  } catch (err) {
    if (err.message === "Không tìm thấy người dùng") {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

const viewUser = async (req, res) => {
  try {
    const user = await UserService.getAllUsers();
    res.status(200).json({ message: "Hiện thị tất cả người dùng", data: user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  viewUser,
  findById,
  createUser,
  updateRole,
};
