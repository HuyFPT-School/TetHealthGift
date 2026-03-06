
import axiosInstance from "../lib/axios";

export const addToWishlist = async (productId, quantity) => {
  try {
    const response = await axiosInstance.post("/api/wishlist", {
      productId,
      quantity,
    });

    return response.data; // axios tự parse JSON rồi
  } catch (error) {
    console.error(
      "Add to wishlist failed:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};