// FILE: src/components/PLP/ProductListingPage.jsx

import { useState, useMemo, useCallback, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import {
  PRODUCTS,
  FILTER_OPTIONS,
  filterProducts,
  sortProducts,
} from "../../services/productService";
import ProductCard from "./ProductCard";
import FilterSidebar from "./FilterSidebar";
import SearchBar from "./SearchBar";

const SORT_OPTIONS = [
  { value: "default", label: "Mặc định" },
  { value: "popular", label: "Bán chạy nhất" },
  { value: "rating", label: "Đánh giá cao" },
  { value: "price-asc", label: "Giá thấp → cao" },
  { value: "price-desc", label: "Giá cao → thấp" },
];

export default function ProductListingPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: "all",
    herbs: [],
    benefits: [],
    priceRange: "all",
    search: "",
  });
  const [sortBy, setSortBy] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = useCallback((key, value) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    });
  }, []);

  const handleSearchChange = useCallback((val) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, search: val }));
    });
  }, []);

  const results = useMemo(
    () => sortProducts(filterProducts(PRODUCTS, filters), sortBy),
    [filters, sortBy],
  );

  const activeFilterCount = [
    filters.category !== "all" ? 1 : 0,
    filters.herbs.length,
    filters.benefits.length,
    filters.priceRange !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div style={{ background: "#FFF8F0", minHeight: "100vh" }}>
      {/* Page header */}
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
            style={{
              color: "#fff",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              margin: 0,
            }}
          >
            🎁 Hộp Quà Tết 2026 — Thảo Dược Cao Cấp
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 14,
              marginTop: 6,
            }}
          >
            {results.length} sản phẩm phù hợp
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
          <SearchBar value={filters.search} onChange={handleSearchChange} />
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
        {sidebarOpen && (
          <FilterSidebar
            filters={filters}
            options={FILTER_OPTIONS}
            onChange={handleFilterChange}
            onReset={() =>
              setFilters({
                category: "all",
                herbs: [],
                benefits: [],
                priceRange: "all",
                search: "",
              })
            }
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
              ☰ Bộ lọc{" "}
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
              {filters.herbs.map((h) => (
                <FilterTag
                  key={h}
                  label={FILTER_OPTIONS.herbs.find((x) => x.value === h)?.label}
                  onRemove={() =>
                    handleFilterChange(
                      "herbs",
                      filters.herbs.filter((x) => x !== h),
                    )
                  }
                />
              ))}
              {filters.benefits.map((b) => (
                <FilterTag
                  key={b}
                  label={
                    FILTER_OPTIONS.benefits.find((x) => x.value === b)?.label
                  }
                  onRemove={() =>
                    handleFilterChange(
                      "benefits",
                      filters.benefits.filter((x) => x !== b),
                    )
                  }
                />
              ))}
            </div>

            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 13, color: "#888" }}>Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "8px 14px",
                  border: "1.5px solid #e0c0bc",
                  borderRadius: 8,
                  fontSize: 13,
                  fontFamily: "inherit",
                  background: "#fff",
                  color: "#333",
                  cursor: "pointer",
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product grid */}
          {isPending ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: 20,
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <p style={{ fontSize: 16, fontWeight: 600 }}>
                Không tìm thấy sản phẩm phù hợp
              </p>
              <p style={{ fontSize: 13, marginTop: 8 }}>
                Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: 20,
              }}
            >
              {results.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  onClick={() => navigate(`/qua-tet/${product.slug}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
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
