const mongoose = require("mongoose");
const User = require("../models/UserModel");
const Product = require("../models/ProductModel");

/**
 * Wishlist Service
 * Xử lý business logic liên quan đến wishlist
 */
class WishlistService {

  /**
   * Thêm sản phẩm vào wishlist
   */
  async addToWishlist(userId, productId, quantity = 1) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    const productIdStr = productId.toString();
    const existingItem = user.wishlist.find(item => {
      if (!item.product) return false;
      const itemProd = item.product;
      const itemProdId = itemProd._id ? itemProd._id.toString() : itemProd.toString();
      return itemProdId === productIdStr;
    });

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.wishlist.push({
        product: productId,
        quantity
      });
    }

    // Sanitize wishlist: remove any items missing `product` or with invalid ids
    user.wishlist = user.wishlist.filter(item => {
      if (!item || !item.product) return false;
      const itemProd = item.product;
      const itemProdId = itemProd._id ? itemProd._id.toString() : itemProd.toString();
      return mongoose.Types.ObjectId.isValid(itemProdId);
    });

    await user.save();

    await user.populate({
      path: "wishlist.product",
      populate: {
        path: "category",
        select: "name"
      }
    });

    return user.wishlist;
  }

  async getWishlist(userId) {
    const user = await User.findById(userId).populate({
      path: "wishlist.product",
      populate: {
        path: "category",
        select: "name"
      }
    });

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    return user.wishlist;
  }

  async removeFromWishlist(userId, productId) {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          wishlist: { product: productId }
        }
      },
      { new: true }
    ).populate({
      path: "wishlist.product",
      populate: {
        path: "category",
        select: "name"
      }
    });

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    return user.wishlist;
  }

  async updateQuantity(userId, productId, quantity) {
    if (quantity < 1) {
      throw new Error("Quantity phải lớn hơn 0");
    }

    const user = await User.findOneAndUpdate(
      { _id: userId, "wishlist.product": productId },
      {
        $set: { "wishlist.$.quantity": quantity }
      },
      { new: true }
    ).populate({
      path: "wishlist.product",
      populate: {
        path: "category",
        select: "name"
      }
    });

    if (!user) {
      throw new Error("Không tìm thấy sản phẩm trong wishlist");
    }

    return user.wishlist;
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

      const productIdStr = productId.toString();
      return user.wishlist.some(item => {
        if (!item.product) return false;
        const itemProd = item.product;
        const itemProdId = itemProd._id ? itemProd._id.toString() : itemProd.toString();
        return itemProdId === productIdStr;
      });
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
