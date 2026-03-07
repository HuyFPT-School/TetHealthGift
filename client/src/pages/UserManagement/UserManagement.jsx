import { useState, useEffect, useMemo } from "react";
import axiosInstance from "@/lib/axios";
import { Spinner, Toast, Modal } from "../../components/CM/Components";
import "./UserManagement.css";

/* ── Helpers ── */
const fmtDate = s => s ? new Date(s).toLocaleDateString("vi-VN") : "—";

const ROLE_STYLE = {
  Admin:        { bg: "#FEE2E2", color: "#991B1B" },
  StaffManager: { bg: "#DBEAFE", color: "#1E40AF" },
  User:         { bg: "#F3F4F6", color: "#374151" },
};

const RoleBadge = ({ role }) => {
  const s = ROLE_STYLE[role] || ROLE_STYLE.User;
  return (
    <span className="role-badge" style={{ background: s.bg, color: s.color }}>
      {role}
    </span>
  );
};

const VerifyBadge = ({ verified }) => (
  <span className="verify-badge" style={{
    background: verified ? "#D1FAE5" : "#FEF3C7",
    color:      verified ? "#065F46" : "#92400E",
  }}>
    {verified ? "✓ Đã xác thực" : " Chưa xác thực"}
  </span>
);

const Avatar = ({ user }) => {
  const initials = (user.fullname || user.email || "?")
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return user.avatar
    ? <img src={user.avatar} className="user-avatar" alt={user.fullname} />
    : <div className="user-avatar-placeholder">{initials}</div>;
};

/* ── Empty form state ── */
const EMPTY_FORM = {
  fullname: "", email: "", password: "",
  phone: "", gender: "male", dateOfBirth: "",
  address: "", role: "User",
};

const PAGE_SIZE = 10;

/* ══════════════════════════════════════════════ */
const UserManagement = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [toast,   setToast]   = useState(null);

  // Filters
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page,       setPage]       = useState(1);

  // Modals
  const [showCreate,  setShowCreate]  = useState(false);
  const [editUser,    setEditUser]    = useState(null);   // user obj
  const [deleteUser,  setDeleteUser]  = useState(null);   // user obj
  const [formData,    setFormData]    = useState(EMPTY_FORM);
  const [saving,      setSaving]      = useState(false);
  const [formError,   setFormError]   = useState("");

  /* ── Fetch ── */
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/api/users");
      const list = res.data?.data || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  /* ── Toast helper ── */
  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Filtered + paginated ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u => {
      const matchSearch = !q
        || u.fullname?.toLowerCase().includes(q)
        || u.email?.toLowerCase().includes(q)
        || u.phone?.toString().includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page khi filter thay đổi
  useEffect(() => setPage(1), [search, roleFilter]);

  /* ── Form helpers ── */
  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setFormError("");
    setShowCreate(true);
  };

  const openEdit = (u) => {
    setFormData({
      fullname:    u.fullname    || "",
      phone:       u.phone       || "",
      gender:      u.gender      || "male",
      dateOfBirth: u.dateOfBirth ? u.dateOfBirth.slice(0, 10) : "",
      address:     u.address     || "",
    });
    setFormError("");
    setEditUser(u);
  };

  const handleChange = e => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  /* ── Create user ── */
  const handleCreate = async () => {
    const { fullname, email, password, phone, gender, dateOfBirth } = formData;
    if (!fullname || !email || !password || !phone || !gender || !dateOfBirth) {
      setFormError("Vui lòng điền đầy đủ các trường bắt buộc (*)");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      await axiosInstance.post("/api/users", formData);
      showToast("Tạo người dùng thành công");
      setShowCreate(false);
      fetchUsers();
    } catch (e) {
      setFormError(e.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── Update user (chỉ các field được phép) ── */
  const handleUpdate = async () => {
    if (!formData.fullname || !formData.phone) {
      setFormError("Họ tên và số điện thoại không được để trống");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      await axiosInstance.patch(`/api/users/${editUser._id}`, {
        fullname:    formData.fullname,
        phone:       formData.phone,
        gender:      formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address:     formData.address,
      });
      showToast("Cập nhật người dùng thành công");
      setEditUser(null);
      fetchUsers();
    } catch (e) {
      setFormError(e.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete user ── */
  const handleDelete = async () => {
    setSaving(true);
    try {
      await axiosInstance.delete(`/api/users/${deleteUser._id}`);
      showToast("Đã xóa người dùng");
      setDeleteUser(null);
      fetchUsers();
    } catch (e) {
      showToast(e.response?.data?.message || e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Render ── */
  return (
    <div className="users-page fade-in">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div className="users-header">
        <div>
          <span className="users-title">Quản lý người dùng</span>
          <span className="users-count">({filtered.length} người dùng)</span>
        </div>
        <button className="btn-primary" onClick={openCreate}>Thêm người dùng</button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon"></span>
          <input
            className="inp"
            style={{ paddingLeft: 36 }}
            placeholder="Tìm theo tên, email, số điện thoại..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="inp select-role"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="all">Tất cả role</option>
          <option value="Admin">Admin</option>
          <option value="StaffManager">StaffManager</option>
          <option value="User">User</option>
        </select>
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
                  <th>Người dùng</th>
                  <th>Số điện thoại</th>
                  <th>Role</th>
                  <th>Xác thực</th>
                  <th>Ngày tạo</th>
                  <th style={{ textAlign: "center" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan={6}>Không tìm thấy người dùng nào</td>
                  </tr>
                ) : paginated.map((u, i) => (
                  <tr key={u._id} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td>
                      <div className="user-info">
                        <Avatar user={u} />
                        <div>
                          <div className="user-name">{u.fullname || "—"}</div>
                          <div className="user-email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{u.phone || "—"}</td>
                    <td><RoleBadge role={u.role} /></td>
                    <td><VerifyBadge verified={u.isVerified} /></td>
                    <td style={{ color: "#888", fontSize: 13 }}>{fmtDate(u.createdAt)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button className="btn-icon-blue" onClick={() => openEdit(u)}
                          title="Chỉnh sửa">Chỉnh sửa</button>
                        <button className="btn-icon-red" onClick={() => setDeleteUser(u)}
                          title="Xóa">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
            ← Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`page-btn${page === p ? " active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
            Sau →
          </button>
        </div>
      )}

      {/* ── Modal: Tạo mới ── */}
      {showCreate && (
        <Modal title="Thêm người dùng mới" onClose={() => setShowCreate(false)} wide>
          <div className="form-grid">
            <div className="field">
              <label>Họ tên *</label>
              <input className="inp" name="fullname" value={formData.fullname}
                onChange={handleChange} placeholder="Nguyễn Văn A" />
            </div>
            <div className="field">
              <label>Email *</label>
              <input className="inp" name="email" type="email" value={formData.email}
                onChange={handleChange} placeholder="email@example.com" />
            </div>
            <div className="field">
              <label>Mật khẩu * (8-30 ký tự, hoa, thường, số)</label>
              <input className="inp" name="password" type="password" value={formData.password}
                onChange={handleChange} placeholder="••••••••" />
            </div>
            <div className="field">
              <label>Số điện thoại *</label>
              <input className="inp" name="phone" value={formData.phone}
                onChange={handleChange} placeholder="0901234567" />
            </div>
            <div className="field">
              <label>Giới tính *</label>
              <select className="inp" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className="field">
              <label>Ngày sinh *</label>
              <input className="inp" name="dateOfBirth" type="date" value={formData.dateOfBirth}
                onChange={handleChange} />
            </div>
            <div className="field">
              <label>Role</label>
              <select className="inp" name="role" value={formData.role} onChange={handleChange}>
                <option value="User">User</option>
                <option value="StaffManager">StaffManager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="field">
              <label>Địa chỉ</label>
              <input className="inp" name="address" value={formData.address}
                onChange={handleChange} placeholder="123 Đường ABC, TP.HCM" />
            </div>
          </div>
          {formError && (
            <div style={{ color: "#991B1B", fontSize: 13, marginBottom: 12 }}> {formError}</div>
          )}
          <div className="modal-actions">
            <button className="btn-outline" onClick={() => setShowCreate(false)}>Hủy</button>
            <button className="btn-primary" onClick={handleCreate} disabled={saving}>
              {saving ? <Spinner size={16} /> : "Tạo người dùng"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Modal: Chỉnh sửa ── */}
      {editUser && (
        <Modal title={`Chỉnh sửa: ${editUser.fullname || editUser.email}`}
          onClose={() => setEditUser(null)} wide>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 14, padding: "8px 12px",
            background: "#FEF9C3", borderRadius: 8, border: "1px solid #FDE68A" }}>
             Không thể thay đổi email, mật khẩu và role qua form này (giới hạn từ backend)
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Họ tên *</label>
              <input className="inp" name="fullname" value={formData.fullname}
                onChange={handleChange} />
            </div>
            <div className="field">
              <label>Số điện thoại *</label>
              <input className="inp" name="phone" value={formData.phone}
                onChange={handleChange} />
            </div>
            <div className="field">
              <label>Giới tính</label>
              <select className="inp" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className="field">
              <label>Ngày sinh</label>
              <input className="inp" name="dateOfBirth" type="date" value={formData.dateOfBirth}
                onChange={handleChange} />
            </div>
            <div className="field full">
              <label>Địa chỉ</label>
              <input className="inp" name="address" value={formData.address}
                onChange={handleChange} placeholder="123 Đường ABC, TP.HCM" />
            </div>
          </div>
          {formError && (
            <div style={{ color: "#991B1B", fontSize: 13, marginBottom: 12 }}> {formError}</div>
          )}
          <div className="modal-actions">
            <button className="btn-outline" onClick={() => setEditUser(null)}>Hủy</button>
            <button className="btn-primary" onClick={handleUpdate} disabled={saving}>
              {saving ? <Spinner size={16} /> : "Lưu thay đổi"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Modal: Xác nhận xóa ── */}
      {deleteUser && (
        <Modal title="🗑 Xác nhận xóa" onClose={() => setDeleteUser(null)}>
          <div className="confirm-body">
            Bạn có chắc muốn xóa người dùng{" "}
            <span className="confirm-name">{deleteUser.fullname || deleteUser.email}</span>?
            <br />
            <span style={{ color: "#991B1B", fontSize: 13 }}>
              Hành động này không thể hoàn tác.
            </span>
          </div>
          <div className="modal-actions">
            <button className="btn-outline" onClick={() => setDeleteUser(null)}>Hủy</button>
            <button className="btn-icon-red" style={{ padding: "8px 20px", fontSize: 14 }}
              onClick={handleDelete} disabled={saving}>
              {saving ? <Spinner size={16} /> : "🗑 Xóa"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;