
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


export const getWishlist = async () => {
  try {
    const response = await axiosInstance.get("/api/wishlist");
    return response.data; // axios tự parse JSON rồi
  } catch (error) {
    console.error(
      "Get wishlist failed:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

export const updateWishlistQuantity = async (productId, quantity) => {
  try {
    const response = await axiosInstance.patch(`/api/wishlist/${productId}/quantity`, {
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Update wishlist quantity failed:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/api/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Remove from wishlist failed:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};