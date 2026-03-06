import { User } from "lucide-react";
import "./Header.css";

const Header = ({ tab, setTab, user, onLogout }) => {
  const tabs = [
    { k: "dashboard", icon: "📈", label: "Tổng quan"  },
    { k: "products",  icon: "🎁", label: "Sản phẩm"   },
    { k: "orders",    icon: "🛒", label: "Đơn hàng"   },
  ];

  return (
    <header className="header">
      {/* Top bar */}
      <div className="header-top">
        <div className="header-brand">
          <div className="header-logo">🎋</div>
          <div>
            <div className="header-title">Admin Dashboard</div>
            <div className="header-subtitle">Quản lý hệ thống Tết Health Gift</div>
          </div>
        </div>
        <div className="header-actions">
          <span className="header-user">
            <User size={16} strokeWidth={1.75} /> {user?.fullname || user?.name || user?.email || "Admin"}
          </span>
          <button className="btn-logout" onClick={onLogout}>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Nav tabs */}
      <nav className="header-nav">
        {tabs.map(t => (
          <div
            key={t.k}
            className={`tab-item${tab === t.k ? " active" : ""}`}
            onClick={() => setTab(t.k)}
          >
            <span>{t.icon}</span>
            {t.label}
          </div>
        ))}
      </nav>
    </header>
  );
};

export default Header;
