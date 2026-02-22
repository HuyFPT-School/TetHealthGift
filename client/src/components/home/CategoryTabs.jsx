import { useState } from "react";

export default function CategoryTabs() {
  const [active, setActive] = useState("Quà Tết");
  const tabs = ["Quà Tết", "Quà Tết Giá Rẻ", "Quà 8/3"];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        padding: "24px 0",
        background: "#fdf0e8",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          style={{
            padding: "10px 30px",
            borderRadius: "30px",
            border: "2px solid #c0392b",
            background: active === tab ? "#e67e22" : "transparent",
            color: active === tab ? "#fff" : "#c0392b",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
