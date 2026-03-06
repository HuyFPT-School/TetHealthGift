import { VscCallIncoming } from "react-icons/vsc";

export default function ContactBanner() {
  return (
    <div
      style={{
        background: "#fdf0e8",
        padding: "60px",
        display: "flex",
        gap: "40px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {/* Left: phone form */}
      <div
        style={{
          flex: 1,
          minWidth: "300px",
          maxWidth: "480px",
          background: "#fff",
          borderRadius: "16px",
          padding: "36px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#c0392b",
            marginBottom: "6px",
            marginTop: 0,
          }}
        >
          Để lại số điện thoại để
        </h3>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#c0392b",
            marginBottom: "28px",
            marginTop: 0,
          }}
        >
          nhận cuộc gọi tư vấn quà tặng miễn phí
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              style={{
                fontSize: "13px",
                color: "#666",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Họ và tên
            </label>
            <input
              placeholder="Nhập tên của bạn"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                background: "#f9f9f9",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: "13px",
                color: "#666",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Số điện thoại
            </label>
            <input
              placeholder="Nhập số điện thoại"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                background: "#f9f9f9",
              }}
            />
          </div>
          <button
            style={{
              background: "#6B3A2A",
              color: "#fff",
              border: "none",
              padding: "14px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: "pointer",
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <VscCallIncoming /> GỌI CHO TÔI
          </button>
        </div>
      </div>

      {/* Right: NUT Corner brand + CTA */}
      <div
        style={{
          flex: 1,
          minWidth: "280px",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "20px",
          padding: "10px 0",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: 1,
          }}
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
              fontSize: "24px",
              fontWeight: "bold",
              color: "#c0392b",
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.5px",
            }}
          >
            health<span style={{ color: "#e67e22" }}>gift</span>
          </span>
        </div>

        <p
          style={{
            fontSize: "14px",
            color: "#555",
            lineHeight: "1.7",
            margin: 0,
          }}
        >
          TetHealthGift là đơn vị chuyên cung cấp quà tặng cá nhân hoá và doanh
          nghiệp toàn diện và chuyên nghiệp đặc biệt là quà tết doanh nghiệp,
          quà dịp lễ và đáp ứng trọn vẹn nhu cầu của khách hàng.
        </p>

        <button
          style={{
            background: "#e67e22",
            color: "#fff",
            border: "none",
            padding: "14px 20px",
            borderRadius: "30px",
            fontWeight: "bold",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
          Chat ngay
        </button>
      </div>
    </div>
  );
}
