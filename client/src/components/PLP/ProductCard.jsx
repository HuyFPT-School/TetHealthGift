// ============================================================
// FILE: src/components/PLP/ProductCard.jsx
// Card sản phẩm có lazy loading + tối ưu hiệu năng
// ============================================================

import { useState, useRef, useEffect } from "react";
import { formatPrice } from "../../services/productService";

// Custom hook: Intersection Observer để lazy render
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
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            fontSize: 11,
            color: i <= Math.round(rating) ? "#D4AF37" : "#ddd",
          }}
        >
          ★
        </span>
      ))}
      <span style={{ fontSize: 11, color: "#888", marginLeft: 4 }}>
        {rating}
      </span>
    </div>
  );
}

export default function ProductCard({ product, index, onClick }) {
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  return (
    <div
      ref={ref}
      onClick={onClick}
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
        transitionDelay: `${index * 0.05}s`,
        position: "relative",
      }}
    >
      {/* Badge */}
      {product.badge && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 2,
            background: product.badgeColor,
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 20,
            letterSpacing: "0.5px",
          }}
        >
          {product.badge}
        </div>
      )}

      {/* Discount badge */}
      {discount > 0 && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 2,
            background: "#fff",
            color: "#c0392b",
            fontSize: 11,
            fontWeight: 800,
            padding: "3px 8px",
            borderRadius: 20,
            border: "1.5px solid #c0392b",
          }}
        >
          -{discount}%
        </div>
      )}

      {/* Out of stock overlay */}
      {!product.inStock && (
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

      {/* Image area - lazy loaded */}
      <div
        style={{
          height: 190,
          background: product.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          transition: "height .3s",
        }}
      >
        {inView && (
          <>
            <div
              style={{
                fontSize: hovered ? "5.5rem" : "4.5rem",
                transition: "font-size .3s",
                filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
                userSelect: "none",
              }}
            >
              {product.images[0]}
            </div>
            {hovered && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center",
                  gap: 12,
                  padding: "10px 0 14px",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.3))",
                }}
              >
                {product.images.slice(1).map((img, i) => (
                  <span key={i} style={{ fontSize: "1.6rem", opacity: 0.85 }}>
                    {img}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 16px" }}>
        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#2C1810",
            marginBottom: 6,
            lineHeight: 1.4,
            height: 38,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </h3>

        <StarRating rating={product.rating} />
        <span
          style={{
            fontSize: 11,
            color: "#aaa",
            marginTop: 2,
            display: "block",
          }}
        >
          {product.reviewCount} đánh giá
        </span>

        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 800, color: "#c0392b" }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span
              style={{
                fontSize: 12,
                color: "#aaa",
                textDecoration: "line-through",
              }}
            >
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Variants quick preview */}
        <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
          {product.variants.map((v) => (
            <span
              key={v.id}
              style={{
                fontSize: 10,
                background: "#fdf0ed",
                color: "#c0392b",
                border: "1px solid #f0d0ca",
                borderRadius: 4,
                padding: "3px 8px",
                fontWeight: 600,
              }}
            >
              {v.label.split("–")[0].trim()}
            </span>
          ))}
        </div>

        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "9px",
            background: added
              ? "#27ae60"
              : product.inStock
                ? hovered
                  ? "#c0392b"
                  : "transparent"
                : "#eee",
            border: `1.5px solid ${added ? "#27ae60" : product.inStock ? "#c0392b" : "#ddd"}`,
            color: added
              ? "#fff"
              : product.inStock
                ? hovered
                  ? "#fff"
                  : "#c0392b"
                : "#aaa",
            borderRadius: 8,
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: 12,
            cursor: product.inStock ? "pointer" : "not-allowed",
            transition: "all .25s",
            letterSpacing: "0.3px",
          }}
        >
          {added
            ? "✓ Đã thêm!"
            : product.inStock
              ? "🛒 Thêm vào giỏ"
              : "Hết hàng"}
        </button>
      </div>
    </div>
  );
}
