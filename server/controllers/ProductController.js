const productService = require("../services/ProductService");
const Order = require("../models/OrderModel");

const getAllProducts = async (req, res) => {
  try {
    const { page, limit, search, category } = req.query;

    const options = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      search,
      category,
    };

    const result = await productService.getAllProducts({}, options);

    res.status(200).json({
      message: "Lấy danh sách sản phẩm thành công",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json({
      message: "Lấy thông tin sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      content,
      isFeatured,
      tags,
      discountPrice,
      quantity,
      imageUrl,
    } = req.body;

    if (!name || !price || !category || !quantity || !imageUrl) {
      return res.status(400).json({
        message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc",
      });
    }

    const productData = {
      name,
      price,
      description,
      category,
      content,
      isFeatured,
      tags,
      discountPrice,
      quantity,
      imageUrl,
    };

    const newProduct = await productService.createProduct(productData);

    res.status(201).json({
      message: "Tạo sản phẩm thành công",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await productService.updateProduct(id, updateData);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Kiểm tra xem sản phẩm có trong đơn hàng nào đang xử lý không
    const ordersWithProduct = await Order.findOne({
      "cartItems.product": id,
      orderStatus: { $in: ["processing", "shipped"] },
    });

    if (ordersWithProduct) {
      return res.status(400).json({
        message:
          "Không thể xóa sản phẩm đang có trong đơn hàng đang xử lý hoặc vận chuyển",
      });
    }

    await productService.deleteProduct(id);

    res.status(200).json({
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content } = req.body;
    const author = req.user.id;

    if (!rating || !content) {
      return res.status(400).json({
        message: "Vui lòng cung cấp đánh giá và nội dung",
      });
    }

    // Chỉ cho phép comment khi đã nhận hàng thành công
    const deliveredOrder = await Order.findOne({
      customer: author,
      orderStatus: "delivered",
      $or: [
        { "cartItems.product": id },
        { "cartItems.basketDetails.items.productId": id },
      ],
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        message: "Bạn chỉ có thể đánh giá sản phẩm sau khi đã nhận hàng thành công",
      });
    }

    const comments = await productService.addComment(id, {
      rating,
      content,
      author,
    });

    res.status(201).json({
      message: "Thêm đánh giá thành công",
      data: comments,
    });
  } catch (error) {
    if (error.message.includes("Không tìm thấy")) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { rating, content } = req.body;
    const userId = req.user.id;

    const comments = await productService.updateComment(id, commentId, userId, {
      rating,
      content,
    });

    res.status(200).json({
      message: "Cập nhật đánh giá thành công",
      data: comments,
    });
  } catch (error) {
    if (error.message.includes("Không tìm thấy")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("không có quyền")) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    await productService.deleteComment(id, commentId, userId, userRole);

    res.status(200).json({
      message: "Xóa đánh giá thành công",
    });
  } catch (error) {
    if (error.message.includes("Không tìm thấy")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("không có quyền")) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addComment,
  updateComment,
  deleteComment,
};
