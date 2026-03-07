import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShoppingCart, Star, Tag } from "lucide-react";

export default function StaffNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      path: "/staff/orders",
      icon: <ShoppingCart size={16} strokeWidth={1.75} />,
      label: "Quản lý đơn hàng",
    },
    {
      path: "/staff/reviews",
      icon: <Star size={16} strokeWidth={1.75} />,
      label: "Quản lý đánh giá",
    },
    {
      path: "/staff/coupons",
      icon: <Tag size={16} strokeWidth={1.75} />,
      label: "Quản lý mã giảm giá",
    },
  ];

  return (
    <header
      style={{
        background: "linear-gradient(135deg, #c0392b 0%, #7b241c 100%)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            Staff Dashboard
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.7)",
              marginTop: 2,
            }}
          >
            Quản lý hệ thống Tết Health Gift
          </div>
        </div>

        {/* User Info & Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#fff",
              fontSize: 14,
            }}
          >
            <span>👤</span>
            <span>
              {user?.fullname || user?.name || user?.email || "Staff"}
            </span>
            <span
              style={{
                fontSize: 11,
                background: "#e67e22",
                padding: "2px 8px",
                borderRadius: 12,
                fontWeight: 600,
              }}
            >
              {user?.role || "StaffManager"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              padding: "8px 20px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
            }
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: "flex", gap: 4, padding: "0 40px" }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 20px",
                color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                borderBottom: isActive
                  ? "3px solid #fff"
                  : "3px solid transparent",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                if (!isActive)
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
