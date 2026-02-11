const Blog = require("../models/BlogModel");

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
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
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    res.status(200).json({
      message: "Lấy thông tin bài viết thành công",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content, author, tags, image } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Vui lòng cung cấp tiêu đề và nội dung",
      });
    }

    const newBlog = new Blog({
      title,
      content,
      author,
      tags,
      image,
    });

    await newBlog.save();

    res.status(201).json({
      message: "Tạo bài viết thành công",
      data: newBlog,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    res.status(200).json({
      message: "Cập nhật bài viết thành công",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    res.status(200).json({
      message: "Xóa bài viết thành công",
    });
  } catch (error) {
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
