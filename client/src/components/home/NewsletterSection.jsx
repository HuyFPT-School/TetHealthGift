export default function NewsletterSection() {
  const categories = [
    {
      title: "HỘP QUÀ TẾT CAO CẤP",
      desc: "Mẫu mã sang trọng, sản phẩm chất lượng, đa dạng lựa chọn, giao hàng cực nhanh.",
      image:
        "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80",
    },
    {
      title: "GIỎ QUÀ TẾT CAO CẤP",
      desc: "Giỏ quà tết cao cấp đa dạng mẫu mã, chất lượng cao cấp, gói riêng theo yêu cầu.",
      image:
        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
    },
    {
      title: "QUÀ TẾT DOANH NGHIỆP",
      desc: "Đa dạng mẫu mã, in logo doanh nghiệp theo yêu cầu. Chiết khấu cao. Giao hàng nhanh.",
      image:
        "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&q=80",
    },
    {
      title: "QUÀ TẾT NHÂN VIÊN",
      desc: "Quà Tết cho nhân viên không thể thiếu vào các dịp Lễ, Tết, Khen Thưởng.",
      image:
        "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80",
    },
  ];

  return (
    <div
      style={{
        background: "#f7ede2",
        padding: "60px 40px",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        .nl-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          min-height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .nl-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.25);
        }
        .nl-card img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .nl-card:hover img {
          transform: scale(1.05);
        }
        .nl-card-overlay {
          position: relative;
          z-index: 2;
          background: linear-gradient(to top, rgba(100,10,10,0.85) 0%, rgba(100,10,10,0.3) 60%, transparent 100%);
          padding: 24px 20px 20px;
          color: #fff;
        }
        .nl-card-title {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .nl-card-desc {
          font-size: 12px;
          line-height: 1.6;
          color: rgba(255,255,255,0.88);
        }

        .nl-input {
          width: 100%;
          padding: 14px 18px;
          border: 1.5px solid #d4a97a;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          background: rgba(255,255,255,0.15);
          color: #fff;
          box-sizing: border-box;
          transition: border-color 0.2s, background 0.2s;
        }
        .nl-input::placeholder { color: rgba(255,255,255,0.65); }
        .nl-input:focus {
          border-color: #ffd700;
          background: rgba(255,255,255,0.22);
        }

        .nl-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #e8b97a, #d4824a);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          margin-top: 4px;
        }
        .nl-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }
      `}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px 1fr",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          alignItems: "stretch",
        }}
      >
        {/* Left column - 2 cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {categories.slice(0, 2).map((cat, i) => (
            <div key={i} className="nl-card">
              <img src={cat.image} alt={cat.title} />
              <div className="nl-card-overlay">
                <div className="nl-card-title">{cat.title}</div>
                <div className="nl-card-desc">{cat.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Center - Newsletter form */}
        <div
          style={{
            background: "linear-gradient(160deg, #8b1a1a 0%, #5a0d0d 100%)",
            borderRadius: "16px",
            padding: "48px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            color: "#fff",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(100,10,10,0.35)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.06,
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
            <p
              style={{
                fontSize: "13px",
                letterSpacing: "3px",
                color: "#f5c98a",
                textTransform: "uppercase",
                marginBottom: "12px",
                fontWeight: 600,
              }}
            >
              Đăng ký nhận bản tin
            </p>

            <h2
              style={{
                fontSize: "26px",
                fontWeight: 900,
                lineHeight: 1.3,
                margin: "0 0 16px",
                textTransform: "uppercase",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              TetHealthGift
              <br />
              <span style={{ color: "#f5c98a" }}>Thương hiệu quà tặng</span>
              <br />
              lễ, tết, sự kiện uy tín
            </h2>

            <div
              style={{
                width: "40px",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, #f5c98a, transparent)",
                margin: "0 auto 20px",
              }}
            />

            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.7,
                marginBottom: "28px",
              }}
            >
              Nhập thông tin của bạn để nhận những bản tin,
              <br />
              khuyến mãi từ chúng tôi
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <input className="nl-input" placeholder="Nhập tên của bạn" />
              <input
                className="nl-input"
                placeholder="Nhập email của bạn"
                type="email"
              />
              <button className="nl-btn">ĐĂNG KÝ NGAY</button>
            </div>

            <p
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.45)",
                marginTop: "16px",
              }}
            >
              🔒 Chúng tôi cam kết bảo mật thông tin của bạn
            </p>
          </div>
        </div>

        {/* Right column - 2 cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {categories.slice(2, 4).map((cat, i) => (
            <div key={i} className="nl-card">
              <img src={cat.image} alt={cat.title} />
              <div className="nl-card-overlay">
                <div className="nl-card-title">{cat.title}</div>
                <div className="nl-card-desc">{cat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
