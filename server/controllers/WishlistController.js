const UserModel = require("../models/UserModel");
const ProductModel = require("../models/ProductModel");
const WishlistService = require("../services/WishlistService");

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Getting wishlist for userId:", userId);
    const user = await UserModel.findById(userId).populate({
      path: "wishlist.product",
      populate: { path: "category", select: "name" },
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error getting wishlist:", error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity  } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Thiếu productId" });
    }

    const wishlist = await WishlistService.addToWishlist(
      userId,
      productId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Đã thêm vào wishlist",
      wishlist
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Thiếu productId" });
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true },
    ).populate({
      path: "wishlist",
      populate: { path: "category", select: "name" },
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa khỏi danh sách yêu thích",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { wishlist: [] } },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa tất cả sản phẩm khỏi danh sách yêu thích",
      wishlist: [],
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const checkInWishlist = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { productId } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const isInWishlist = user.wishlist.includes(productId);

    res.status(200).json({
      success: true,
      isInWishlist,
    });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Thiếu productId" });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
    }

    const wishlist = await WishlistService.updateQuantity(userId, productId, quantity);

    res.status(200).json({
      success: true,
      message: "Đã cập nhật số lượng",
      wishlist,
    });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkInWishlist,
  updateQuantity,
};
