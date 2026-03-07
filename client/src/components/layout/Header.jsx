import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Gift,
  BookOpen,
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getWishlist } from "../../api/addWishList";
import { formatPrice } from "../../services/productService";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const cartDropdownTimeout = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlistItems([]);
        return;
      }
      try {
        const data = await getWishlist();
        setWishlistItems(data.wishlist || []);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };
    fetchWishlist();
  }, [user]);

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
    { label: "Trang chủ", icon: <Home size={16} />, to: "/" },
    { label: "Quà tết", icon: <Gift size={16} />, to: "/qua-tet" },
    { label: "Blog", icon: <BookOpen size={16} />, to: "/blog" },
  ];

  return (
    <header style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Top announcement bar */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #C62828 0%, #DC143C 50%, #FF6B35 100%)",
          color: "#FFF8F0",
          fontSize: "12px",
          padding: "8px 20px",
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "center",
          fontWeight: "600",
          boxShadow: "0 2px 8px rgba(198,40,40,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <strong>Freeship</strong> đơn từ 5tr ở HCM
        </span>
        <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          Miễn phí khắc logo từ <strong>20 hộp</strong>
        </span>
        <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          Lựa chọn nhãn theo set
        </span>
        <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          Tiết kiệm <strong>5%</strong> khi đặt hàng online
        </span>
      </div>

      {/* Main header */}
      <div
        style={{
          background: "linear-gradient(to bottom, #FFFFFF 0%, #FFF8F0 100%)",
          padding: "14px 40px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          borderBottom: "3px solid #F9A825",
          boxShadow: "0 4px 12px rgba(198,40,40,0.1)",
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "4px",
              position: "relative",
            }}
          >
            <img
              src="/TetHealthGift-logo.png"
              alt="TetHealthGift"
              style={{
                height: "clamp(36px, 5vw, 56px)",
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 2px 8px rgba(198,40,40,0.2))",
              }}
            />
            <span
              style={{
                fontSize: "clamp(10px, 1.8vw, 12px)",
                color: "#C62828",
                fontWeight: "700",
                whiteSpace: "nowrap",
                textShadow: "0 1px 2px rgba(198,40,40,0.1)",
              }}
            >
              Quà Tết Sức Khỏe - Trao Gửi Yêu Thương
            </span>
          </div>
        </Link>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          style={{
            flex: 1,
            maxWidth: "600px",
            display: "flex",
            border: "2px solid #F9A825",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(249,168,37,0.15)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#C62828";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(198,40,40,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#F9A825";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(249,168,37,0.15)";
          }}
        >
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm quà Tết sức khỏe..."
            style={{
              flex: 1,
              padding: "12px 18px",
              border: "none",
              outline: "none",
              fontSize: "14px",
              background: "#FFFAF5",
              color: "#2C1810",
              fontWeight: "500",
            }}
          />
          <button
            type="submit"
            style={{
              background: "linear-gradient(135deg, #FF6B35 0%, #C62828 100%)",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Search size={20} />
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
          {/* User Menu */}
          {user ? (
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <div
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  padding: "8px 14px",
                  borderRadius: "10px",
                  transition: "all 0.3s",
                  background: showUserDropdown
                    ? "linear-gradient(135deg, #FFE5D4 0%, #FFF5E6 100%)"
                    : "transparent",
                  border: showUserDropdown
                    ? "2px solid #F9A825"
                    : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!showUserDropdown) {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #FFF8F0 0%, #FFE5D4 100%)";
                    e.currentTarget.style.borderColor = "#F9A825";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showUserDropdown) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #C62828 0%, #FF6B35 100%)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: "700",
                    border: "2px solid #F9A825",
                    boxShadow: "0 2px 8px rgba(198,40,40,0.3)",
                    overflow: "hidden",
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || "User"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <span
                  style={{ fontSize: "13px", color: "#555", fontWeight: "500" }}
                >
                  {user.name || user.email}
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    transition: "transform 0.2s",
                    transform: showUserDropdown
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    color: "#666",
                  }}
                />
              </div>

              {/* Dropdown */}
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
                    to="/account"
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
                    <User size={18} color="#c0392b" />
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
                    <LogOut size={18} color="#c0392b" />
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

          {/* Cart */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => {
              clearTimeout(cartDropdownTimeout.current);
              setShowCartDropdown(true);
            }}
            onMouseLeave={() => {
              cartDropdownTimeout.current = setTimeout(
                () => setShowCartDropdown(false),
                200
              );
            }}
          >
            <div
              onClick={() => navigate("/cart")}
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
                <ShoppingCart size={24} color="#555" />
                {wishlistItems.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-8px",
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
                    {wishlistItems.length}
                  </span>
                )}
              </span>
            </div>

            {/* Cart hover dropdown */}
            {showCartDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: "360px",
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  border: "1px solid #f0e8e0",
                  zIndex: 1000,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f0e8e0",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Sản phẩm mới thêm
                </div>
                {wishlistItems.length === 0 ? (
                  <div
                    style={{
                      padding: "30px 16px",
                      textAlign: "center",
                      color: "#999",
                      fontSize: "13px",
                    }}
                  >
                    Chưa có sản phẩm trong giỏ hàng
                  </div>
                ) : (
                  <>
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {wishlistItems.slice(0, 5).map((item) => {
                        const product = item.product;
                        if (!product) return null;
                        const price =
                          product.discountPrice || product.price;
                        return (
                          <div
                            key={product._id}
                            onClick={() => {
                              setShowCartDropdown(false);
                              navigate(`/qua-tet/${product._id}`);
                            }}
                            style={{
                              display: "flex",
                              gap: "12px",
                              padding: "10px 16px",
                              cursor: "pointer",
                              transition: "background 0.15s",
                              borderBottom: "1px solid #f8f4f0",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#FFF8F0")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background =
                                "transparent")
                            }
                          >
                            <img
                              src={product.imageUrl || "/placeholder.png"}
                              alt={product.name}
                              style={{
                                width: "48px",
                                height: "48px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border: "1px solid #eee",
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#333",
                                  fontWeight: "500",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {product.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#999",
                                  marginTop: "2px",
                                }}
                              >
                                x{item.quantity || 1}
                              </div>
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "#C62828",
                                fontWeight: "600",
                                whiteSpace: "nowrap",
                                alignSelf: "center",
                              }}
                            >
                              {formatPrice(price)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div
                      style={{
                        padding: "12px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #f0e8e0",
                        background: "#FFFAF5",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "#888" }}>
                        {wishlistItems.length > 5
                          ? `${wishlistItems.length - 5} sản phẩm khác`
                          : `${wishlistItems.length} sản phẩm`}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCartDropdown(false);
                          navigate("/cart");
                        }}
                        style={{
                          background:
                            "linear-gradient(135deg, #C62828 0%, #FF6B35 100%)",
                          color: "#fff",
                          border: "none",
                          padding: "8px 20px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.03)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        Xem giỏ hàng
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav
        style={{
          background:
            "linear-gradient(to right, #FFF5E6 0%, #FFE5D4 50%, #FFF5E6 100%)",
          borderBottom: "2px solid #F9A825",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(198,40,40,0.1)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "18px",
          }}
        >
          🏮
        </div>
        <div
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "18px",
          }}
        >
          🏮
        </div>

        <ul
          style={{
            display: "flex",
            listStyle: "none",
            margin: 0,
            padding: 0,
            gap: "4px",
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
                  gap: "6px",
                  padding: "16px 22px",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#C62828",
                  textDecoration: "none",
                  transition: "all 0.3s",
                  borderRadius: "8px",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 100%)";
                  e.currentTarget.style.color = "#DC143C";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(198,40,40,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#C62828";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
