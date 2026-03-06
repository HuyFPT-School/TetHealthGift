import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./Header.css";

const TABS = [
  { path: "/admin/analytics", label: "Tổng quan" },
  { path: "/admin/products", label: "Sản phẩm" },
  { path: "/admin/blogs", label: "Blog" },
];

const HeaderManagement = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="header">
      {/* Top bar */}
      <div className="header-top">
        <div className="header-brand">
          <div className="header-logo">🎋</div>
          <div>
            <div className="header-title">Admin Dashboard</div>
            <div className="header-subtitle">
              Quản lý hệ thống Tết Health Gift
            </div>
          </div>
        </div>
        <div className="header-actions">
          <span className="header-user">
            {user?.name || user?.fullname || user?.email || "Admin"}
          </span>
          <button className="btn-logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Nav tabs */}
      <nav className="header-nav">
        {TABS.map((t) => (
          <div
            key={t.path}
            className={`tab-item${pathname === t.path ? " active" : ""}`}
            onClick={() => navigate(t.path)}
          >
            <span>{t.icon}</span>
            {t.label}
          </div>
        ))}
      </nav>
    </header>
  );
};

export default HeaderManagement;
