import { useState, useEffect } from "react";
import { fetchProducts, calcDiscount } from "../../services/productService";
import ProductCard from "../../components/PLP/ProductCard";
import { Tag, Percent, TrendingDown } from "lucide-react";

export default function PromotionsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("discount"); // discount, price, newest

  useEffect(() => {
    loadPromotionProducts();
  }, []);

  const loadPromotionProducts = async () => {
    setLoading(true);
    try {
      const { products: allProducts } = await fetchProducts({ limit: 100 });

      // Lọc chỉ lấy sản phẩm có discountPrice
      const promotionProducts = allProducts.filter(
        (p) => p.discountPrice && p.discountPrice < p.price,
      );

      setProducts(promotionProducts);
    } catch (error) {
      console.error("Error loading promotion products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sắp xếp sản phẩm
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "discount") {
      const discountA = calcDiscount(a.price, a.discountPrice);
      const discountB = calcDiscount(b.price, b.discountPrice);
      return discountB - discountA; // Giảm giá cao nhất trước
    } else if (sortBy === "price") {
      return a.discountPrice - b.discountPrice; // Giá thấp đến cao
    } else if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 50,
              height: 50,
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #C62828",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#666", fontSize: 14 }}>Đang tải ưu đãi...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #FFF8F0 0%, #FFFFFF 100%)",
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      {/* Hero Banner */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #C62828 0%, #DC143C 50%, #FF6B35 100%)",
          color: "#fff",
          padding: "48px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.2)",
              padding: "8px 16px",
              borderRadius: 20,
              marginBottom: 16,
              backdropFilter: "blur(10px)",
            }}
          >
            <Percent size={20} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              ƯU ĐÃI ĐẶC BIỆT
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 800,
              margin: "0 0 12px",
              textShadow: "0 2px 20px rgba(0,0,0,0.2)",
            }}
          >
            Săn Sale Quà Tết
          </h1>
          <p
            style={{
              fontSize: "clamp(14px, 2vw, 18px)",
              opacity: 0.95,
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Khám phá các sản phẩm quà Tết đang giảm giá sâu - Tiết kiệm đến 50%!
          </p>
        </div>
      </div>

      <div
        style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 40px 80px" }}
      >
        {/* Thống kê & Sắp xếp */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Tag size={20} color="#C62828" />
            <span style={{ fontSize: 16, fontWeight: 600, color: "#2C1810" }}>
              {sortedProducts.length} sản phẩm đang giảm giá
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#666" }}>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "2px solid #F9A825",
                background: "#fff",
                fontSize: 14,
                fontWeight: 600,
                color: "#2C1810",
                cursor: "pointer",
                outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#C62828")}
              onBlur={(e) => (e.target.style.borderColor = "#F9A825")}
            >
              <option value="discount">Giảm giá nhiều nhất</option>
              <option value="price">Giá thấp đến cao</option>
              <option value="newest">Mới nhất</option>
            </select>
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <TrendingDown size={64} color="#ddd" style={{ marginBottom: 16 }} />
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#444",
                margin: "0 0 8px",
              }}
            >
              Chưa có sản phẩm giảm giá
            </h3>
            <p style={{ fontSize: 14, color: "#888" }}>
              Vui lòng quay lại sau để khám phá các ưu đãi mới nhất
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {sortedProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
