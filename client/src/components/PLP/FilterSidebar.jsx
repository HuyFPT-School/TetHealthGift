// ============================================================
// FILE: src/components/PLP/FilterSidebar.jsx
// Sidebar bộ lọc thông minh
// ============================================================

import { useState } from "react";

function AccordionSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        borderBottom: "1px solid #f0e0d8",
        paddingBottom: open ? 16 : 0,
        marginBottom: 16,
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0 0 12px",
          fontFamily: "inherit",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: "#2C1810",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {title}
        </span>
        <span
          style={{
            color: "#c0392b",
            fontSize: 12,
            transition: "transform .2s",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          ▼
        </span>
      </button>
      {open && children}
    </div>
  );
}

export default function FilterSidebar({
  filters,
  options,
  onChange,
  onReset,
  activeCount,
}) {
  const toggleArray = (key, value) => {
    const arr = filters[key] || [];
    onChange(
      key,
      arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value],
    );
  };

  return (
    <div
      style={{
        width: 240,
        flexShrink: 0,
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #f0e0d8",
        padding: "20px 18px",
        position: "sticky",
        top: 90,
        boxShadow: "0 4px 20px rgba(192,57,43,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h3
          style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#2C1810" }}
        >
          🔽 Bộ lọc
        </h3>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            style={{
              background: "none",
              border: "none",
              color: "#c0392b",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            Xóa tất cả ({activeCount})
          </button>
        )}
      </div>

      {/* Category */}
      <AccordionSection title="Loại sản phẩm">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {options.categories.map((cat) => (
            <label
              key={cat.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <div
                onClick={() => onChange("category", cat.value)}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  border: `2px solid ${filters.category === cat.value ? "#c0392b" : "#ddd"}`,
                  background:
                    filters.category === cat.value ? "#c0392b" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all .2s",
                  cursor: "pointer",
                }}
              >
                {filters.category === cat.value && (
                  <span style={{ color: "#fff", fontSize: 11 }}>✓</span>
                )}
              </div>
              <span style={{ fontSize: 13, color: "#444" }}>{cat.label}</span>
            </label>
          ))}
        </div>
      </AccordionSection>

      {/* Price range */}
      <AccordionSection title="Khoảng giá">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {options.priceRanges.map((range) => (
            <label
              key={range.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <div
                onClick={() => onChange("priceRange", range.value)}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: `2px solid ${filters.priceRange === range.value ? "#c0392b" : "#ddd"}`,
                  background:
                    filters.priceRange === range.value ? "#c0392b" : "#fff",
                  flexShrink: 0,
                  transition: "all .2s",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {filters.priceRange === range.value && (
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#fff",
                    }}
                  />
                )}
              </div>
              <span style={{ fontSize: 12, color: "#444" }}>{range.label}</span>
            </label>
          ))}
        </div>
      </AccordionSection>

      {/* Herbs */}
      <AccordionSection title="Loại thảo dược">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {options.herbs.map((herb) => {
            const active = filters.herbs.includes(herb.value);
            return (
              <label
                key={herb.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <div
                  onClick={() => toggleArray("herbs", herb.value)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: `2px solid ${active ? "#c0392b" : "#ddd"}`,
                    background: active ? "#c0392b" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all .2s",
                    cursor: "pointer",
                  }}
                >
                  {active && (
                    <span style={{ color: "#fff", fontSize: 11 }}>✓</span>
                  )}
                </div>
                <span style={{ fontSize: 13, color: "#444" }}>
                  {herb.label}
                </span>
              </label>
            );
          })}
        </div>
      </AccordionSection>

      {/* Benefits */}
      <AccordionSection title="Công dụng sức khỏe">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {options.benefits.map((benefit) => {
            const active = filters.benefits.includes(benefit.value);
            return (
              <label
                key={benefit.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <div
                  onClick={() => toggleArray("benefits", benefit.value)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: `2px solid ${active ? "#c0392b" : "#ddd"}`,
                    background: active ? "#c0392b" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all .2s",
                    cursor: "pointer",
                  }}
                >
                  {active && (
                    <span style={{ color: "#fff", fontSize: 11 }}>✓</span>
                  )}
                </div>
                <span style={{ fontSize: 12, color: "#444" }}>
                  {benefit.label}
                </span>
              </label>
            );
          })}
        </div>
      </AccordionSection>
    </div>
  );
}
