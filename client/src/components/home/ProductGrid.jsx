import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProductGrid() {
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

        // BE có thể trả về response.data hoặc response.data.products
        const raw = response.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw.products)
            ? raw.products
            : Array.isArray(raw.data)
              ? raw.data
              : [];

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
              <span style={{ color: "#999" }}>
                ({products.length} sản phẩm)
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span>Hiển thị:</span>
                {[8, 12, 18, 24].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPerPage(n)}
                    style={{
                      background: perPage === n ? "#c0392b" : "transparent",
                      color: perPage === n ? "#fff" : "#555",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "3px 8px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: perPage === n ? "700" : "400",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  fontSize: "13px",
                  color: "#555",
                }}
              >
                <option value="default">Sắp xếp mặc định</option>
                <option value="asc">Giá tăng dần</option>
                <option value="desc">Giá giảm dần</option>
              </select>
            </div>
          </div>

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
