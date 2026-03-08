const CustomBasketService = require("../services/CustomBasketService");

/**
 * Custom Basket Controller
 *
 * ACTIVE ENDPOINTS:
 * - getPackagingTypes: Used by frontend to fetch packaging options
 * - getAllPackagingAdmin, createPackagingAdmin, updatePackagingAdmin, deletePackagingAdmin: Admin packaging management
 *
 * DEPRECATED ENDPOINTS (now uses localStorage on frontend):
 * - createBasket, getBasket, addItem, removeItem, updateItemQuantity, completeBasket, cancelBasket, getUserBaskets
 * - These functions are kept for reference but no longer used in production
 */

// Get all available packaging types
const getPackagingTypes = async (req, res) => {
  try {
    const packagingTypes = await CustomBasketService.getPackagingTypes();
    res.status(200).json({
      message: "Lấy danh sách bao bì thành công",
      data: packagingTypes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Lỗi khi lấy danh sách bao bì",
    });
  }
};

// Create new custom basket
const createBasket = async (req, res) => {
  try {
    const { packagingId } = req.body;
    const userId = req.user.id;

    if (!packagingId) {
      return res.status(400).json({
        message: "Vui lòng chọn loại bao bì",
      });
    }

    const basket = await CustomBasketService.createBasket(userId, packagingId);
    res.status(201).json({
      message: "Tạo giỏ quà thành công",
      data: basket,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Lỗi khi tạo giỏ quà",
    });
  }
};

// Get basket by ID
const getBasket = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const basket = await CustomBasketService.getBasket(id, userId);
    res.status(200).json({
      message: "Lấy thông tin giỏ quà thành công",
      data: basket,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message || "Không tìm thấy giỏ quà",
    });
  }
};

// Add item to basket
const addItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({
        message: "Vui lòng chọn sản phẩm",
      });
    }

    const basket = await CustomBasketService.addItem(
      id,
      userId,
      productId,
      parseInt(quantity),
    );

    res.status(200).json({
      message: "Thêm sản phẩm vào giỏ quà thành công",
      data: basket,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Lỗi khi thêm sản phẩm",
    });
  }
};

// Remove item from basket
const removeItem = async (req, res) => {
  try {
    const { id, productId } = req.params;
    const userId = req.user.id;

    const basket = await CustomBasketService.removeItem(id, userId, productId);
    res.status(200).json({
      message: "Xóa sản phẩm khỏi giỏ quà thành công",
      data: basket,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Lỗi khi xóa sản phẩm",
    });
  }
};

// Update item quantity
const updateItemQuantity = async (req, res) => {
  try {
    const { id, productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (quantity === undefined) {
      return res.status(400).json({
        message: "Vui lòng nhập số lượng",
      });
    }

    const basket = await CustomBasketService.updateItemQuantity(
      id,
      userId,
      productId,
      parseInt(quantity),
    );

    res.status(200).json({
      message: "Cập nhật số lượng thành công",
      data: basket,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Lỗi khi cập nhật số lượng",
    });
  }
};

// Complete basket
const completeBasket = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    const basket = await CustomBasketService.completeBasket(id, userId, name);
    res.status(200).json({
      message: "Hoàn thành giỏ quà thành công",
      data: basket,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Lỗi khi hoàn thành giỏ quà",
    });
  }
};

// Cancel/delete basket
const cancelBasket = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await CustomBasketService.cancelBasket(id, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Lỗi khi hủy giỏ quà",
    });
  }
};

// Get user's baskets
const getUserBaskets = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const baskets = await CustomBasketService.getUserBaskets(userId, status);
    res.status(200).json({
      message: "Lấy danh sách giỏ quà thành công",
      data: baskets,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Lỗi khi lấy danh sách giỏ quà",
    });
  }
};

// ============ ADMIN ONLY - Packaging Management ============

// Get all packaging types (admin)
const getAllPackagingAdmin = async (req, res) => {
  try {
    const packagingTypes = await CustomBasketService.getAllPackaging();
    res.status(200).json({
      message: "Lấy danh sách bao bì thành công",
      data: packagingTypes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Lỗi khi lấy danh sách bao bì",
    });
  }
};

// Create new packaging type (admin)
const createPackagingAdmin = async (req, res) => {
  try {
    const packagingData = req.body;
    const packaging = await CustomBasketService.createPackaging(packagingData);
    res.status(201).json({
      message: "Tạo loại bao bì thành công",
      data: packaging,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Lỗi khi tạo loại bao bì",
    });
  }
};

// Update packaging type (admin)
const updatePackagingAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const packaging = await CustomBasketService.updatePackaging(id, updateData);
    res.status(200).json({
      message: "Cập nhật loại bao bì thành công",
      data: packaging,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Lỗi khi cập nhật loại bao bì",
    });
  }
};

// Delete packaging type (admin)
const deletePackagingAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CustomBasketService.deletePackaging(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Lỗi khi xóa loại bao bì",
    });
  }
};

module.exports = {
  // ACTIVE
  getPackagingTypes, // Used by frontend
  // DEPRECATED (kept for reference - now uses localStorage)
  createBasket,
  getBasket,
  addItem,
  removeItem,
  updateItemQuantity,
  completeBasket,
  cancelBasket,
  getUserBaskets,
  // ACTIVE - Admin only
  getAllPackagingAdmin,
  createPackagingAdmin,
  updatePackagingAdmin,
  deletePackagingAdmin,
};
