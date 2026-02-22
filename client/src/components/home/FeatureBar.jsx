const features = [
  { icon: "🚚", title: "Dịch vụ giao quà", sub: "tận tay khách hàng" },
  { icon: "💰", title: "Chiết khấu", sub: "khi mua số lượng lớn" },
  { icon: "✏️", title: "In logo, khắc tên", sub: "theo yêu cầu" },
];

export default function FeatureBar() {
  return (
    <div
      style={{
        background: "#fdf0e8",
        padding: "0 60px 40px",
        display: "flex",
        gap: "20px",
        justifyContent: "center",
      }}
    >
      {features.map((f) => (
        <div
          key={f.title}
          style={{
            flex: 1,
            maxWidth: "380px",
            background: "#c0392b",
            borderRadius: "10px",
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#fff",
            position: "relative",
          }}
        >
          {/* Triangle decoration at top */}
          <div
            style={{
              position: "absolute",
              top: "-10px",
              left: "28px",
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderBottom: "10px solid #c0392b",
            }}
          />
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              flexShrink: 0,
            }}
          >
            {f.icon}
          </div>
          <div>
            <div
              style={{ fontWeight: "700", fontSize: "15px", lineHeight: "1.3" }}
            >
              {f.title}
            </div>
            <div style={{ fontSize: "14px", opacity: 0.9, lineHeight: "1.3" }}>
              {f.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
