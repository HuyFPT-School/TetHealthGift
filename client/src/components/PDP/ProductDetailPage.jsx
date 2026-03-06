import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById, formatPrice } from "../../services/productService";
import ReviewSection from "./ReviewSection";
import { useAuth } from "../../context/AuthContext";
import { addToWishlist } from "../../api/addWishList";

// Ảnh fallback dùng khi URL không load được (tránh external placeholder service)
const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f5e8e4'/%3E%3Ctext x='200' y='190' text-anchor='middle' font-size='64' fill='%23d4a89a'%3E%F0%9F%8E%81%3C/text%3E%3Ctext x='200' y='240' text-anchor='middle' font-size='18' fill='%23c0a09a'%3EKh%C3%B4ng c%C3%B3 %E1%BA%A3nh%3C/text%3E%3C/svg%3E";

// Lọc URL placeholder không hợp lệ từ seed data
const sanitizeImage = (url) => {
  if (!url || typeof url !== "string") return null;
  if (url.includes("via.placeholder.com") || url.includes("placeholder.com"))
    return null;
  return url;
};
function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            fontSize: size,
            color: i <= Math.round(rating || 0) ? "#D4AF37" : "#ddd",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function QuantitySelector({ value, onChange, max }) {
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
        onClick={() => onChange(Math.min(max || 99, value + 1))}
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
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState("mo-ta");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(id);
        // BE có thể trả về { product: {...} } hoặc thẳng object
        setProduct(data.product || data);
        setActiveImage(0);
        setQuantity(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error(err);
        setError("Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  // Loading state
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          color: "#c0392b",
          fontSize: 16,
        }}
      >
        ⏳ Đang tải sản phẩm...
      </div>
    );

  // Error / not found
  if (error || !product)
    return (
      <div style={{ textAlign: "center", padding: "80px 40px", color: "#aaa" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
          {error || "Không tìm thấy sản phẩm"}
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
          }}
        >
          ← Quay lại danh sách
        </button>
      </div>
    );

  // Dữ liệu thật từ BE
  const images = (
    Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl]
  )
    .map(sanitizeImage)
    .filter(Boolean);
  const inStock = product.quantity > 0;
  const discount =
    product.discountPrice && product.discountPrice < product.price
      ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
      : 0;

  const avgRating = product.comments?.length
    ? (
      product.comments.reduce((s, c) => s + c.rating, 0) /
      product.comments.length
    ).toFixed(1)
    : 0;

  const tags = Array.isArray(product.tags) ? product.tags : [];

  const handleAddToCart = async () => {
    if (!token) {
      alert("Vui lòng đăng nhập trước");
      navigate("/login");
      return;
    }

    if (!inStock) {
      alert("Sản phẩm đã hết hàng");
      return;
    }

    try {
      await addToWishlist(product._id, quantity);

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);

    } catch (error) {
      alert(error.message);
    }
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
          </span>
          {" › "}
          <span
            style={{ cursor: "pointer", color: "#c0392b" }}
            onClick={() => navigate("/qua-tet")}
          >
            Quà Tết
          </span>
          {" › "}
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
                background: "#f8f0ec",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxShadow: "0 12px 40px rgba(192,57,43,0.15)",
                position: "relative",
              }}
            >
              {images[activeImage] ? (
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_IMG;
                  }}
                />
              ) : (
                <span style={{ color: "#ccc", fontSize: 14 }}>
                  Không có ảnh
                </span>
              )}
              {discount > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    background: "#e74c3c",
                    color: "#fff",
                    padding: "5px 14px",
                    borderRadius: 20,
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 14,
                  flexWrap: "wrap",
                }}
              >
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 10,
                      overflow: "hidden",
                      border: `2.5px solid ${activeImage === i ? "#c0392b" : "transparent"}`,
                      cursor: "pointer",
                      opacity: activeImage === i ? 1 : 0.55,
                      transition: "all .2s",
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMG;
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#2C1810",
                marginBottom: 10,
                lineHeight: 1.3,
              }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <StarRating rating={parseFloat(avgRating)} size={16} />
                <span style={{ fontSize: 14, color: "#888" }}>
                  {avgRating} ({product.comments?.length} đánh giá)
                </span>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginBottom: 16,
                }}
              >
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      background: "#fdf0ed",
                      color: "#c0392b",
                      border: "1px solid #f0d0ca",
                      borderRadius: 20,
                      padding: "3px 12px",
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price */}
            <div
              style={{
                marginBottom: 24,
                padding: 16,
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #f0e0d8",
              }}
            >
              {product.discountPrice &&
                product.discountPrice < product.price && (
                  <div
                    style={{
                      fontSize: 14,
                      color: "#aaa",
                      textDecoration: "line-through",
                      marginBottom: 4,
                    }}
                  >
                    {formatPrice(product.discountPrice)}
                  </div>
                )}
              <div style={{ fontSize: 28, fontWeight: 800, color: "#c0392b" }}>
                {formatPrice(product.price)}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: inStock ? "#27ae60" : "#e74c3c",
                  fontWeight: 600,
                  marginTop: 6,
                }}
              >
                {inStock
                  ? `✓ Còn hàng (${product.quantity} sản phẩm)`
                  : "✗ Hết hàng"}
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={product.quantity}
              />
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                style={{
                  flex: 1,
                  padding: "13px 20px",
                  background: added ? "#27ae60" : inStock ? "#c0392b" : "#ddd",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "inherit",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: inStock ? "pointer" : "not-allowed",
                  transition: "all .25s",
                  boxShadow: inStock
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
              {["🚚 Giao tận nơi", "🔒 Chính hãng", "↩️ Đổi trả 7 ngày"].map(
                (b) => (
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
                ),
              )}
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
              {
                id: "danh-gia",
                label: `⭐ Đánh giá (${product.comments?.length || 0})`,
              },
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
              <p style={{ marginBottom: 16 }}>
                {product.description || "Chưa có mô tả."}
              </p>
              {product.content && (
                <div
                  dangerouslySetInnerHTML={{ __html: product.content }}
                  style={{ marginTop: 16 }}
                />
              )}
            </div>
          ) : (
            <ReviewSection product={product} token={token} />
          )}
        </div>
      </div>
    </div>
  );
}
