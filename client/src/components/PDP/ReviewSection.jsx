// ============================================================
// FILE: src/components/PDP/ReviewSection.jsx
// Hệ thống đánh giá sản phẩm — dùng data thật từ BE
// ============================================================

import { useState } from "react";
import { addComment } from "../../services/productService";

// Format comment từ BE: { rating, content, author, _id, createdAt }
function formatComment(c, index) {
  const avatars = ["👩", "👨", "🧑", "👴", "👵"];
  return {
    id: c._id || index,
    name: c.author?.name || c.author?.username || `Khách hàng ${index + 1}`,
    avatar: avatars[index % avatars.length],
    rating: c.rating,
    date: c.createdAt
      ? new Date(c.createdAt).toLocaleDateString("vi-VN")
      : new Date().toLocaleDateString("vi-VN"),
    content: c.content,
    verified: true,
  };
}

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

export default function ReviewSection({ product, token }) {
  // Khởi tạo từ comments thật của product
  const initialReviews = Array.isArray(product.comments)
    ? product.comments.map(formatComment)
    : [];

  const [reviews, setReviews] = useState(initialReviews);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [newName, setNewName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Tính rating trung bình từ reviews thật
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));
  const total = reviews.length;

  const handleSubmit = async () => {
    if (!newRating || !newComment.trim()) return;
    if (!token && !newName.trim()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      if (token && product._id) {
        // Gọi API thật khi đã đăng nhập
        const result = await addComment(
          product._id,
          { rating: newRating, content: newComment },
          token,
        );
        // BE trả về comment mới hoặc object product cập nhật
        const newC =
          result?.comment ||
          result?.data?.comments?.[result?.data?.comments?.length - 1];

        setReviews((prev) => [
          newC
            ? formatComment(newC, 0)
            : {
                id: Date.now(),
                name: "Bạn",
                avatar: "😊",
                rating: newRating,
                date: new Date().toLocaleDateString("vi-VN"),
                content: newComment,
                verified: true,
              },
          ...prev,
        ]);
      } else {
        // Chưa đăng nhập → thêm local
        setReviews((prev) => [
          {
            id: Date.now(),
            name: newName,
            avatar: "😊",
            rating: newRating,
            date: new Date().toLocaleDateString("vi-VN"),
            content: newComment,
            verified: false,
          },
          ...prev,
        ]);
      }

      setNewRating(0);
      setNewComment("");
      setNewName("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Lỗi gửi đánh giá:", err);
      const msg =
        err?.response?.status === 401
          ? "Bạn cần đăng nhập để gửi đánh giá."
          : err?.response?.data?.message || "Gửi thất bại. Vui lòng thử lại.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    !submitting &&
    newRating > 0 &&
    newComment.trim() &&
    (token || newName.trim());

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
            {avgRating > 0 ? avgRating : "–"}
          </div>
          <StarRating rating={parseFloat(avgRating)} />
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

      {/* Danh sách đánh giá */}
      {reviews.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "32px 0",
            color: "#bbb",
            fontSize: 14,
            marginBottom: 28,
          }}
        >
          Chưa có đánh giá nào. Hãy là người đầu tiên! 🌟
        </div>
      ) : (
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
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#2C1810",
                      }}
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
                    <span style={{ fontSize: 11, color: "#bbb" }}>
                      {r.date}
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
      )}

      {/* Form gửi đánh giá */}
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

            {/* Chỉ hiện ô tên nếu chưa đăng nhập */}
            {!token && (
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
            )}

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

            {submitError && (
              <div
                style={{
                  fontSize: 13,
                  color: "#c0392b",
                  background: "#fef0ee",
                  border: "1px solid #f0d0ca",
                  borderRadius: 8,
                  padding: "10px 14px",
                }}
              >
                ⚠️ {submitError}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                padding: "12px 28px",
                alignSelf: "flex-start",
                background: canSubmit ? "#c0392b" : "#eee",
                color: canSubmit ? "#fff" : "#aaa",
                border: "none",
                borderRadius: 8,
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 13,
                cursor: canSubmit ? "pointer" : "not-allowed",
                transition: "all .2s",
              }}
            >
              {submitting ? "⏳ Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
