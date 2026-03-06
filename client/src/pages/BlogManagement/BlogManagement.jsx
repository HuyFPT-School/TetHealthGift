import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import { Spinner, Toast, Modal } from "../../components/CM/Components";
import "./BlogManagement.css";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" }) : "";

const blank = { title: "", content: "", author: "", tags: "", image: "" };

const BlogManagement = () => {
  const [blogs,    setBlogs]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [form,     setForm]     = useState(blank);
  const [toast,    setToast]    = useState(null);

  const showT = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await axiosInstance.get("/api/blogs");
      setBlogs(res.data?.data || []);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = blogs.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm(blank); setEditItem(null); setShowForm(true); };
  const openEdit = (b) => {
    setForm({
      title:   b.title   || "",
      content: b.content || "",
      author:  b.author  || "",
      tags:    (b.tags || []).join(", "),
      image:   b.image   || "",
    });
    setEditItem(b);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      showT("Vui lòng nhập tiêu đề và nội dung", "error");
      return;
    }
    setSaving(true);
    try {
      const body = {
        title:   form.title.trim(),
        content: form.content.trim(),
        author:  form.author.trim(),
        tags:    form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        image:   form.image.trim(),
      };
      if (editItem) {
        await axiosInstance.put(`/api/blogs/${editItem._id}`, body);
        showT("Đã cập nhật bài viết");
      } else {
        await axiosInstance.post("/api/blogs", body);
        showT("Đã tạo bài viết mới");
      }
      setShowForm(false);
      load();
    } catch (e) {
      showT(e.response?.data?.message || e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id, title) => {
    if (!confirm(`Xoá bài viết "${title}"?`)) return;
    try {
      await axiosInstance.delete(`/api/blogs/${id}`);
      showT("Đã xoá bài viết");
      load();
    } catch (e) {
      showT(e.response?.data?.message || e.message, "error");
    }
  };

  const f = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="bm-page fade-in">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div className="bm-header">
        <div>
          <h2 className="bm-title">Quản lý Blog</h2>
          <p className="bm-sub">{blogs.length} bài viết</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>Thêm bài viết</button>
      </div>

      {/* Search */}
      <div className="search-wrap" style={{ maxWidth: 380, marginBottom: 20 }}>
        <span className="search-icon"></span>
        <input
          className="inp"
          style={{ paddingLeft: 34 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm tiêu đề, tác giả..."
        />
      </div>

      {/* Table */}
      <div className="card bm-table-card">
        {loading ? (
          <div className="table-loading"><Spinner size={32} /></div>
        ) : error ? (
          <div className="table-error">{error}</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead>
                <tr>
                  {["ẢNH", "TIÊU ĐỀ", "TÁC GIẢ", "TAGS", "NGÀY TẠO", "THAO TÁC"].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b._id} className="row-hover"
                    style={{ background: i % 2 === 0 ? "#fff" : "var(--row-alt)" }}>

                    {/* Thumbnail */}
                    <td>
                      {b.image ? (
                        <img
                          src={b.image} alt={b.title}
                          className="bm-thumb"
                          onError={e => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div className="bm-thumb-placeholder"></div>
                      )}
                    </td>

                    {/* Title */}
                    <td className="bm-td-title">
                      <div className="bm-blog-title">{b.title}</div>
                      <div className="bm-blog-excerpt">
                        {b.content?.replace(/<[^>]*>/g, "").slice(0, 65)}...
                      </div>
                    </td>

                    {/* Author */}
                    <td className="bm-author">{b.author || "—"}</td>

                    {/* Tags */}
                    <td>
                      <div className="bm-tags">
                        {(b.tags || []).slice(0, 2).map(t => (
                          <span key={t} className="bm-tag">#{t}</span>
                        ))}
                        {(b.tags || []).length > 2 && (
                          <span className="bm-tag-more">+{b.tags.length - 2}</span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="bm-date">{fmtDate(b.createdAt)}</td>

                    {/* Actions */}
                    <td>
                      <div className="action-btns">
                        <button className="btn-outline bm-btn-sm" onClick={() => setPreview(b)}>Xem</button>
                        <button className="btn-icon-blue" onClick={() => openEdit(b)}>Sửa</button>
                        <button className="btn-icon-red"  onClick={() => del(b._id, b.title)}>Xoá</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="bm-empty-row">
                      <div className="bm-empty-icon"></div>
                      Không có bài viết nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Form Modal ── */}
      {showForm && (
        <Modal
          title={editItem ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
          onClose={() => setShowForm(false)}
          wide
        >
          <div className="field">
            <label>Tiêu đề *</label>
            <input className="inp" value={form.title} onChange={f("title")}
              placeholder="Nhập tiêu đề bài viết..." />
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Tác giả</label>
              <input className="inp" value={form.author} onChange={f("author")}
                placeholder="Tên tác giả..." />
            </div>
            <div className="field">
              <label>Tags (cách nhau dấu phẩy)</label>
              <input className="inp" value={form.tags} onChange={f("tags")}
                placeholder="sức khoẻ, dinh dưỡng..." />
            </div>
          </div>

          <div className="field">
            <label>URL ảnh bìa</label>
            <input className="inp" value={form.image} onChange={f("image")}
              placeholder="https://example.com/image.jpg" />
            {form.image && (
              <img src={form.image} alt="preview" className="bm-img-preview"
                onError={e => { e.target.style.display = "none"; }} />
            )}
          </div>

          <div className="field">
            <label>Nội dung * (hỗ trợ HTML)</label>
            <textarea
              className="inp bm-textarea"
              value={form.content}
              onChange={f("content")}
              placeholder="Nội dung bài viết..."
              rows={10}
            />
          </div>

          <div className="modal-footer">
            <button className="btn-outline" onClick={() => setShowForm(false)}>Huỷ</button>
            <button
              className="btn-primary"
              onClick={save}
              disabled={saving || !form.title.trim() || !form.content.trim()}
            >
              {saving ? <Spinner size={14} /> : editItem ? "Lưu thay đổi" : "Đăng bài"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Preview Modal ── */}
      {preview && (
        <Modal title={`👁 ${preview.title}`} onClose={() => setPreview(null)} wide>
          {preview.image && (
            <img src={preview.image} alt={preview.title} className="bm-preview-hero"
              onError={e => { e.target.style.display = "none"; }} />
          )}
          <div className="bm-preview-meta">
            {preview.author && <span>{preview.author}</span>}
            <span>{fmtDate(preview.createdAt)}</span>
          </div>
          {(preview.tags || []).length > 0 && (
            <div className="bm-tags" style={{ marginBottom: 16 }}>
              {preview.tags.map(t => <span key={t} className="bm-tag">#{t}</span>)}
            </div>
          )}
          <div className="bm-preview-content">
            {preview.content?.includes("<") ? (
              <div dangerouslySetInnerHTML={{ __html: preview.content }} />
            ) : (
              preview.content?.split("\n").map((p, i) =>
                p.trim() ? <p key={i}>{p}</p> : <br key={i} />
              )
            )}
          </div>
          <div className="modal-footer">
            <button className="btn-outline" onClick={() => setPreview(null)}>Đóng</button>
            <button className="btn-primary" onClick={() => { setPreview(null); openEdit(preview); }}>
              Chỉnh sửa
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BlogManagement;
