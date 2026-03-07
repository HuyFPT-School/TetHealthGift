// FILE: src/services/categoryService.js
// Service để gọi API categories

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// GET /api/categories - Lấy tất cả categories
export const fetchCategories = async () => {
  try {
    const response = await api.get("/api/categories");
    const raw = response.data;
    // Backend trả về { message, data: [...categories] }
    return raw?.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// GET /api/categories/:id - Lấy category theo ID
export const fetchCategoryById = async (id) => {
  try {
    const response = await api.get(`/api/categories/${id}`);
    const raw = response.data;
    return raw?.data || null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
};
