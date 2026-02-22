export default function Hero() {
  return (
    <div
      style={{
        background: "#fdf0e8",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60'%3E%3Cpath d='M0 30 Q30 0 60 30 Q90 60 120 30' fill='none' stroke='%23f0c8a0' stroke-width='1.2' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: "120px 60px",
      }}
    >
      {/* Breadcrumb */}
      <div style={{ padding: "14px 60px 0", fontSize: "13px", color: "#999" }}>
        Trang chủ &rsaquo; Quà Tết
      </div>

      {/* Title + Description */}
      <div style={{ padding: "0 60px 36px" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#c0392b",
            marginBottom: "16px",
            marginTop: 0,
            fontFamily: "'Segoe UI', sans-serif",
          }}
        >
          Quà Tết 2026, Combo 50+ Hộp Quà Tết Nguyên Đán cao cấp, sang trọng
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#444",
            lineHeight: "1.8",
            margin: 0,
          }}
        >
          Tặng <strong>quà tết</strong> từ xưa là thông điệp tuyệt vời giúp ta
          bày tỏ lòng tri ân, lời cảm ơn sâu sắc đến những người mà ta yêu
          thương, trân quý. <strong>Quà tặng tết</strong> dường như là văn hóa
          truyền thống không thể bỏ qua trong dịp tết Nguyên Đán. Nếu bạn vẫn
          chưa chọn được cho người thân, bạn bè, đồng nghiệp của mình một{" "}
          <a href="#" style={{ color: "#c0392b", textDecoration: "none" }}>
            hộp quà tết
          </a>
          ,{" "}
          <a href="#" style={{ color: "#c0392b", textDecoration: "none" }}>
            set quà tết
          </a>{" "}
          đẹp và ý nghĩa cho năm 2026 <strong>Bính Ngọ</strong> thì hãy tham
          khảo ngay bộ sưu tập <strong>hộp quà tết 2026</strong>, set quà tết
          cao cấp và mới nhất của Nut Corner nhé.
        </p>
      </div>
    </div>
  );
}
