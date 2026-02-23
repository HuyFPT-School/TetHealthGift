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
            background: "transparent",
            border: "2px solid #1e90ff",
            color: "#1e90ff",
            padding: "14px 20px",
            borderRadius: "30px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              background: "#00c6ff",
              color: "#fff",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="data:image/png;base64,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"
              alt="Zalo"
              className="w-32"
            />
          </span>
          Liên hệ trực tiếp qua Zalo
        </button>

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
