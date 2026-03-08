import axiosInstance from "@/lib/axios";

/**
 * Custom Basket Service - API functions for custom gift baskets
 * Note: Custom baskets are now stored in localStorage (see localBasketService.js)
 * This file only maintains API calls for fetching packaging types
 */

// Get all available packaging types
export const getPackagingTypes = async () => {
  const response = await axiosInstance.get("/api/custom-baskets/packaging");
  return response.data;
};
