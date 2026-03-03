const BASE = "http://localhost:5000";

const api = {
  _token: null,

  setToken(t) {
    this._token = t;
  },

  async req(method, path, body) {
    const headers = { "Content-Type": "application/json" };
    if (this._token) headers["Authorization"] = `Bearer ${this._token}`;
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  },

  get:    (p)      => api.req("GET",    p),
  post:   (p, b)   => api.req("POST",   p, b),
  put:    (p, b)   => api.req("PUT",    p, b),
  patch:  (p, b)   => api.req("PATCH",  p, b),
  delete: (p)      => api.req("DELETE", p),
};

export default api;
