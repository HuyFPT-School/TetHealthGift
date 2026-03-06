// api/index.js
// Dùng Bearer token từ localStorage — không cần credentials/cookie

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = {
  _getToken() {
    return localStorage.getItem("accessToken");
  },

  async req(method, path, body) {
    const token = this._getToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      // KHÔNG dùng credentials:"include" vì backend cors dùng origin:"*"
      body: body ? JSON.stringify(body) : undefined,
    });

    // Nếu 401 → thử refresh rồi retry 1 lần
    if (res.status === 401) {
      const refreshed = await this._tryRefresh();
      if (refreshed) {
        const retryHeaders = { "Content-Type": "application/json" };
        retryHeaders["Authorization"] = `Bearer ${this._getToken()}`;
        const retryRes = await fetch(`${BASE}${path}`, {
          method,
          headers: retryHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });
        const retryData = await retryRes.json().catch(() => ({}));
        if (!retryRes.ok) throw new Error(retryData.message || `HTTP ${retryRes.status}`);
        return retryData;
      }
      // Refresh thất bại → về login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error("Phiên đăng nhập hết hạn");
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  },

  async _tryRefresh() {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      console.log("storedRefreshToken:", storedRefreshToken);
      if (!storedRefreshToken) return false;

      const res = await fetch(`${BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Gửi qua body vì withCredentials:false (không dùng cookie)
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      const newToken = data.accessToken || data.token || data.data?.accessToken;
      if (!newToken) return false;
      localStorage.setItem("accessToken", newToken);
      return true;
    } catch {
      return false;
    }
  },

  get:    (p)    => api.req("GET",    p),
  post:   (p, b) => api.req("POST",   p, b),
  put:    (p, b) => api.req("PUT",    p, b),
  patch:  (p, b) => api.req("PATCH",  p, b),
  delete: (p)    => api.req("DELETE", p),
};

export default api;