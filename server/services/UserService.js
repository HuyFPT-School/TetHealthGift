const User = require("../models/UserModel");
const Order = require("../models/OrderModel");
const CustomBasket = require("../models/CustomBasketModel");
const bcrypt = require("bcryptjs");

/**
 * User Service
 * Xử lý business logic liên quan đến người dùng
 */
class UserService {
  /**
   * Lấy tất cả users
   */
  async getAllUsers(filters = {}) {
    try {
      const users = await User.find(filters).select("-password");
      return users;
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách người dùng: ${error.message}`);
    }
  }

  /**
   * Lấy user theo ID
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }
      return user;
    } catch (error) {
      throw new Error(`Lỗi khi lấy thông tin người dùng: ${error.message}`);
    }
  }

  /**
   * Lấy user theo email
   */
  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw new Error(`Lỗi khi tìm người dùng theo email: ${error.message}`);
    }
  }

  /**
   * Tạo user mới
   */
  async createUser(userData) {
    try {
      const {
        email,
        password,
        fullname,
        phone,
        role,
        address,
        gender,
        dateOfBirth,
      } = userData;

      // Validate required fields
      if (!email || !password || !fullname) {
        throw new Error("Thiếu thông tin bắt buộc");
      }

      // Check if email exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email đã được sử dụng");
      }

      // Check if phone exists (nếu có phone)
      if (phone) {
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
          throw new Error("Số điện thoại đã được sử dụng");
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        fullname,
        phone,
        role: role || "User",
        address,
        gender,
        dateOfBirth,
        isVerified: false,
      });

      await user.save();

      // Return user without password
      const userObject = user.toObject();
      delete userObject.password;

      return userObject;
    } catch (error) {
      throw new Error(`Lỗi khi tạo người dùng: ${error.message}`);
    }
  }

  /**
   * Cập nhật thông tin user
   */
  async updateUser(userId, updateData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      // Không cho phép update email, password qua hàm này
      delete updateData.email;
      delete updateData.password;

      // Check phone uniqueness if updating
      if (updateData.phone && updateData.phone !== user.phone) {
        const existingPhone = await User.findOne({ phone: updateData.phone });
        if (existingPhone) {
          throw new Error("Số điện thoại đã được sử dụng");
        }
      }

      Object.assign(user, updateData);
      await user.save();

      const userObject = user.toObject();
      delete userObject.password;

      return userObject;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật người dùng: ${error.message}`);
    }
  }

  /**
   * Cập nhật password
   */
  async updatePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findById(userId).select("+password");
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      // Verify old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new Error("Mật khẩu cũ không chính xác");
      }

      // Hash new password
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return { message: "Đổi mật khẩu thành công" };
    } catch (error) {
      throw new Error(`Lỗi khi đổi mật khẩu: ${error.message}`);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(userId, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      // Hash new password
      user.password = await bcrypt.hash(newPassword, 10);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return { message: "Reset mật khẩu thành công" };
    } catch (error) {
      throw new Error(`Lỗi khi reset mật khẩu: ${error.message}`);
    }
  }

  /**
   * Xóa user
   * Kiểm tra ràng buộc với Order đang active và CustomBasket nữa cưa
   */
  async deleteUser(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      // Kiểm tra đơn hàng đang active (chưa giao hoàn thành)
      const activeOrders = await Order.countDocuments({
        customer: userId,
        orderStatus: { $in: ["processing", "shipped"] },
      });
      if (activeOrders > 0) {
        throw new Error(
          `Không thể xóa người dùng này vì có ${activeOrders} đơn hàng đang xử lý hoặc đang giao. ` +
          `Vui lòng đợi các đơn hàng hoàn tất hoặc hủy trước khi xóa tài khoản.`
        );
      }

      // Kiểm tra giỏ quà đang nữửa (draft/added_to_cart)
      const activeBaskets = await CustomBasket.countDocuments({
        user: userId,
        status: { $in: ["draft", "added_to_cart"] },
      });
      if (activeBaskets > 0) {
        // Xóa các basket này vì chưa commit vào Order
        await CustomBasket.deleteMany({
          user: userId,
          status: { $in: ["draft", "added_to_cart"] },
        });
      }

      await User.findByIdAndDelete(userId);
      return { message: "Xóa người dùng thành công" };
    } catch (error) {
      throw new Error(`Lỗi khi xóa người dùng: ${error.message}`);
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      user.isVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      return { message: "Xác thực email thành công" };
    } catch (error) {
      throw new Error(`Lỗi khi xác thực email: ${error.message}`);
    }
  }

  /**
   * Lấy users theo role
   */
  async getUsersByRole(role) {
    try {
      const users = await User.find({ role }).select("-password");
      return users;
    } catch (error) {
      throw new Error(`Lỗi khi lấy người dùng theo role: ${error.message}`);
    }
  }

  /**
   * Upload avatar
   */
  async updateAvatar(userId, avatarUrl) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      user.avatar = avatarUrl;
      await user.save();

      const userObject = user.toObject();
      delete userObject.password;

      return userObject;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật avatar: ${error.message}`);
    }
  }
}

module.exports = new UserService();
