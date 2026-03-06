import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  // Giữ false để không ảnh hưởng CORS — refresh dùng body thay vì cookie
  withCredentials: false,
});

// ── Request: gắn accessToken ──
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response: tự refresh khi 401 ──
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  pendingQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Bỏ qua auto-refresh với các auth endpoints (login, register, verify...)
    const AUTH_SKIP = ["/api/auth/login", "/api/auth/register", "/api/auth/verify-email", "/api/auth/change-password"];
    if (AUTH_SKIP.some((path) => originalRequest.url?.includes(path))) {
      return Promise.reject(error);
    }

    // Nếu chính request refresh bị 401 → logout
    if (originalRequest.url?.includes("/api/auth/refresh")) {
      _forceLogout();
      return Promise.reject(error);
    }

    // Đang refresh → cho vào hàng đợi
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      console.log("storedRefreshToken:", storedRefreshToken);
      // Gửi refreshToken qua body (withCredentials: false nên không dùng cookie)
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/refresh`,
        { refreshToken: storedRefreshToken },
        { withCredentials: false },
      );

      const newToken =
        res.data?.accessToken ||
        res.data?.token ||
        res.data?.data?.accessToken;

      if (!newToken) throw new Error("Không nhận được token mới");

      localStorage.setItem("accessToken", newToken);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;

      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);
      _forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

function _forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

export default axiosInstance;
