import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProductGrid() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [perPage, setPerPage] = useState(8);
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch nhiều hơn để sort/filter FE hoạt động đúng
        const response = await axios.get(`${API_BASE}/api/products`, {
          params: { limit: 100 },
        });

        // Backend trả về { data: { products: [...], total: ... } }
        const raw = response.data;
        const list = raw.data?.products || [];

        setProducts(list);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải danh sách sản phẩm");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sorted = [...products].sort((a, b) => {
    const parse = (v) =>
      typeof v === "number" ? v : parseInt(String(v).replace(/\D/g, "")) || 0;
    if (sort === "asc") return parse(a.price) - parse(b.price);
    if (sort === "desc") return parse(b.price) - parse(a.price);
    return 0;
  });

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

      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#999",
            fontSize: "15px",
          }}
        >
          ⏳ Đang tải sản phẩm...
        </div>
      )}

      {error && (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            background: "#fee",
            color: "#c0392b",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
            }}
          >
            {sorted.slice(0, perPage).map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>

          {/* Nút Xem thêm */}
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <button
              onClick={() => navigate("/qua-tet")}
              style={{
                background: "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "14px 36px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(192,57,43,0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(192,57,43,0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(192,57,43,0.3)";
              }}
            >
              Xem thêm sản phẩm →
            </button>
          </div>
        </>
      )}

      {!loading && !error && products.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>
          Không có sản phẩm nào
        </div>
      )}
    </div>
  );
}
