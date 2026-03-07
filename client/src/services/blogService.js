// FILE: src/services/blogService.js
// Service tập trung gọi API blog

import axiosInstance from "../lib/axios";

/**
 * GET /api/blogs
 * Lấy danh sách tất cả bài viết blog
 * @param {Object} params - Query parameters (tags, search)
 * @returns {Promise} Danh sách blog
 */
export const getAllBlogs = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/blogs", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * GET /api/blogs/:id
 * Lấy chi tiết một bài viết blog
 * @param {string} id - Blog ID
 * @returns {Promise} Chi tiết blog
 */
export const getBlogById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * POST /api/blogs
 * Tạo bài viết blog mới (Admin/StaffManager only)
 * @param {Object} blogData - Dữ liệu blog (title, content, author, tags, image)
 * @returns {Promise} Blog mới được tạo
 */
export const createBlog = async (blogData) => {
  try {
    const response = await axiosInstance.post("/api/blogs", blogData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * PUT /api/blogs/:id
 * Cập nhật bài viết blog (Admin/StaffManager only)
 * @param {string} id - Blog ID
 * @param {Object} blogData - Dữ liệu cập nhật
 * @returns {Promise} Blog đã được cập nhật
 */
export const updateBlog = async (id, blogData) => {
  try {
    const response = await axiosInstance.put(`/api/blogs/${id}`, blogData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * DELETE /api/blogs/:id
 * Xóa bài viết blog (Admin only)
 * @param {string} id - Blog ID
 * @returns {Promise} Kết quả xóa
 */
export const deleteBlog = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Hàm helper: Format ngày tháng theo locale Việt Nam
 * @param {string|Date} date - Ngày cần format
 * @returns {string} Ngày đã format
 */
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/**
 * Hàm helper: Lấy excerpt từ content HTML
 * @param {string} content - Nội dung HTML
 * @param {number} length - Độ dài tối đa
 * @returns {string} Excerpt text
 */
export const getExcerpt = (content, length = 150) => {
  if (!content) return "";
  const text = content.replace(/<[^>]*>/g, "");
  return text.length > length ? text.slice(0, length) + "..." : text;
};
