const User = require("../models/UserModel");
const Product = require("../models/ProductModel");

/**
 * Wishlist Service
 * Xử lý business logic liên quan đến wishlist
 */
class WishlistService {
  /**
   * Lấy wishlist của user
   */
  async getWishlist(userId) {
    try {
      const user = await User.findById(userId).populate({
        path: "wishlist",
        populate: { path: "category", select: "name" },
      });

      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      return user.wishlist;
    } catch (error) {
      throw new Error(`Lỗi khi lấy wishlist: ${error.message}`);
    }
  }

  /**
   * Thêm sản phẩm vào wishlist
   */
  async addToWishlist(userId, productId) {
    try {
      // Kiểm tra sản phẩm có tồn tại không
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      // Thêm vào wishlist (không thêm duplicate)
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: productId } },
        { new: true },
      ).populate({
        path: "wishlist",
        populate: { path: "category", select: "name" },
      });

      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      return user.wishlist;
    } catch (error) {
      throw new Error(`Lỗi khi thêm vào wishlist: ${error.message}`);
    }
  }

  /**
   * Xóa sản phẩm khỏi wishlist
   */
  async removeFromWishlist(userId, productId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { wishlist: productId } },
        { new: true },
      ).populate({
        path: "wishlist",
        populate: { path: "category", select: "name" },
      });

      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      return user.wishlist;
    } catch (error) {
      throw new Error(`Lỗi khi xóa khỏi wishlist: ${error.message}`);
    }
  }

  /**
   * Xóa toàn bộ wishlist
   */
  async clearWishlist(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { wishlist: [] },
        { new: true },
      );

      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      return { message: "Đã xóa toàn bộ wishlist" };
    } catch (error) {
      throw new Error(`Lỗi khi xóa wishlist: ${error.message}`);
    }
  }

  /**
   * Kiểm tra sản phẩm có trong wishlist không
   */
  async isInWishlist(userId, productId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      return user.wishlist.includes(productId);
    } catch (error) {
      throw new Error(`Lỗi khi kiểm tra wishlist: ${error.message}`);
    }
  }

  /**
   * Đếm số lượng items trong wishlist
   */
  async countWishlist(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Không tìm thấy người dùng");
      }

      return user.wishlist.length;
    } catch (error) {
      throw new Error(`Lỗi khi đếm wishlist: ${error.message}`);
    }
  }
}

module.exports = new WishlistService();
