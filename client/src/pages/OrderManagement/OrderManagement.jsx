import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import {
  Spinner,
  Toast,
  Modal,
  StatusBadge,
  ORDER_STATUS,
  vnd,
  fmtDate,
} from "../../components/CM/Components";
import "./OrderManagement.css";

const LIMIT = 10;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState(null);

  const showT = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (filter) params.set("orderStatus", filter);
      const res = await axiosInstance.get(`/api/orders?${params}`);

      // Backend returns { message, data: { orders, total, page, limit, totalPages } }
      const body = res.data;
      let list = body?.data?.orders || body?.data || body?.orders || [];

      // Ensure list is an array
      if (!Array.isArray(list)) {
        list = list.orders || [];
      }

      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (o) =>
            o._id?.toLowerCase().includes(q) ||
            (o.customer?.fullname || o.customerId?.fullname || "")
              .toLowerCase()
              .includes(q),
        );
      }

      setOrders(list);
      setTotal(body?.data?.total || body?.total || list.length);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, [page, filter, search]);

  useEffect(() => {
    load();
  }, [load]);

    const updateStatus = async (id, orderStatus) => {
    // Prevent shipping if VNPay/MoMo payment not completed or Installment is not fully paid
    if (orderStatus === "shipped") {
      const order = orders.find((o) => o._id === id) || detail;
      if (order) {
        const isOnlinePayment =
          order.paymentMethod === "vnpay" || order.paymentMethod === "momo";
        
        if (order.isInstallment && order.paymentStatus !== "paid") {
          showT(
            `Không thể giao hàng vì khách hàng chỉ mới cọc (hoặc chưa thanh toán). Vui lòng đợi khách thanh toán đủ 100%.`,
            "error",
          );
          return;
        }

        const isNotPaid = order.paymentStatus !== "paid";

        if (isOnlinePayment && !order.isInstallment && isNotPaid) {
          const statusText =
            order.paymentStatus === "failed"
              ? "thanh toán thất bại"
              : "chưa thanh toán";
          showT(
            `Không thể chuyển sang "Đang giao" vì đơn hàng ${statusText}. Vui lòng đợi khách thanh toán thành công.`,
            "error",
          );
          return;
        }
      }
    }

    setSaving(true);
    try {
      await axiosInstance.patch(`/api/orders/${id}/status`, { orderStatus });
      showT(`Đã chuyển: ${ORDER_STATUS[orderStatus]?.label || orderStatus}`);
      load();
      if (detail?._id === id) setDetail((o) => ({ ...o, orderStatus }));
    } catch (e) {
      showT(e.response?.data?.message || e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const cancelOrder = async (id) => {
    if (!confirm("Xác nhận đơn hàng?")) return;
    setSaving(true);
    try {
      await axiosInstance.patch(`/api/orders/${id}/cancel`);
      showT("Đã hủy đơn hàng");
      load();
      if (detail?._id === id)
        setDetail((o) => ({ ...o, orderStatus: "cancelled" }));
    } catch (e) {
      showT(e.response?.data?.message || e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(total / LIMIT));
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="orders-page fade-in">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div className="status-pills">
        <button
          className="pill"
          style={
            filter === ""
              ? { background: "#9B1C1C", color: "#fff", borderColor: "#9B1C1C" }
              : {}
          }
          onClick={() => {
            setFilter("");
            setPage(1);
          }}
        >
          Tất cả ({total})
        </button>
        {Object.entries(ORDER_STATUS).map(([k, v]) => (
          <button
            key={k}
            className="pill"
            style={
              filter === k
                ? { background: v.bg, color: v.color, borderColor: v.color }
                : {}
            }
            onClick={() => {
              setFilter(k);
              setPage(1);
            }}
          >
            {v.label} ({statusCounts[k] || 0})
          </button>
        ))}
      </div>

      <div className="search-wrap" style={{ maxWidth: 380, marginBottom: 16 }}>
        <span className="search-icon"></span>
        <input
          className="inp"
          style={{ paddingLeft: 34 }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Tìm mã đơn, tên khách hàng..."
        />
      </div>

      <div className="card table-card">
        {loading ? (
          <div className="table-loading">
            <Spinner size={32} />
          </div>
        ) : error ? (
          <div className="table-error"> {error}</div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl" style={{ minWidth: 750 }}>
                <thead>
                  <tr>
                    {[
                      "Mã Đơn",
                      "Khách Hàng",
                      "Số sản phẩm",
                      "Tống tiền",
                      "Trạng thái",
                      "Thời Gian",
                      "Thao Tác",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => {
                    const st = ORDER_STATUS[o.orderStatus];
                    const items = o.cartItems || o.items || o.orderItems || [];
                    return (
                      <tr
                        key={o._id}
                        className="row-hover"
                        style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}
                      >
                        <td>
                          <button
                            className="order-id-btn"
                            onClick={() => setDetail(o)}
                          >
                            #{o._id?.slice(-6).toUpperCase()}
                          </button>
                        </td>
                        <td>
                          <div className="customer-name">
                            {o.customer?.fullname ||
                              o.customerId?.fullname ||
                              o.userId?.fullname ||
                              "—"}
                          </div>
                          <div className="customer-phone">
                            {o.phone || o.customer?.phone || ""}
                          </div>
                        </td>
                        <td className="items-count">{items.length} SP</td>
                        <td className="order-total">{vnd(o.totalAmount)}</td>
                        <td>
                          <StatusBadge status={o.orderStatus} />
                        </td>
                        <td className="order-date">{fmtDate(o.createdAt)}</td>
                        <td>
                          <div className="action-btns">
                            <button
                              className="link-btn"
                              onClick={() => setDetail(o)}
                            >
                              Chi tiết
                            </button>
                            {st?.next && (
                              <button
                                className="btn-next"
                                disabled={saving}
                                onClick={() => updateStatus(o._id, st.next)}
                              >
                                {ORDER_STATUS[st.next]?.label}
                              </button>
                            )}
                            {!["delivered", "cancelled", "return_requested", "returned"].includes(
                              o.orderStatus,
                            ) && (
                              <button
                                className="btn-cancel"
                                disabled={saving}
                                onClick={() => cancelOrder(o._id)}
                              >
                                Huỷ
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="empty-row">
                        <div className="empty-icon"></div>
                        Không có đơn hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>
                Trang {page}/{pageCount} - {total} đơn hàng
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn-outline"
                  style={{ padding: "6px 14px" }}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Trước
                </button>
                <button
                  className="btn-outline"
                  style={{ padding: "6px 14px" }}
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {detail && (
        <Modal
          title={`Don hang #${detail._id?.slice(-6).toUpperCase()}`}
          onClose={() => setDetail(null)}
          wide
        >
          <div className="detail-grid">
            {[
              [
                "Khach hang",
                detail.customer?.fullname || detail.customerId?.fullname || "—",
              ],
              ["SĐT", detail.phone || detail.customer?.phone || "—"],
              ["Địa chỉ", detail.shippingAddress || "—"],
              ["Thanh toán", detail.paymentMethod || "—"],
              ["TT Thanh toán", detail.paymentStatus || "—"],
              ["Ngày đặt", fmtDate(detail.createdAt)],
            ].map(([k, v]) => (
              <div key={k} className="detail-item">
                <div className="detail-key">{k}</div>
                <div className="detail-val">{v}</div>
              </div>
            ))}
          </div>

          {(detail.cartItems || detail.items || detail.orderItems || [])
            .length > 0 && (
            <div className="items-section">
              <div className="items-title">Sản phẩm trong đơn</div>
              {(detail.cartItems || detail.items || detail.orderItems).map(
                (item, i) => (
                  <div
                    key={i}
                    className={`item-row${i % 2 === 0 ? " alt" : ""}`}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        flex: 1,
                      }}
                    >
                      {(item.imageUrl ||
                        item.product?.imageUrl ||
                        item.product?.images?.[0]) && (
                        <img
                          src={
                            item.imageUrl ||
                            item.product?.imageUrl ||
                            item.product?.images?.[0]
                          }
                          alt={item.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "8px",
                            objectFit: "cover",
                            border: "1px solid #f0e8e0",
                          }}
                        />
                      )}
                      <span className="item-name">
                        {item.name ||
                          item.product?.name ||
                          item.productId?.name ||
                          `SP ${i + 1}`}
                        {item.quantity && (
                          <span className="item-qty"> x {item.quantity}</span>
                        )}
                      </span>
                    </div>
                    <span className="item-price">
                      {vnd((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                ),
              )}
            </div>
          )}

          <div className="order-total-box">
            <div className="total-label">Tổng giá trị đơn hàng</div>
            <div className="total-value">{vnd(detail.totalAmount)}</div>
          </div>

          <div className="timeline">
            {["processing", "shipped", "delivered", "return_requested", "returned"].map((s, i, arr) => {
              if (
                detail.orderStatus !== "return_requested" &&
                detail.orderStatus !== "returned" &&
                (s === "return_requested" || s === "returned")
              ) {
                return null;
              }

              const steps =
                detail.orderStatus === "return_requested" ||
                detail.orderStatus === "returned"
                  ? ["processing", "shipped", "delivered", "return_requested", "returned"]
                  : ["processing", "shipped", "delivered"];
              
              const currentArr = steps;
              const globalIdx = currentArr.indexOf(s);
              if (globalIdx === -1) return null;

              const curIdx = currentArr.indexOf(detail.orderStatus);
              const done = detail.orderStatus !== "cancelled" && globalIdx <= curIdx;
              const c = ORDER_STATUS[s];

              return (
                <div key={s} className="timeline-step">
                  <div className="timeline-dot-wrap">
                    <div className={`timeline-dot${done ? " done" : ""}`}>
                      {done ? "✓" : globalIdx + 1}
                    </div>
                    <div className={`timeline-label${done ? " done" : ""}`}>
                      {c?.label || s}
                    </div>
                  </div>
                  {globalIdx < currentArr.length - 1 && (
                    <div
                      className={`timeline-line${done && globalIdx < curIdx ? " done" : ""}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="modal-footer">
            {ORDER_STATUS[detail.orderStatus]?.next && (
              <button
                className="btn-primary"
                disabled={saving}
                onClick={() =>
                  updateStatus(
                    detail._id,
                    ORDER_STATUS[detail.orderStatus].next,
                  )
                }
              >
                {saving ? (
                  <Spinner size={14} />
                ) : (
                  `${ORDER_STATUS[ORDER_STATUS[detail.orderStatus].next]?.label}`
                )}
              </button>
            )}
            {!["delivered", "cancelled", "return_requested", "returned"].includes(detail.orderStatus) && (
              <button
                className="btn-icon-red"
                style={{ padding: "9px 18px" }}
                onClick={() => cancelOrder(detail._id)}
                disabled={saving}
              >
                Hủy đơn
              </button>
            )}
            <button className="btn-outline" onClick={() => setDetail(null)}>
              Đóng
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrderManagement;
