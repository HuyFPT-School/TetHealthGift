import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Hộp quà Tết Doanh Nghiệp Mã Vương 10",
    price: "486.000 đ",
    image:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80",
  },
  {
    id: 2,
    name: "Hộp quà Tết Doanh Nghiệp Mã Vương 11",
    price: "570.000 đ",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80",
  },
  {
    id: 3,
    name: "Hộp quà Tết Doanh Nghiệp Mã Vương 2",
    price: "669.000 đ",
    image:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&q=80",
  },
  {
    id: 4,
    name: "Hộp quà Tết Doanh Nghiệp Mã Vương 3",
    price: "715.000 đ",
    image:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80",
  },
  {
    id: 5,
    name: "Hộp quà Tết Doanh Nghiệp Mã Vương 4",
    price: "771.000 đ",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80",
  },
  {
    id: 6,
    name: "Hộp quà Tết Doanh Nghiệp Mã Vương 5",
    price: "645.000 đ",
    image:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&q=80",
  },
  {
    id: 7,
    name: "Hộp quà Tết Doanh Nghiệp Mã Vương 6",
    price: "821.000 đ",
    image:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80",
  },
  {
    id: 8,
    name: "Hộp Tết Mã Vương 5",
    price: "645.000 đ",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80",
  },
  {
    id: 9,
    name: "Hộp Tết Mã Vương 7",
    price: "504.000 đ",
    image:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&q=80",
  },
  {
    id: 10,
    name: "Hộp quà Tết Mã Vương 1",
    price: "626.000 đ",
    image:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80",
  },
  {
    id: 11,
    name: "Hộp quà Tết Mã Vương 5",
    price: "645.000 đ",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80",
  },
  {
    id: 12,
    name: "Hộp quà Tết Mã Vương 7",
    price: "504.000 đ",
    image:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&q=80",
  },
];

export default function ProductGrid() {
  return (
    <div style={{ background: "#fff", padding: "32px 60px 40px" }}>
      <h2
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "28px",
          marginTop: 0,
          color: "#c0392b",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        Bộ Sưu Tập Hộp Quà Tết 2026
      </h2>

      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          fontSize: "13px",
          color: "#555",
          borderTop: "1px solid #f0f0f0",
          borderBottom: "1px solid #f0f0f0",
          padding: "12px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>☰</span>
          <span style={{ fontWeight: "600" }}>Bộ lọc</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span>
            Hiển thị : <strong>9</strong>
            <span style={{ color: "#999", margin: "0 4px" }}>/</span>12
            <span style={{ color: "#999", margin: "0 4px" }}>/</span>18
            <span style={{ color: "#999", margin: "0 4px" }}>/</span>24
          </span>
          <select
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "6px 12px",
              fontSize: "13px",
              color: "#555",
            }}
          >
            <option>Sắp xếp mặc định</option>
            <option>Giá tăng dần</option>
            <option>Giá giảm dần</option>
          </select>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "36px" }}>
        <button
          style={{
            background: "#c0392b",
            color: "#fff",
            border: "none",
            padding: "12px 40px",
            borderRadius: "30px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Xem thêm sản phẩm
        </button>
      </div>
    </div>
  );
}
