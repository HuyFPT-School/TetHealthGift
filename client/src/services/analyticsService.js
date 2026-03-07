// FILE: src/services/analyticsService.js
// Service để gọi API analytics

import axiosInstance from "../lib/axios";

/**
 * GET /api/analytics/dashboard
 * Lấy tất cả dữ liệu thống kê cho dashboard admin
 */
export const fetchDashboardStats = async () => {
  try {
    const response = await axiosInstance.get("/api/analytics/dashboard");
    const raw = response.data;
    // Backend trả về { message, data: {...} }
    return raw?.data || null;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};
