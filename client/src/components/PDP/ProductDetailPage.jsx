// FILE: src/components/PDP/ProductDetailPage.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PRODUCTS, formatPrice } from "../../services/productService";
import ReviewSection from "./ReviewSection";

function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            fontSize: size,
            color: i <= Math.round(rating) ? "#D4AF37" : "#ddd",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function QuantitySelector({ value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "1.5px solid #e0c0bc",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        style={{
          width: 38,
          height: 38,
          border: "none",
          background: "#fdf0ed",
          cursor: "pointer",
          fontSize: 18,
          color: "#c0392b",
          fontWeight: 700,
        }}
      >
        −
      </button>
      <span
        style={{
          width: 48,
          textAlign: "center",
          fontSize: 15,
          fontWeight: 700,
          color: "#2C1810",
        }}
      >
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        style={{
          width: 38,
          height: 38,
          border: "none",
          background: "#fdf0ed",
          cursor: "pointer",
          fontSize: 18,
          color: "#c0392b",
          fontWeight: 700,
        }}
      >
        +
      </button>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.slug === slug);

  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState("mo-ta");

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
      setActiveImage(0);
      setAdded(false);
      setTab("mo-ta");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [slug]);

  // Không tìm thấy sản phẩm
  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "80px 40px", color: "#aaa" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
          Không tìm thấy sản phẩm
        </p>
        <button
          onClick={() => navigate("/qua-tet")}
          style={{
            background: "#c0392b",
            color: "#fff",
            border: "none",
            padding: "12px 28px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          ← Quay lại danh sách
        </button>
      </div>
    );
  }

  const discount = Math.round(
    ((product.originalPrice - selectedVariant.price) / product.originalPrice) *
      100,
  );

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ background: "#FFF8F0", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div
        style={{
          background: "#fff",
          padding: "12px 40px",
          borderBottom: "1px solid #f0e0d8",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            fontSize: 13,
            color: "#888",
          }}
        >
          <span
            style={{ cursor: "pointer", color: "#c0392b" }}
            onClick={() => navigate("/")}
          >
            Trang chủ
          </span>{" "}
          &rsaquo;{" "}
          <span
            style={{ cursor: "pointer", color: "#c0392b" }}
            onClick={() => navigate("/qua-tet")}
          >
            Quà Tết
          </span>{" "}
          &rsaquo;{" "}
          <span style={{ color: "#2C1810", fontWeight: 600 }}>
            {product.name}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "flex-start",
          }}
        >
          {/* Gallery */}
          <div>
            <div
              style={{
                height: 400,
                borderRadius: 18,
                background: product.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 12px 40px rgba(192,57,43,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "8rem",
                  filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.25))",
                  userSelect: "none",
                }}
              >
                {product.images[activeImage]}
              </div>
              {product.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    background: product.badgeColor,
                    color: "#fff",
                    padding: "5px 14px",
                    borderRadius: 20,
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {product.badge}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 10,
                    background: product.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                    cursor: "pointer",
                    transition: "all .2s",
                    border: `2.5px solid ${activeImage === i ? "#c0392b" : "transparent"}`,
                    opacity: activeImage === i ? 1 : 0.55,
                  }}
                >
                  {img}
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: "#2C1810",
                marginBottom: 12,
                lineHeight: 1.35,
              }}
            >
              {product.name}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 18,
                flexWrap: "wrap",
              }}
            >
              <StarRating rating={product.rating} size={16} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#D4AF37" }}>
                {product.rating}
              </span>
              <span style={{ fontSize: 13, color: "#aaa" }}>
                ({product.reviewCount} đánh giá)
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: product.inStock ? "#27ae60" : "#e74c3c",
                }}
              >
                {product.inStock ? "● Còn hàng" : "● Hết hàng"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 30, fontWeight: 800, color: "#c0392b" }}>
                {formatPrice(selectedVariant.price)}
              </span>
              {product.originalPrice > selectedVariant.price && (
                <>
                  <span
                    style={{
                      fontSize: 16,
                      color: "#bbb",
                      textDecoration: "line-through",
                    }}
                  >
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span
                    style={{
                      background: "#fde8e5",
                      color: "#c0392b",
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    Tiết kiệm {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Variants */}
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#2C1810",
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              🎁 Chọn Set Quà
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 22,
              }}
            >
              {product.variants.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  style={{
                    border: `2px solid ${selectedVariant.id === v.id ? "#c0392b" : "#e8d5d0"}`,
                    borderRadius: 12,
                    padding: "14px 16px",
                    cursor: "pointer",
                    background:
                      selectedVariant.id === v.id ? "#fdf0ed" : "#fff",
                    transition: "all .2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color:
                          selectedVariant.id === v.id ? "#c0392b" : "#2C1810",
                      }}
                    >
                      {selectedVariant.id === v.id ? "✓ " : ""}
                      {v.label}
                    </span>
                    <span
                      style={{
                        fontWeight: 800,
                        color: "#c0392b",
                        fontSize: 14,
                      }}
                    >
                      {formatPrice(v.price)}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {v.items.map((item, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 11,
                          background:
                            selectedVariant.id === v.id ? "#fff" : "#fdf8f5",
                          color: "#666",
                          border: "1px solid #eee",
                          borderRadius: 4,
                          padding: "2px 8px",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Qty + Add */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={{
                  flex: 1,
                  padding: "13px 20px",
                  background: added
                    ? "#27ae60"
                    : product.inStock
                      ? "#c0392b"
                      : "#ddd",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "inherit",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: product.inStock ? "pointer" : "not-allowed",
                  transition: "all .25s",
                  boxShadow: product.inStock
                    ? "0 4px 16px rgba(192,57,43,0.3)"
                    : "none",
                }}
              >
                {added ? "✓ Đã thêm vào giỏ!" : "🛒 Thêm vào giỏ hàng"}
              </button>
            </div>

            <button
              style={{
                width: "100%",
                padding: "12px",
                background: "transparent",
                border: "2px solid #c0392b",
                color: "#c0392b",
                borderRadius: 10,
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                transition: "all .2s",
                marginBottom: 14,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#c0392b";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#c0392b";
              }}
            >
              💬 Tư vấn miễn phí qua Zalo
            </button>

            <div
              style={{
                display: "flex",
                gap: 12,
                padding: 14,
                background: "#fdf8f5",
                borderRadius: 10,
                border: "1px solid #f0e0d8",
              }}
            >
              {[
                "🚚 Giao tận nơi",
                "🔒 Bảo đảm chính hãng",
                "↩️ Đổi trả 7 ngày",
              ].map((b) => (
                <span
                  key={b}
                  style={{
                    fontSize: 11,
                    color: "#666",
                    fontWeight: 600,
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: 48 }}>
          <div
            style={{
              display: "flex",
              borderBottom: "2px solid #f0e0d8",
              marginBottom: 28,
            }}
          >
            {[
              { id: "mo-ta", label: "📋 Mô tả sản phẩm" },
              { id: "danh-gia", label: `⭐ Đánh giá (${product.reviewCount})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  background: "none",
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 700,
                  color: tab === t.id ? "#c0392b" : "#888",
                  borderBottom: `3px solid ${tab === t.id ? "#c0392b" : "transparent"}`,
                  cursor: "pointer",
                  transition: "all .2s",
                  marginBottom: -2,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "mo-ta" ? (
            <div
              style={{
                maxWidth: 720,
                lineHeight: 1.8,
                color: "#444",
                fontSize: 14,
              }}
            >
              <p style={{ marginBottom: 16 }}>{product.description}</p>
              <h4 style={{ color: "#2C1810", marginBottom: 10 }}>
                Thành phần chính:
              </h4>
              <ul
                style={{
                  paddingLeft: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {selectedVariant.items.map((item, i) => (
                  <li key={i} style={{ color: "#555" }}>
                    {item}
                  </li>
                ))}
              </ul>
              <div
                style={{
                  marginTop: 24,
                  padding: 20,
                  background: "#fff8f5",
                  borderRadius: 12,
                  border: "1px solid #f0d8d0",
                }}
              >
                <h4 style={{ color: "#c0392b", marginBottom: 10 }}>
                  🌿 Công dụng sức khỏe:
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {product.benefits.map((b) => (
                    <span
                      key={b}
                      style={{
                        background: "#c0392b",
                        color: "#fff",
                        borderRadius: 20,
                        padding: "5px 14px",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {b.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <ReviewSection product={product} />
          )}
        </div>
      </div>
    </div>
  );
}
