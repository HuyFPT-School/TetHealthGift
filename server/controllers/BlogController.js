const BlogService = require("../services/BlogService");

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogService.getAllBlogs();
    res.status(200).json({
      message: "Lấy danh sách bài viết thành công",
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogService.getBlogById(id);

    res.status(200).json({
      message: "Lấy thông tin bài viết thành công",
      data: blog,
    });
  } catch (error) {
    if (error.message === "Không tìm thấy blog") {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const newBlog = await BlogService.createBlog(req.body);

    res.status(201).json({
      message: "Tạo bài viết thành công",
      data: newBlog,
    });
  } catch (error) {
    if (error.message === "Tiêu đề và nội dung không được để trống") {
      return res.status(400).json({ message: "Vui lòng cung cấp tiêu đề và nội dung" });
    }
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogService.updateBlog(id, req.body);

    res.status(200).json({
      message: "Cập nhật bài viết thành công",
      data: blog,
    });
  } catch (error) {
    if (error.message === "Không tìm thấy blog") {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await BlogService.deleteBlog(id);

    res.status(200).json({
      message: "Xóa bài viết thành công",
    });
  } catch (error) {
    if (error.message === "Không tìm thấy blog") {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
