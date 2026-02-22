// ============================================================
// FILE: src/components/PLP/SearchBar.jsx
// Thanh tìm kiếm có debounce + suggestions tối ưu tốc độ
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { PRODUCTS } from "../../services/productService";

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedValue = useDebounce(localValue, 280); // 280ms debounce
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  // Propagate debounced value up
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  // Suggestions = product names matching input (memoized via filter)
  const suggestions =
    localValue.length > 1
      ? PRODUCTS.filter((p) =>
          p.name.toLowerCase().includes(localValue.toLowerCase()),
        ).slice(0, 5)
      : [];

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback(
    (name) => {
      setLocalValue(name);
      setShowSuggestions(false);
      onChange(name);
    },
    [onChange],
  );

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", maxWidth: 560 }}>
      <div
        style={{
          display: "flex",
          border: "2px solid",
          borderColor: showSuggestions ? "#c0392b" : "#e0c0bc",
          borderRadius: 10,
          overflow: "visible",
          background: "#fff",
          transition: "border-color .2s",
          boxShadow: showSuggestions ? "0 0 0 3px rgba(192,57,43,0.1)" : "none",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
            fontSize: 18,
            color: "#c0392b",
          }}
        >
          🔍
        </span>
        <input
          ref={inputRef}
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Tìm kiếm sản phẩm, thảo dược, công dụng..."
          style={{
            flex: 1,
            padding: "11px 10px",
            border: "none",
            outline: "none",
            fontSize: 14,
            fontFamily: "inherit",
            background: "transparent",
            color: "#333",
          }}
        />
        {localValue && (
          <button
            onClick={handleClear}
            style={{
              border: "none",
              background: "none",
              padding: "0 14px",
              cursor: "pointer",
              color: "#aaa",
              fontSize: 18,
            }}
          >
            ×
          </button>
        )}
        <button
          style={{
            background: "#c0392b",
            color: "#fff",
            border: "none",
            padding: "0 20px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            borderRadius: "0 8px 8px 0",
          }}
        >
          Tìm
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1.5px solid #f0d0ca",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {suggestions.map((p) => (
            <div
              key={p.id}
              onClick={() => handleSelect(p.name)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 16px",
                cursor: "pointer",
                transition: "background .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fdf0ed")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              <span style={{ fontSize: 24 }}>{p.images[0]}</span>
              <div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#2C1810" }}
                >
                  {p.name}
                </div>
                <div
                  style={{ fontSize: 11, color: "#c0392b", fontWeight: 700 }}
                >
                  {(p.price / 1000).toFixed(0)}k đ
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
