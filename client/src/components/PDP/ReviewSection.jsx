// ============================================================
// FILE: src/components/PDP/ReviewSection.jsx
// Hệ thống đánh giá sản phẩm
// ============================================================

import { useState } from "react";

const SAMPLE_REVIEWS = [
  {
    id: 1,
    name: "Nguyễn Thị Lan",
    avatar: "👩",
    rating: 5,
    date: "15/01/2026",
    variant: "Set Quà 2 – Cao Cấp",
    content:
      "Hộp quà rất đẹp và sang trọng, đóng gói chắc chắn. Người nhận rất thích. Sẽ đặt thêm cho mùa Tết năm nay!",
    verified: true,
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    avatar: "👨",
    rating: 5,
    date: "12/01/2026",
    variant: "Set Quà 1 – Cơ Bản",
    content:
      "Sản phẩm chất lượng, đúng mô tả. Giao hàng nhanh trong 2 ngày. Hương vị thơm, đóng gói đẹp. Sẽ ủng hộ tiếp!",
    verified: true,
  },
  {
    id: 3,
    name: "Phạm Thị Hoa",
    avatar: "👩",
    rating: 4,
    date: "08/01/2026",
    variant: "Set Quà 2 – Cao Cấp",
    content:
      "Hộp quà đẹp, chất lượng ổn. Trừ 1 sao vì giao hơi chậm, nhưng tổng thể hài lòng. Mùi hương rất dễ chịu.",
    verified: false,
  },
  {
    id: 4,
    name: "Lê Quang Đức",
    avatar: "👨",
    rating: 5,
    date: "03/01/2026",
    variant: "Set Quà 1 – Cơ Bản",
    content:
      "Mua làm quà biếu sếp, được khen ngay! Hộp gỗ khắc tên rất tinh tế và chuyên nghiệp. Giá hợp lý.",
    verified: true,
  },
];

function StarRating({ rating, interactive = false, onRate = null }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => interactive && onRate && onRate(i)}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          style={{
            fontSize: interactive ? 24 : 14,
            color:
              i <= (interactive ? hovered || rating : rating)
                ? "#D4AF37"
                : "#ddd",
            cursor: interactive ? "pointer" : "default",
            transition: "color .15s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function RatingBar({ star, count, total }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 12, color: "#888", width: 40, flexShrink: 0 }}>
        {star} sao
      </span>
      <div
        style={{
          flex: 1,
          height: 8,
          background: "#f0e0d8",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "#D4AF37",
            borderRadius: 4,
            transition: "width 1s ease",
          }}
        />
      </div>
      <span
        style={{ fontSize: 12, color: "#aaa", width: 30, textAlign: "right" }}
      >
        {count}
      </span>
    </div>
  );
}

export default function ReviewSection({ product }) {
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [newName, setNewName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const ratingDist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));
  const total = reviews.length;

  const handleSubmit = () => {
    if (!newRating || !newComment.trim() || !newName.trim()) return;
    setReviews([
      {
        id: Date.now(),
        name: newName,
        avatar: "😊",
        rating: newRating,
        date: new Date().toLocaleDateString("vi-VN"),
        variant: "Người dùng mới",
        content: newComment,
        verified: false,
      },
      ...reviews,
    ]);
    setNewRating(0);
    setNewComment("");
    setNewName("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Summary */}
      <div
        style={{
          display: "flex",
          gap: 40,
          alignItems: "center",
          background: "#fff",
          borderRadius: 14,
          padding: 24,
          border: "1px solid #f0e0d8",
          marginBottom: 28,
        }}
      >
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#c0392b",
              lineHeight: 1,
            }}
          >
            {product.rating}
          </div>
          <StarRating rating={product.rating} />
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>
            {total} đánh giá
          </div>
        </div>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}
        >
          {ratingDist.map((r) => (
            <RatingBar
              key={r.star}
              star={r.star}
              count={r.count}
              total={total}
            />
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {reviews.map((r) => (
          <div
            key={r.id}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              border: "1px solid #f0e0d8",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  background: "#fdf0ed",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {r.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{ fontWeight: 700, fontSize: 14, color: "#2C1810" }}
                  >
                    {r.name}
                  </span>
                  {r.verified && (
                    <span
                      style={{
                        fontSize: 10,
                        background: "#e8f5e9",
                        color: "#27ae60",
                        padding: "2px 8px",
                        borderRadius: 20,
                        fontWeight: 600,
                      }}
                    >
                      ✓ Đã mua
                    </span>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 2,
                  }}
                >
                  <StarRating rating={r.rating} />
                  <span style={{ fontSize: 11, color: "#bbb" }}>{r.date}</span>
                  <span style={{ fontSize: 11, color: "#aaa" }}>
                    • {r.variant}
                  </span>
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#555",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {r.content}
            </p>
          </div>
        ))}
      </div>

      {/* Write a review */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 24,
          border: "1px solid #f0e0d8",
        }}
      >
        <h4 style={{ color: "#2C1810", marginBottom: 18, fontSize: 15 }}>
          ✍️ Viết đánh giá của bạn
        </h4>
        {submitted ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px 0",
              color: "#27ae60",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            ✓ Cảm ơn bạn đã đánh giá!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
                Chọn số sao:
              </p>
              <StarRating
                rating={newRating}
                interactive
                onRate={setNewRating}
              />
            </div>
            <input
              placeholder="Họ và tên của bạn"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                padding: "11px 14px",
                border: "1.5px solid #e0c0bc",
                borderRadius: 8,
                fontFamily: "inherit",
                fontSize: 13,
                outline: "none",
              }}
            />
            <textarea
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              style={{
                padding: "11px 14px",
                border: "1.5px solid #e0c0bc",
                borderRadius: 8,
                fontFamily: "inherit",
                fontSize: 13,
                resize: "vertical",
                outline: "none",
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={!newRating || !newComment.trim() || !newName.trim()}
              style={{
                padding: "12px 28px",
                alignSelf: "flex-start",
                background:
                  !newRating || !newComment.trim() || !newName.trim()
                    ? "#eee"
                    : "#c0392b",
                color:
                  !newRating || !newComment.trim() || !newName.trim()
                    ? "#aaa"
                    : "#fff",
                border: "none",
                borderRadius: 8,
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              Gửi đánh giá
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
