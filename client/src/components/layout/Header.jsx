import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/qua-tet?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const navItems = [
    { label: "TRANG CHỦ", icon: "🏠", to: "/" },
    { label: "GIỚI THIỆU", icon: "👤", to: "/gioi-thieu" },
    { label: "QUÀ TẾT ▾", icon: "🎁", to: "/qua-tet" },
    { label: "QUÀ 8/3", icon: "🎁", to: "/qua-83" },
    { label: "BLOG", icon: "📰", to: "/blog" },
    { label: "LIÊN HỆ", icon: "✉️", to: "/lien-he" },
  ];

  return (
    <header style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Top announcement bar */}
      <div
        style={{
          background: "#f8e8d8",
          color: "#c0392b",
          fontSize: "12px",
          padding: "7px 20px",
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: "4px",
          alignItems: "center",
        }}
      >
        <span>🚚 Freeship đơn từ 5tr ở HCM</span>
        <span>🎁 Miễn phí khắc logo từ 20 hộp</span>
        <span>🏷️ Lựa chọn các loại nhãn theo set</span>
        <span>💰 Tiết kiệm ngay 5% khi đặt hàng onl</span>
      </div>

      {/* Main header */}
      <div
        style={{
          background: "#fff",
          padding: "12px 40px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          borderBottom: "1px solid #f0e8e0",
          flexWrap: "wrap",
        }}
      >
        {/* Logo → về trang chủ */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1,
              minWidth: "160px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "#c0392b",
                fontStyle: "italic",
                letterSpacing: "2px",
              }}
            >
              tet
            </span>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#c0392b",
                fontFamily: "Georgia, serif",
                letterSpacing: "-0.5px",
              }}
            >
              health<span style={{ color: "#e67e22" }}>gift</span>
            </span>
          </div>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          style={{
            flex: 1,
            maxWidth: "600px",
            display: "flex",
            border: "1.5px solid #ddd",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Nhập từ khoá tìm kiếm"
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "none",
              outline: "none",
              fontSize: "14px",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderLeft: "1px solid #ddd",
              padding: "0 12px",
              gap: "6px",
              cursor: "pointer",
              minWidth: "140px",
              fontSize: "13px",
              color: "#555",
              background: "#fafafa",
            }}
          >
            <span>CHỌN LOẠI QUÀ</span>
            <span style={{ fontSize: "10px", color: "#999" }}>▼</span>
          </div>
          <button
            type="submit"
            style={{
              background: "#e67e22",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            🔍
          </button>
        </form>

        {/* Right actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginLeft: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              color: "#555",
              fontSize: "13px",
            }}
          >
            <span style={{ fontSize: "18px" }}>🤍</span>
            <span style={{ fontWeight: "600" }}>SP YÊU THÍCH</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              color: "#555",
              fontSize: "13px",
            }}
          >
            <span style={{ position: "relative" }}>
              <span style={{ fontSize: "22px" }}>🛒</span>
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-6px",
                  background: "#c0392b",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                0
              </span>
            </span>
            <span>0 đ</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          background: "#fdf0e8",
          borderBottom: "1px solid #f0ddd0",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            margin: 0,
            padding: 0,
            gap: 0,
            flex: 1,
            justifyContent: "center",
          }}
        >
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "14px 18px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#c0392b",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e67e22")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#c0392b")}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* CATALOG */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "1px", height: "30px", background: "#ddd" }} />
          <button
            style={{
              background: "#c0392b",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            📋 CATALOG
          </button>
        </div>
      </nav>
    </header>
  );
}
