// FILE: src/components/PLP/SearchBar.jsx
// Tìm kiếm có debounce, gợi ý từ data thật (props), không dùng mockdata

import { useState, useEffect, useRef, useCallback } from "react";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchBar({ value, onChange, products = [] }) {
  const [localValue, setLocalValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedValue = useDebounce(localValue, 300);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  // Sync nếu value từ ngoài thay đổi (vd: reset filter)
  useEffect(() => {
    if (value !== localValue) setLocalValue(value);
  }, [value]);

  // Gợi ý từ products đã fetch
  const suggestions =
    localValue.length > 1
      ? products
          .filter((p) =>
            p.name?.toLowerCase().includes(localValue.toLowerCase()),
          )
          .slice(0, 5)
      : [];

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

  // Lấy ảnh từ imageUrl array
  const getImage = (p) =>
    Array.isArray(p.imageUrl) ? p.imageUrl[0] : p.imageUrl;

  return (
    <div ref={wrapRef} style={{ position: "relative", maxWidth: 560 }}>
      <div
        style={{
          display: "flex",
          border: `2px solid ${showSuggestions ? "#c0392b" : "#e0c0bc"}`,
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
          placeholder="Tìm kiếm sản phẩm..."
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

      {/* Dropdown gợi ý */}
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
              key={p._id || p.id}
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
              {getImage(p) ? (
                <img
                  src={getImage(p)}
                  alt={p.name}
                  style={{
                    width: 36,
                    height: 36,
                    objectFit: "cover",
                    borderRadius: 6,
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "#f0e0d8",
                    borderRadius: 6,
                    flexShrink: 0,
                  }}
                />
              )}
              <div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#2C1810" }}
                >
                  {p.name}
                </div>
                <div
                  style={{ fontSize: 11, color: "#c0392b", fontWeight: 700 }}
                >
                  {typeof p.price === "number"
                    ? p.price.toLocaleString("vi-VN") + " đ"
                    : p.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
