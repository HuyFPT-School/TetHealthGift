import { useState } from "react";

export default function AboutSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        padding: "40px 60px",
        borderTop: "1px solid #f0f0f0",
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#c0392b",
          marginBottom: "16px",
          marginTop: 0,
        }}
      >
        Tặng Quà Tết có ý nghĩa gì?
      </h2>

      <p
        style={{
          fontSize: "14px",
          color: "#444",
          lineHeight: "1.8",
          marginBottom: "16px",
        }}
      >
        Ý nghĩa của món <strong>quà Tết</strong> không chỉ là lưu giữ nét văn
        hóa truyền thống đẹp đẽ mà còn thể hiện tình cảm gắn bó giữa người thân,
        đồng nghiệp. Mỗi món quà tặng tết vào dịp đầu năm mới sẽ thể hiện lên
        những ý nghĩa sâu sắc mà người tặng muốn gửi gắm cho người nhận. Cụ thể:
      </p>

      <ul
        style={{
          fontSize: "14px",
          color: "#444",
          lineHeight: "2",
          paddingLeft: "20px",
          marginBottom: "16px",
        }}
      >
        <li>
          <strong>Cầu chúc thành công và may mắn:</strong> Những món quà tặng
          tết giúp gửi gắm những lời chúc tốt đẹp nhất khép lại một năm tràn đầy
          may mắn và thành công cho bạn bè, đồng nghiệp.
        </li>
        <li>
          <strong>Thể hiện lòng biết ơn:</strong> Dành tặng những món quà ý
          nghĩa nhất cho những người đã giúp đỡ mình trong năm vừa qua.
        </li>
        <li>
          <strong>Tôn vinh truyền thống văn hóa:</strong> Quà tết là cách để giữ
          gìn và phát huy những giá trị truyền thống tốt đẹp của dân tộc, tạo
          nên sự kết nối giữa các thế hệ.
        </li>
        {expanded && (
          <li>
            <strong>Kết nối tình thân:</strong> Quà tết là cầu nối gắn kết những
            mối quan hệ quý giá trong cuộc sống, thể hiện sự quan tâm và trân
            trọng lẫn nhau, giúp tăng cường tình cảm gia đình và bạn bè, đồng
            nghiệp.Món quà Tết không chỉ mang giá trị vật chất mà còn chứa đựng
            tình cảm chân thành, giúp lan tỏa sự ấm áp và niềm vui đến gia đình,
            bạn bè và đối tác.
          </li>
        )}
      </ul>

      <div
        style={{
          textAlign: "center",
          borderTop: "1px solid #eee",
          paddingTop: "16px",
        }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#555",
            fontSize: "13px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            margin: "0 auto",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              color: "#999",
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "transform 0.3s",
            }}
          >
            ⌄
          </span>
          <span>{expanded ? "Thu gọn" : "Đọc tiếp"}</span>
        </button>
      </div>
    </div>
  );
}
