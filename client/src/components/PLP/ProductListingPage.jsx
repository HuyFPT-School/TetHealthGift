// FILE: src/components/PLP/ProductListingPage.jsx
// Tích hợp API thật — không dùng mockdata

import { useState, useEffect, useCallback, useTransition } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../services/productService";
import ProductCard from "./ProductCard";
import FilterSidebar from "./FilterSidebar";
import SearchBar from "./SearchBar";
import { Search } from "lucide-react";

const SORT_MAP = {
  default: undefined,
  popular: "-soldCount",
  rating: "-rating",
  "price-asc": "price",
  "price-desc": "-price",
};

const PRICE_RANGE_MAP = {
  "under-300": { minPrice: 0, maxPrice: 300000 },
  "300-500": { minPrice: 300000, maxPrice: 500000 },
  "500-800": { minPrice: 500000, maxPrice: 800000 },
  "over-800": { minPrice: 800000, maxPrice: undefined },
};

const FILTER_OPTIONS = {
  categories: [
    { value: "all", label: "Tất cả" },
    { value: "qua-tet", label: "Quà Tết" },
    { value: "qua-doanh-nghiep", label: "Quà Doanh Nghiệp" },
    { value: "qua-suc-khoe", label: "Quà Sức Khỏe" },
  ],
  priceRanges: [
    { value: "all", label: "Tất cả mức giá" },
    { value: "under-300", label: "Dưới 300.000đ" },
    { value: "300-500", label: "300.000đ – 500.000đ" },
    { value: "500-800", label: "500.000đ – 800.000đ" },
    { value: "over-800", label: "Trên 800.000đ" },
  ],
  herbs: [],
  benefits: [],
};

function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 14,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          height: 200,
          background:
            "linear-gradient(90deg,#f0e0d8 25%,#fdf0ea 50%,#f0e0d8 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      <div style={{ padding: 16 }}>
        <div
          style={{
            height: 14,
            background: "#f5e8e4",
            borderRadius: 4,
            marginBottom: 8,
          }}
        />
        <div
          style={{
            height: 12,
            background: "#f5e8e4",
            borderRadius: 4,
            width: "60%",
            marginBottom: 12,
          }}
        />
        <div
          style={{
            height: 20,
            background: "#f5e8e4",
            borderRadius: 4,
            width: "40%",
          }}
        />
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

function FilterTag({ label, onRemove }) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "#fde8e5",
        color: "#c0392b",
        borderRadius: 20,
        padding: "4px 12px",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          color: "#c0392b",
          fontSize: 14,
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </span>
  );
}

export default function ProductListingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sortBy, setSortBy] = useState("default");

  const [filters, setFilters] = useState({
    category: "all",
    herbs: [],
    benefits: [],
    priceRange: "all",
    search: searchParams.get("search") || "",
  });

  // Fetch khi filter/sort thay đổi
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const priceParams = PRICE_RANGE_MAP[filters.priceRange] || {};
        const { products: list, total: t } = await fetchProducts({
          limit: 100,
          category: filters.category !== "all" ? filters.category : undefined,
          search: filters.search || undefined,
          sort: SORT_MAP[sortBy],
          ...priceParams,
        });

        setProducts(list);
        setTotal(t);
      } catch (err) {
        console.error(err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters, sortBy]);

  const handleFilterChange = useCallback((key, value) => {
    startTransition(() => setFilters((prev) => ({ ...prev, [key]: value })));
  }, []);

  const handleSearchChange = useCallback((val) => {
    startTransition(() => setFilters((prev) => ({ ...prev, search: val })));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      category: "all",
      herbs: [],
      benefits: [],
      priceRange: "all",
      search: "",
    });
  }, []);

  const activeFilterCount = [
    filters.category !== "all" ? 1 : 0,
    filters.herbs.length,
    filters.benefits.length,
    filters.priceRange !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const isLoading = loading || isPending;

  return (
    <div style={{ background: "#FFF8F0", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg,#C0392B 0%,#7b241c 100%)",
          padding: "28px 40px",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
              marginBottom: 4,
            }}
          >
            Trang chủ › Quà Tết
          </p>
          <h1
            style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: 0 }}
          >
            Hộp Quà Tết 2026
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 14,
              marginTop: 6,
            }}
          >
            {isLoading ? "Đang tải..." : `${total} sản phẩm`}
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #f0e0d8",
          padding: "14px 40px",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <SearchBar
            value={filters.search}
            onChange={handleSearchChange}
            products={products}
          />
        </div>
      </div>

      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "24px 40px",
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        {/* Sidebar */}
        {sidebarOpen && (
          <FilterSidebar
            filters={filters}
            options={FILTER_OPTIONS}
            onChange={handleFilterChange}
            onReset={resetFilters}
            activeCount={activeFilterCount}
          />
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 16px",
                border: "1.5px solid #e0c0bc",
                borderRadius: 8,
                background: sidebarOpen ? "#c0392b" : "#fff",
                color: sidebarOpen ? "#fff" : "#c0392b",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              ☰ Bộ lọc
              {activeFilterCount > 0 && (
                <span
                  style={{
                    background: "#fff",
                    color: "#c0392b",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Active filter tags */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
              {filters.category !== "all" && (
                <FilterTag
                  label={
                    FILTER_OPTIONS.categories.find(
                      (c) => c.value === filters.category,
                    )?.label
                  }
                  onRemove={() => handleFilterChange("category", "all")}
                />
              )}
              {filters.priceRange !== "all" && (
                <FilterTag
                  label={
                    FILTER_OPTIONS.priceRanges.find(
                      (r) => r.value === filters.priceRange,
                    )?.label
                  }
                  onRemove={() => handleFilterChange("priceRange", "all")}
                />
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                background: "#fee",
                color: "#c0392b",
                borderRadius: 8,
                marginBottom: 20,
              }}
            >
              {error}
              <button
                onClick={() => setFilters((f) => ({ ...f }))}
                style={{
                  marginLeft: 12,
                  background: "#c0392b",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
                gap: 20,
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>
                <Search />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600 }}>
                Không tìm thấy sản phẩm phù hợp
              </p>
              <p style={{ fontSize: 13, marginTop: 8 }}>
                Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
              </p>
              <button
                onClick={resetFilters}
                style={{
                  marginTop: 16,
                  background: "#c0392b",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
                gap: 20,
              }}
            >
              {products.map((product, i) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  index={i}
                  onClick={() => navigate(`/qua-tet/${product._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
