import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ Gửi HttpOnly cookie refreshToken tự động
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

    // Bo qua auto-refresh voi cac auth endpoints
    const AUTH_SKIP = ["/api/auth/login", "/api/auth/register", "/api/auth/verify-email", "/api/auth/change-password"];
    if (AUTH_SKIP.some((path) => originalRequest.url?.includes(path))) {
      return Promise.reject(error);
    }

    // Neu chinh request refresh bi 401 → logout
    if (originalRequest.url?.includes("/api/auth/refresh")) {
      _forceLogout();
      return Promise.reject(error);
    }

    // Dang refresh → cho vao hang doi
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
      //  Chi gui cookie — backend doc tu req.cookies.refreshToken
      // KHONG gui body refreshToken nua
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/refresh`,
        {},
        { withCredentials: true },
      );

      const newToken =
        res.data?.accessToken ||
        res.data?.token ||
        res.data?.data?.accessToken;

      if (!newToken) throw new Error("Khong nhan duoc token moi");

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
  localStorage.removeItem("user");
  window.dispatchEvent(new CustomEvent("auth:expired"));
  window.location.href = "/login";
}

export default axiosInstance;