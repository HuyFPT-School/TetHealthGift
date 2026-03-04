import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VscHome } from "react-icons/vsc";
import { VscGift } from "react-icons/vsc";
import { VscCodeOss } from "react-icons/vsc";
import { useAuth } from "../../context/AuthContext";
export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/qua-tet?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const navItems = [
    { label: "Trang chủ", icon: <VscHome size={16} />, to: "/" },
    { label: "Qùa tết ▾", icon: <VscGift size={16} />, to: "/qua-tet" },
    { label: "Blog", icon: <VscCodeOss size={16} />, to: "/blog" },
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
              alignItems: "flex-start",
              gap: "4px",
            }}
          >
            <img
              src="/TetHealthGift-logo.png"
              alt="TetHealthGift"
              style={{
                height: "clamp(32px, 5vw, 50px)",
                width: "auto",
                objectFit: "contain",
              }}
            />
            <span
              style={{
                fontSize: "clamp(9px, 1.8vw, 11px)",
                color: "#7a0a0a",
                fontWeight: "500",
                whiteSpace: "nowrap",
              }}
            >
              Quà Tết Sức Khỏe - Trao Gửi Yêu Thương
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
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
          {/* User Menu - Conditional Render */}
          {user ? (
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <div
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  transition: "background 0.2s",
                  background: showUserDropdown ? "#f8e8d8" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!showUserDropdown)
                    e.currentTarget.style.background = "#f8f8f8";
                }}
                onMouseLeave={(e) => {
                  if (!showUserDropdown)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#c0392b",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span
                  style={{ fontSize: "13px", color: "#555", fontWeight: "500" }}
                >
                  {user.name || user.email}
                </span>
                <svg
                  style={{
                    width: "16px",
                    height: "16px",
                    transition: "transform 0.2s",
                    transform: showUserDropdown
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                  fill="none"
                  stroke="#666"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: "0",
                    background: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    minWidth: "180px",
                    overflow: "hidden",
                    zIndex: 1000,
                    border: "1px solid #f0e8e0",
                  }}
                >
                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      color: "#333",
                      textDecoration: "none",
                      transition: "background 0.2s",
                      borderBottom: "1px solid #f5f5f5",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f8e8d8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#c0392b"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Hồ sơ
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      color: "#333",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f8e8d8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#c0392b"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Link
                to="/register"
                style={{
                  fontSize: "13px",
                  color: "#666",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c0392b")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
              >
                Đăng ký
              </Link>
              <span style={{ color: "#ddd" }}>|</span>
              <Link
                to="/login"
                style={{
                  fontSize: "13px",
                  color: "#666",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c0392b")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
              >
                Đăng nhập
              </Link>
            </div>
          )}

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
              <span style={{ fontSize: "22px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </span>
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
      </nav>
    </header>
  );
}
