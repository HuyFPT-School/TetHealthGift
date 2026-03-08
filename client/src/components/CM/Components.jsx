import "./Components.css";

/* ── Spinner ── */
export const Spinner = ({ size = 20 }) => (
  <span
    className="spinner"
    style={{
      width: size,
      height: size,
      border: `2px solid #eee`,
      borderTopColor: "var(--red)",
    }}
  />
);

/* ── Toast ── */
export const Toast = ({ msg, type = "ok" }) => (
  <div className={`toast ${type}`}>
    {type === "error" ? "❌" : "✅"} {msg}
  </div>
);

/* ── Modal ── */
export const Modal = ({ title, onClose, children, wide }) => (
  <div className="overlay" onClick={onClose}>
    <div
      className="modal-box"
      style={{ maxWidth: wide ? 620 : 520 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h3>{title}</h3>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

/* ── Stock Badge ── */
export const StockBadge = ({ n }) => {
  const color = n === 0 ? "#991B1B" : n <= 10 ? "#C05621" : "#166534";
  const bg = n === 0 ? "#FEE2E2" : n <= 10 ? "#FEF3C7" : "#DCFCE7";
  return (
    <span
      style={{
        background: bg,
        color,
        fontWeight: 700,
        fontSize: 13,
        padding: "3px 10px",
        borderRadius: 99,
        display: "inline-block",
        minWidth: 36,
        textAlign: "center",
      }}
    >
      {n}
    </span>
  );
};

/* ── Order Status Badge ── */
export const ORDER_STATUS = {
  processing: {
    label: "Chờ xác nhận",
    color: "#92400E",
    bg: "#FEF3C7",
    next: "shipped",
  },
  shipped: { label: "Đang giao", color: "#1E40AF", bg: "#DBEAFE", next: null }, // Only customer can confirm delivered
  delivered: {
    label: "Hoàn thành",
    color: "#065F46",
    bg: "#D1FAE5",
    next: null,
  },
  cancelled: { label: "Đã huỷ", color: "#991B1B", bg: "#FEE2E2", next: null },
};

export const StatusBadge = ({ status }) => {
  const c = ORDER_STATUS[status] || {
    label: status,
    color: "#555",
    bg: "#F5F5F5",
  };
  return (
    <span className="badge" style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
};

/* ── Helpers ── */
export const vnd = (n) => (n || 0).toLocaleString("vi-VN") + " ₫";
export const fmtDate = (s) => (s ? new Date(s).toLocaleString("vi-VN") : "—");
