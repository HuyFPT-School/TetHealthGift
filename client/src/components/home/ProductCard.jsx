export default function ProductCard({ product }) {
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;

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

  return (
    <div
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
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
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
          style={{
            width: "100%",
            padding: "12px",
            background: "linear-gradient(135deg, #e67e22, #c0392b)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "opacity 0.2s",
            marginTop: "auto",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <span>🛍</span> MUA HÀNG
        </button>
      </div>
    </div>
  );
}
