const CategoryService = require("../services/CategoryService");

const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json({
      message: "Lấy danh sách danh mục thành công",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryService.getCategoryById(id);

    res.status(200).json({
      message: "Lấy thông tin danh mục thành công",
      data: category,
    });
  } catch (error) {
    if (error.message === "Không tìm thấy danh mục") {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const newCategory = await CategoryService.createCategory(req.body);

    res.status(201).json({
      message: "Tạo danh mục thành công",
      data: newCategory,
    });
  } catch (error) {
    if (error.message === "Tên danh mục không được để trống") {
      return res.status(400).json({ message: "Vui lòng cung cấp tên danh mục" });
    }
    if (error.message === "Tên danh mục đã tồn tại") {
      return res.status(400).json({ message: "Danh mục đã tồn tại" });
    }
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryService.updateCategory(id, req.body);

    res.status(200).json({
      message: "Cập nhật danh mục thành công",
      data: category,
    });
  } catch (error) {
    if (error.message === "Không tìm thấy danh mục") {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    if (error.message === "Tên danh mục đã tồn tại") {
      return res.status(400).json({ message: "Tên danh mục đã tồn tại" });
    }
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryService.deleteCategory(id);

    res.status(200).json({
      message: "Xóa danh mục thành công",
    });
  } catch (error) {
    if (error.message === "Không tìm thấy danh mục") {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    // Return potentially specific message like "Không thể xóa danh mục này vì còn N sản phẩm"
    if (error.message.startsWith("Không thể xóa danh mục này")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
