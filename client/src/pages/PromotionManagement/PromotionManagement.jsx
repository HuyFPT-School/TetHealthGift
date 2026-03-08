import { useState, useEffect, useMemo } from "react";
import axiosInstance from "@/lib/axios";
import { Spinner, Toast } from "../../components/CM/Components";
import "./PromotionManagement.css";

/* ── Helpers ── */
const vnd = n => (n || 0).toLocaleString("vi-VN") + " ₫";

const discountPercent = (original, discounted) => {
  if (!original || !discounted) return 0;
  return Math.round((1 - discounted / original) * 100);
};

/* ══════════════════════════════════════════════ */
const PromotionManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [toast,    setToast]    = useState(null);

  // Filters
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("all"); // all | active | none

  // Inline edit state: { [productId]: { value, saving } }
  const [editing, setEditing] = useState({});

  /* ── Fetch products ── */
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/api/products?limit=200");
      const list = res.data?.data?.products || res.data?.products || [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  /* ── Toast helper ── */
  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Summary stats ── */
  const stats = useMemo(() => ({
    total:    products.length,
    active:   products.filter(p => p.discountPrice).length,
    noPromo:  products.filter(p => !p.discountPrice).length,
  }), [products]);

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p => {
      const matchSearch = !q || p.name?.toLowerCase().includes(q)
        || p.category?.name?.toLowerCase().includes(q);
      const matchFilter =
        filter === "all"    ? true :
        filter === "active" ? !!p.discountPrice :
        filter === "none"   ? !p.discountPrice  : true;
      return matchSearch && matchFilter;
    });
  }, [products, search, filter]);

  /* ── Start editing ── */
  const startEdit = (p) => {
    setEditing(prev => ({
      ...prev,
      [p._id]: { value: p.discountPrice ? String(p.discountPrice) : "", saving: false },
    }));
  };

  const cancelEdit = (id) => {
    setEditing(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const handleEditChange = (id, value) => {
    setEditing(prev => ({ ...prev, [id]: { ...prev[id], value } }));
  };

  /* ── Save discount ── */
  const saveDiscount = async (product) => {
    const raw = editing[product._id]?.value;
    const discountPrice = raw === "" ? null : Number(raw);

    // Validate
    if (discountPrice !== null) {
      if (isNaN(discountPrice) || discountPrice <= 0) {
        showToast("Giá giảm phải là số dương", "error"); return;
      }
      if (discountPrice >= product.price) {
        showToast("Giá giảm phải thấp hơn giá gốc", "error"); return;
      }
    }

    setEditing(prev => ({ ...prev, [product._id]: { ...prev[product._id], saving: true } }));

    try {
      await axiosInstance.put(`/api/products/${product._id}`, { discountPrice });
      showToast(discountPrice ? "Đã cập nhật giá khuyến mãi" : "Đã xóa khuyến mãi");
      cancelEdit(product._id);
      fetchProducts();
    } catch (e) {
      showToast(e.response?.data?.message || e.message, "error");
      setEditing(prev => ({ ...prev, [product._id]: { ...prev[product._id], saving: false } }));
    }
  };

  /* ── Remove discount shortcut ── */
  const removeDiscount = async (product) => {
    try {
      await axiosInstance.put(`/api/products/${product._id}`, { discountPrice: null });
      showToast("Đã xóa khuyến mãi");
      fetchProducts();
    } catch (e) {
      showToast(e.response?.data?.message || e.message, "error");
    }
  };

  /* ── Render ── */
  return (
    <div className="promo-page fade-in">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div className="promo-header">
        <div>
          <span className="promo-title">Quản lý khuyến mãi</span>
          <span className="promo-count">({filtered.length} sản phẩm)</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="promo-summary">
        <div className="summary-card">
          <div className="summary-value">{stats.total}</div>
          <div className="summary-label">Tổng sản phẩm</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: "#166534" }}>{stats.active}</div>
          <div className="summary-label" style={{ color: "#166534" }}>Đang giảm giá</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: "#92400E" }}>{stats.noPromo}</div>
          <div className="summary-label" style={{ color: "#92400E" }}>Chưa có khuyến mãi</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="promo-toolbar">
        <div className="promo-search-wrap">
          <span className="promo-search-icon"></span>
          <input
            className="inp"
            style={{ paddingLeft: 36 }}
            placeholder="Tìm theo tên sản phẩm, danh mục..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {[
            { key: "all",    label: "Tất cả" },
            { key: "active", label: "Đang giảm" },
            { key: "none",   label: "Chưa giảm" },
          ].map(f => (
            <button
              key={f.key}
              className={`filter-tab${filter === f.key ? " active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card table-card">
        {loading ? (
          <div className="table-loading"><Spinner size={36} /></div>
        ) : error ? (
          <div className="table-error">{error}</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá gốc</th>
                  <th>Giá khuyến mãi</th>
                  <th>Giảm</th>
                  <th style={{ minWidth: 260 }}>Chỉnh sửa khuyến mãi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan={5}>Không tìm thấy sản phẩm nào</td>
                  </tr>
                ) : filtered.map((p, i) => {
                  const isEditing = !!editing[p._id];
                  const editState = editing[p._id];
                  const pct = discountPercent(p.price, p.discountPrice);

                  return (
                    <tr key={p._id} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>

                      {/* Sản phẩm */}
                      <td>
                        <div className="promo-product-info">
                          {p.imageUrl
                            ? <img src={p.imageUrl} className="promo-img" alt={p.name} />
                            : <div className="promo-img-placeholder"></div>
                          }
                          <div>
                            <div className="promo-product-name">{p.name}</div>
                            <div className="promo-product-cat">
                              {p.category?.name || "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Giá gốc */}
                      <td>
                        <span className="price-original">{vnd(p.price)}</span>
                      </td>

                      {/* Giá khuyến mãi */}
                      <td>
                        {p.discountPrice
                          ? <span className="price-discount">{vnd(p.discountPrice)}</span>
                          : <span className="price-none">Chưa có</span>
                        }
                      </td>

                      {/* % giảm */}
                      <td>
                        {pct > 0
                          ? <span className="discount-badge">-{pct}%</span>
                          : <span className="no-discount-badge">—</span>
                        }
                      </td>

                      {/* Actions */}
                      <td>
                        {isEditing ? (
                          <div className="inline-edit">
                            <input
                              className="price-input"
                              type="number"
                              min={0}
                              max={p.price - 1}
                              placeholder={`Tối đa ${vnd(p.price - 1)}`}
                              value={editState.value}
                              onChange={e => handleEditChange(p._id, e.target.value)}
                              onKeyDown={e => {
                                if (e.key === "Enter") saveDiscount(p);
                                if (e.key === "Escape") cancelEdit(p._id);
                              }}
                              autoFocus
                            />
                            <button
                              className="btn-save-inline"
                              onClick={() => saveDiscount(p)}
                              disabled={editState.saving}
                            >
                              {editState.saving ? <Spinner size={12} /> : "Lưu"}
                            </button>
                            <button className="btn-cancel-inline" onClick={() => cancelEdit(p._id)}>
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <button className="btn-icon-blue" onClick={() => startEdit(p)}
                              title="Đặt giá khuyến mãi">
                              {p.discountPrice ? "Sửa" : "Thêm"}
                            </button>
                            {p.discountPrice && (
                              <button
                                className="btn-remove-discount"
                                onClick={() => removeDiscount(p)}
                                title="Xóa khuyến mãi"
                              >
                                Xóa KM
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionManagement;