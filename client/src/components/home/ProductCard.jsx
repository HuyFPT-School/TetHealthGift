import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../services/cartService";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  
  const inStock = product.quantity > 0;

  const formatPrice = (price) => {
    if (typeof price === "number") return price.toLocaleString("vi-VN") + " đ";
    return price;
  };

  // imageUrl là array từ BE → lấy phần tử đầu tiên
  const imageUrl = Array.isArray(product.imageUrl)
    ? product.imageUrl[0]
    : product.imageUrl;

  const getTags = () => {
    if (!product.tags || !Array.isArray(product.tags)) return [];
    return product.tags.map((tag) =>
      typeof tag === "string" ? tag : tag.name || String(tag),
    );
  };

  const tags = getTags();

  const handleViewDetail = () => {
    navigate(`/qua-tet/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!inStock) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    try {
      addToCart(product, 1);
      setAdded(true);
      toast.success("Đã thêm vào giỏ hàng thành công!");
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  return (
    <div
      onClick={handleViewDetail}
      style={{
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        setHovered(true);
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image container */}
      <div style={{ position: "relative" }}>
        <img
          src={imageUrl}
          alt={product.name}
          style={{
            width: "100%",
            height: "240px",
            objectFit: "cover",
            display: "block",
            background: "#f0f0f0",
          }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/240?text=No+Image";
          }}
        />
        {hasDiscount && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "#e74c3c",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "800",
              padding: "4px 10px",
              borderRadius: "4px",
              letterSpacing: "0.5px",
            }}
          >
            SALE
          </div>
        )}
      </div>

      {/* Content */}
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
            fontSize: "14px",
            color: "#333",
            marginBottom: "10px",
            lineHeight: "1.5",
            fontWeight: "500",
            flex: 1,
          }}
        >
          {product.name}
        </h3>

        {product.description && (
          <p
            style={{
              fontSize: "12px",
              color: "#888",
              marginBottom: "10px",
              lineHeight: "1.3",
              maxHeight: "36px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.description}
          </p>
        )}

        {/* Price */}
        <div style={{ marginBottom: "14px" }}>
          {hasDiscount && (
            <p
              style={{
                fontSize: "13px",
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
              fontSize: "18px",
              fontWeight: "700",
              color: "#e74c3c",
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
              gap: "4px",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            {tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "11px",
                  background: "#f0f0f0",
                  padding: "3px 6px",
                  borderRadius: "3px",
                  color: "#666",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Buy button */}
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
            marginTop: "auto",
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
