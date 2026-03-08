import axiosInstance from "../lib/axios";
import { formatPrice } from "./productService";

// Get all packaging types (admin)
export const getAllPackaging = async () => {
  const response = await axiosInstance.get(
    "/api/custom-baskets/admin/packaging",
  );
  return response.data;
};

// Create new packaging type
export const createPackaging = async (packagingData) => {
  const response = await axiosInstance.post(
    "/api/custom-baskets/admin/packaging",
    packagingData,
  );
  return response.data;
};

// Update packaging type
export const updatePackaging = async (packagingId, updateData) => {
  const response = await axiosInstance.put(
    `/api/custom-baskets/admin/packaging/${packagingId}`,
    updateData,
  );
  return response.data;
};

// Delete packaging type
export const deletePackaging = async (packagingId) => {
  const response = await axiosInstance.delete(
    `/api/custom-baskets/admin/packaging/${packagingId}`,
  );
  return response.data;
};

// Re-export formatPrice from productService for convenience
export { formatPrice };
