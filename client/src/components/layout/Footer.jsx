export default function Footer() {
  return (
    <footer
      style={{ background: "#fdf0e8", fontFamily: "'Segoe UI', sans-serif" }}
    >
      {/* Logo + Zalo row */}
      <div
        style={{
          padding: "32px 60px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}
        >
          <span
            style={{
              fontSize: "10px",
              color: "#c0392b",
              fontStyle: "italic",
              letterSpacing: "2px",
            }}
          >
            tet
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#c0392b",
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.5px",
            }}
          >
            health<span style={{ color: "#e67e22" }}>gift</span>
          </span>
        </div>
        <button
          style={{
            background: "transparent",
            border: "2px solid #1e90ff",
            color: "#1e90ff",
            padding: "12px 24px",
            borderRadius: "30px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: "260px",
            justifyContent: "space-between",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                background: "#00c6ff",
                color: "#fff",
                borderRadius: "50%",
                width: "22px",
                height: "22px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Z
            </span>
            Liên hệ trực tiếp qua Zalo
          </span>
          <span>›</span>
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "#e8d8c8", margin: "0 60px" }} />

      {/* Main footer content */}
      <div
        style={{
          padding: "32px 60px",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1.5fr",
          gap: "40px",
        }}
      >
        {/* Column 1: Company info */}
        <div>
          <p
            style={{
              fontSize: "14px",
              color: "#444",
              lineHeight: "1.7",
              marginTop: 0,
            }}
          >
            TetHealthGift – Đơn Vị Chuyên Cung Cấp Quà Tặng Tết Chuyên Nghiệp
            thuộc{" "}
            <strong>CÔNG TY TNHH VƯỜN HẠT (TetHealthGift GARDEN Ltd)</strong>
          </p>
          <ul
            style={{
              listStyle: "disc",
              paddingLeft: "20px",
              fontSize: "14px",
              color: "#444",
              lineHeight: "2",
            }}
          >
            <li>Hotline: 0901.862.795</li>
            <li>Email: tethealthgiftvn@gmail.com</li>
            <li>Website: https://tethealthgift.net/</li>
            <li>Địa chỉ: 163/11 Vườn Lài, Phường An Phú Đông, Quận 12</li>
          </ul>
          <p style={{ fontSize: "13px", color: "#666" }}>
            Số ĐKKD:{" "}
            <span style={{ color: "#e67e22", fontWeight: "600" }}>
              0315784541
            </span>{" "}
            do sở kế hoạch và đầu tư TPHCM Cấp ngày 16/07/2019
          </p>
          {/* Social icons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            {["🇫", "🐦", "📌", "💼", "✈️"].map((icon, i) => (
              <div
                key={i}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: [
                    "#1877f2",
                    "#1da1f2",
                    "#e60023",
                    "#0077b5",
                    "#229ed9",
                  ][i],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {["f", "t", "p", "in", "➤"][i]}
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Links */}
        <div>
          <h4
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#333",
              marginBottom: "16px",
              marginTop: 0,
              letterSpacing: "0.5px",
            }}
          >
            SẢN PHẨM NỔI BẬT
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 24px",
              fontSize: "14px",
              color: "#555",
              lineHeight: "2.2",
            }}
          >
            <li>
              <a href="#" style={{ color: "#555", textDecoration: "none" }}>
                Hộp Quà Tết
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "#555", textDecoration: "none" }}>
                Quà Tết Doanh Nghiệp
              </a>
            </li>
          </ul>
          <h4
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#333",
              marginBottom: "16px",
              marginTop: 0,
              letterSpacing: "0.5px",
            }}
          >
            CHÍNH SÁCH
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "14px",
              color: "#555",
              lineHeight: "2.2",
            }}
          >
            <li>
              <a href="#" style={{ color: "#555", textDecoration: "none" }}>
                Chính Sách Bảo Mật
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "#555", textDecoration: "none" }}>
                Hướng Dẫn Mua Hàng
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "#555", textDecoration: "none" }}>
                Chính Sách Đổi Trả
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "#555", textDecoration: "none" }}>
                Chính Sách Bảo Hành
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Fanpage */}
        <div>
          <h4
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#333",
              marginBottom: "16px",
              marginTop: 0,
              letterSpacing: "0.5px",
            }}
          >
            FANPAGE
          </h4>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              background: "#fff",
              maxWidth: "260px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                borderBottom: "1px solid #eee",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  background: "#f0e8e0",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#c0392b",
                }}
              >
                tg
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "14px" }}>
                  TetHealthGift
                </div>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  Theo dõi Trang · 4.6K người th...
                </div>
              </div>
            </div>
            <div
              style={{
                height: "100px",
                background: "#d4a88a",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, #c4956a 0%, #8B4513 100%)",
                  opacity: 0.6,
                }}
              />
            </div>
          </div>
          {/* Bộ Công Thương */}
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#003d7a",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "10px",
                textAlign: "center",
              }}
            >
              BCT
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#555",
                fontWeight: "700",
                lineHeight: "1.4",
              }}
            >
              ĐÃ THÔNG BÁO
              <br />
              BỘ CÔNG THƯƠNG
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
