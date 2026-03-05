import axiosInstance from "@/lib/axios";

const handleError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Yêu cầu thất bại.";
  throw new Error(message);
};

export const fetchUserProfile = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateUserProfile = async (userId, payload) => {
  try {
    const response = await axiosInstance.patch(`/api/users/${userId}`, payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const changePassword = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `/api/auth/change-password`,
      payload,
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const uploadAvatar = async (file, retryCount = 0) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    console.log("Uploading avatar...", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      attempt: retryCount + 1,
    });

    const response = await axiosInstance.post(`/api/upload/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    // Nếu lỗi 403 (token hết hạn) và chưa retry, thử refresh token và upload lại
    if (error?.response?.status === 403 && retryCount === 0) {
      console.log("Token expired (403), refreshing...");
      try {
        // Backend đọc refreshToken từ httpOnly cookie
        const refreshResponse = await axiosInstance.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true },
        );

        const newToken =
          refreshResponse.data?.accessToken ||
          refreshResponse.data?.token ||
          refreshResponse.data?.data?.accessToken;

        if (!newToken) {
          throw new Error("Không thể refresh token. Vui lòng đăng nhập lại.");
        }

        // Lưu token mới
        localStorage.setItem("accessToken", newToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        console.log("Token refreshed successfully, retrying upload...");

        // Retry upload với token mới
        return await uploadAvatar(file, retryCount + 1);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // Nếu refresh fail, xóa tokens và yêu cầu đăng nhập lại
        localStorage.removeItem("accessToken");
        // Cookie sẽ được backend xóa khi gọi logout
        throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
    }

    handleError(error);
  }
};
