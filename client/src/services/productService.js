// FILE: src/services/productService.js
// Service tập trung gọi API sản phẩm - không dùng mockdata

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Format giá tiền VND
export const formatPrice = (price) => {
  if (typeof price === "number") return price.toLocaleString("vi-VN") + " đ";
  return price;
};

// Tính % giảm giá
export const calcDiscount = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

// GET /api/products  — hỗ trợ đầy đủ params từ BE
export const fetchProducts = async (params = {}) => {
  const {
    page = 1,
    limit = 100,
    category,
    minPrice,
    maxPrice,
    sort,
    search,
  } = params;

  const query = { page, limit };
  if (category && category !== "all") query.category = category;
  if (minPrice !== undefined) query.minPrice = minPrice;
  if (maxPrice !== undefined) query.maxPrice = maxPrice;
  if (sort && sort !== "default") query.sort = sort;
  if (search) query.search = search;

  const response = await api.get("/api/products", { params: query });
  const raw = response.data;

  // Backend trả về { data: { products: [...], total: 10, page, limit, totalPages } }
  const products = raw.data?.products || [];
  const total = raw.data?.total || 0;
  const currentPage = raw.data?.page || page;
  const totalPages = raw.data?.totalPages || 1;

  return { products, total, page: currentPage, totalPages };
};

// GET /api/products/:id
export const fetchProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  const raw = response.data;
  // BE trả về { message, data } hoặc thẳng object
  return raw?.data || raw?.product || raw;
};

// POST /api/products/:id/comments  (cần auth token)
export const addComment = async (productId, { rating, content }, token) => {
  // Đảm bảo rating là số nguyên, content là string
  const body = JSON.stringify({
    rating: Number(rating),
    content: String(content),
  });

  const response = await api.post(`/api/products/${productId}/comments`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// PUT /api/products/:id/comments/:commentId
export const updateComment = async (productId, commentId, data, token) => {
  const response = await api.put(
    `/api/products/${productId}/comments/${commentId}`,
    JSON.stringify(data),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

// DELETE /api/products/:id/comments/:commentId
export const deleteComment = async (productId, commentId, token) => {
  const response = await api.delete(
    `/api/products/${productId}/comments/${commentId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};
