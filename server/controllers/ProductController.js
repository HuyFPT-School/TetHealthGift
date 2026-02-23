const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("category");
    res.status(200).json({
      message: "Lấy danh sách sản phẩm thành công",
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("category")
      .populate("comments.author", "fullname avatar");

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

    const newProduct = new Product({
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
    });

    await newProduct.save();
    await newProduct.populate("category");

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

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category");

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
    const product = await Product.findById(id);

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
        message: "Không thể xóa sản phẩm đang có trong đơn hàng đang xử lý hoặc vận chuyển",
      });
    }

    await Product.findByIdAndDelete(id);

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

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    product.comments.push({ rating, content, author });
    await product.save();
    await product.populate("comments.author", "fullname avatar");

    res.status(201).json({
      message: "Thêm đánh giá thành công",
      data: product.comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { rating, content } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const comment = product.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({
        message: "Bạn không có quyền chỉnh sửa đánh giá này",
      });
    }

    if (rating) comment.rating = rating;
    if (content) comment.content = content;

    await product.save();
    await product.populate("comments.author", "fullname avatar");

    res.status(200).json({
      message: "Cập nhật đánh giá thành công",
      data: product.comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const comment = product.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }

    if (comment.author.toString() !== userId && userRole !== "Admin") {
      return res.status(403).json({
        message: "Bạn không có quyền xóa đánh giá này",
      });
    }

    product.comments.pull(commentId);
    await product.save();

    res.status(200).json({
      message: "Xóa đánh giá thành công",
    });
  } catch (error) {
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
