// FILE: src/components/PLP/ProductCard.jsx
// Dùng data thật từ BE (imageUrl là array, price là number)

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice, calcDiscount } from "../../services/productService";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { addToWishlist } from "../../api/addWishList";

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='200' viewBox='0 0 220 200'%3E%3Crect width='220' height='200' fill='%23f5e8e4'/%3E%3Ctext x='110' y='95' text-anchor='middle' font-size='32' fill='%23d4a89a'%3E%F0%9F%8E%81%3C/text%3E%3Ctext x='110' y='125' text-anchor='middle' font-size='12' fill='%23c0a09a'%3EKh%C3%B4ng c%C3%B3 %E1%BA%A3nh%3C/text%3E%3C/svg%3E";

const sanitizeImage = (url) => {
  if (!url || typeof url !== "string") return null;
  if (url.includes("via.placeholder.com") || url.includes("placeholder.com"))
    return null;
  return url;
};

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function StarRating({ rating }) {
  const r = Math.round(rating || 0);
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{ fontSize: 11, color: i <= r ? "#D4AF37" : "#ddd" }}
        >
          ★
        </span>
      ))}
      {rating > 0 && (
        <span style={{ fontSize: 11, color: "#888", marginLeft: 4 }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default function ProductCard({ product, index = 0 }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  // imageUrl từ BE là array → lấy phần tử đầu, lọc placeholder
  const imageUrl = sanitizeImage(
    Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl,
  );

  // Tính điểm đánh giá trung bình từ comments
  const avgRating = product.comments?.length
    ? product.comments.reduce((s, c) => s + c.rating, 0) /
      product.comments.length
    : 0;

  const discount = calcDiscount(product.price, product.discountPrice);
  const inStock = product.quantity > 0;

  const handleViewDetail = () => {
    navigate(`/qua-tet/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

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
      await addToWishlist(product._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      alert(error.response?.data?.message || "Không thể thêm vào giỏ hàng");
    }
  };

  const tags = Array.isArray(product.tags) ? product.tags : [];

  return (
    <div
      ref={ref}
      onClick={handleViewDetail}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14,
        overflow: "hidden",
        background: "#fff",
        boxShadow: hovered
          ? "0 12px 32px rgba(192,57,43,0.2)"
          : "0 2px 10px rgba(0,0,0,0.07)",
        cursor: "pointer",
        transition: "all .28s cubic-bezier(.4,0,.2,1)",
        transform: inView
          ? hovered
            ? "translateY(-6px)"
            : "translateY(0)"
          : "translateY(24px)",
        opacity: inView ? 1 : 0,
        transitionDelay: `${index * 0.04}s`,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* SALE badge */}
      {discount > 0 && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 2,
            background: "#e74c3c",
            color: "#fff",
            fontSize: 11,
            fontWeight: 800,
            padding: "3px 9px",
            borderRadius: 20,
          }}
        >
          -{discount}%
        </div>
      )}

      {/* Hết hàng overlay */}
      {!inStock && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 14,
          }}
        >
          <span
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              background: "rgba(0,0,0,0.6)",
              padding: "8px 20px",
              borderRadius: 20,
            }}
          >
            Hết hàng
          </span>
        </div>
      )}

      {/* Ảnh sản phẩm */}
      <div
        style={{
          height: 200,
          overflow: "hidden",
          background: "#f8f0ec",
          position: "relative",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform .4s ease",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMG;
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ccc",
              fontSize: 13,
            }}
          >
            Không có ảnh
          </div>
        )}
      </div>

      {/* Nội dung */}
      <div
        style={{
          padding: "14px 14px 16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#2C1810",
            marginBottom: 6,
            lineHeight: 1.4,
            minHeight: 38,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </h3>

        {/* Rating */}
        {avgRating > 0 && (
          <div style={{ marginBottom: 6 }}>
            <StarRating rating={avgRating} />
            <span style={{ fontSize: 11, color: "#aaa" }}>
              {product.comments?.length} đánh giá
            </span>
          </div>
        )}

        {/* Giá */}
        <div style={{ marginTop: "auto", marginBottom: 10 }}>
          {product.discountPrice && product.discountPrice < product.price && (
            <p
              style={{
                fontSize: 12,
                color: "#aaa",
                margin: "0 0 2px",
                textDecoration: "line-through",
              }}
            >
              {formatPrice(product.discountPrice)}
            </p>
          )}
          <p
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: "#c0392b",
              margin: 0,
            }}
          >
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: 10,
                  background: "#fdf0ed",
                  color: "#c0392b",
                  border: "1px solid #f0d0ca",
                  borderRadius: 4,
                  padding: "2px 7px",
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Nút mua */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock || added}
          style={{
            width: "100%",
            padding: "10px",
            background: inStock
              ? hovered
                ? "#c0392b"
                : "transparent"
              : "#eee",
            border: `1.5px solid ${inStock ? "#c0392b" : "#ddd"}`,
            color: inStock ? (hovered ? "#fff" : "#c0392b") : "#aaa",
            borderRadius: 8,
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: 12,
            cursor: inStock ? "pointer" : "not-allowed",
            transition: "all .25s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <ShoppingCart
            size={16}
            color={inStock ? (hovered ? "#fff" : "#c0392b") : "#aaa"}
          />
          <span style={{ lineHeight: 1 }}>
            {!inStock ? "Hết hàng" : added ? "✓ Đã thêm" : "Thêm vào giỏ"}
          </span>
        </button>
      </div>
    </div>
  );
}
