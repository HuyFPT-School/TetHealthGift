import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import {
  Spinner,
  Toast,
  Modal,
  StockBadge,
  vnd,
} from "../../components/CM/Components";
import "./ProductManagement.css";

const LIMIT = 10;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState(null);

  const blank = {
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    imageUrl: "",
  };
  const [form, setForm] = useState(blank);

  const showT = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.set("search", search);
      if (filterCat) params.set("category", filterCat);
      const res = await axiosInstance.get(`/api/products?${params}`);
      // Backend trả { message, data: [...] } hoặc { data: { products, total } }
      const body = res.data;
      const list = body?.data?.products || body?.data || body?.products || [];
      const tot =
        body?.data?.total ||
        body?.total ||
        (Array.isArray(list) ? list.length : 0);
      setProducts(Array.isArray(list) ? list : []);
      setTotal(tot);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterCat]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    axiosInstance
      .get("/api/categories")
      .then((r) => {
        const list = r.data?.data || r.data?.categories || r.data || [];
        setCategories(Array.isArray(list) ? list : []);
      })
      .catch(() => {});
  }, []);

  const openAdd = () => {
    setForm(blank);
    setEditItem(null);
    setShowForm(true);
  };
  const openEdit = (p) => {
    setForm({
      name: p.name || "",
      description: p.description || "",
      price: String(p.price || ""),
      category: p.category?._id || p.category || "",
      quantity: String(p.quantity || ""),
      imageUrl: p.imageUrl || "",
    });
    setEditItem(p);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name || !form.price || form.quantity === "") return;
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        category: form.category,
        imageUrl: form.imageUrl || "",
      };
      if (editItem) {
        await axiosInstance.put(`/api/products/${editItem._id}`, body);
        showT("Đã cập nhật sản phẩm");
      } else {
        await axiosInstance.post("/api/products", body);
        showT("Đã thêm sản phẩm mới");
      }
      setShowForm(false);
      load();
    } catch (e) {
      showT(e.response?.data?.message || e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id, name) => {
    if (!confirm(`Xoá sản phẩm "${name}"?`)) return;
    try {
      await axiosInstance.delete(`/api/products/${id}`);
      showT("Đã xoá sản phẩm");
      load();
    } catch (e) {
      showT(e.response?.data?.message || e.message, "error");
    }
  };

  const pageCount = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="products-page fade-in">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon"></span>
          <input
            className="inp"
            style={{ paddingLeft: 34 }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm kiếm sản phẩm..."
          />
        </div>
        <select
          className="inp select-cat"
          value={filterCat}
          onChange={(e) => {
            setFilterCat(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <button onClick={openAdd} className="btn-primary">
          Thêm sản phẩm mới
        </button>
      </div>

      <div className="card table-card">
        {loading ? (
          <div className="table-loading">
            <Spinner size={32} />
          </div>
        ) : error ? (
          <div className="table-error"> {error}</div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl">
                <thead>
                  <tr>
                    {[
                      "ẢNH",
                      "TÊN SẢN PHẨM",
                      "DANH MỤC",
                      "GIÁ",
                      "TỒN KHO",
                      "THAO TÁC",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr
                      key={p._id}
                      className="row-hover"
                      style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}
                    >
                      <td>
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            className="product-img"
                            alt={p.name}
                          />
                        ) : (
                          <div className="product-img placeholder"></div>
                        )}
                      </td>
                      <td>
                        <div className="product-name">{p.name}</div>
                        {p.description && (
                          <div className="product-desc">{p.description}</div>
                        )}
                      </td>
                      <td className="product-cat">
                        {p.category?.name || p.category || "—"}
                      </td>
                      <td className="product-price">{vnd(p.price)}</td>
                      <td>
                        <StockBadge n={p.quantity || 0} />
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn-icon-blue"
                            onClick={() => openEdit(p)}
                          >
                            {" "}
                            Sửa
                          </button>
                          <button
                            className="btn-icon-red"
                            onClick={() => del(p._id, p.name)}
                          >
                            {" "}
                            Xoá
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty-row">
                        <div className="empty-icon"></div>
                        Không có sản phẩm nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>
                Trang {page}/{pageCount} · {total} sản phẩm
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn-outline"
                  style={{ padding: "6px 14px" }}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Trước
                </button>
                <button
                  className="btn-outline"
                  style={{ padding: "6px 14px" }}
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showForm && (
        <Modal
          title={editItem ? " Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          onClose={() => setShowForm(false)}
        >
          <div className="field">
            <label>Tên sản phẩm *</label>
            <input
              className="inp"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="VD: Sâm Hàn Quốc 6 Năm Tuổi"
            />
          </div>
          <div className="grid-2">
            <div className="field">
              <label>Giá bán (₫) *</label>
              <input
                className="inp"
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                placeholder="850000"
              />
            </div>
            <div className="field">
              <label>Số lượng *</label>
              <input
                className="inp"
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, quantity: e.target.value }))
                }
                placeholder="100"
              />
            </div>
          </div>
          <div className="field">
            <label>Danh mục</label>
            <select
              className="inp"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Mô tả</label>
            <textarea
              className="inp"
              rows={3}
              style={{ resize: "vertical" }}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Mô tả sản phẩm..."
            />
          </div>
          <div className="field">
            <label>Ảnh URL</label>
            <input
              className="inp"
              value={form.imageUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageUrl: e.target.value }))
              }
              placeholder="https://example.com/img.jpg"
            />
          </div>
          <div className="modal-footer">
            <button className="btn-outline" onClick={() => setShowForm(false)}>
              Huỷ
            </button>
            <button
              className="btn-primary"
              onClick={save}
              disabled={
                saving || !form.name || !form.price || form.quantity === ""
              }
            >
              {saving ? (
                <Spinner size={14} />
              ) : editItem ? (
                "Lưu thay đổi"
              ) : (
                "Thêm mới"
              )}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProductManagement;
