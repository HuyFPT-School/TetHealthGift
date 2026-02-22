export default function ProductCard({ product }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "pointer",
        textAlign: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
          display: "block",
        }}
      />
      <div style={{ padding: "14px 12px 16px" }}>
        <h3
          style={{
            fontSize: "14px",
            color: "#e67e22",
            marginBottom: "8px",
            lineHeight: "1.4",
            minHeight: "40px",
            fontWeight: "500",
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: "15px",
            fontWeight: "700",
            color: "#c0392b",
            margin: 0,
          }}
        >
          {product.price}
        </p>
      </div>
    </div>
  );
}
