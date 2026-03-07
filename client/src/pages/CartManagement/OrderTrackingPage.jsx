import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../lib/axios";
import { formatPrice } from "../../services/productService";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const STATUS_CONFIG = {
  processing: { label: "Đang xử lý", color: "#FF9800", icon: Clock, step: 1 },
  shipped: { label: "Đang giao hàng", color: "#2196F3", icon: Truck, step: 2 },
  delivered: {
    label: "Đã giao hàng",
    color: "#4CAF50",
    icon: CheckCircle,
    step: 3,
  },
  cancelled: { label: "Đã hủy", color: "#F44336", icon: XCircle, step: 0 },
};

const PAYMENT_STATUS = {
  pending: { label: "Chưa thanh toán", color: "#FF9800" },
  paid: { label: "Đã thanh toán", color: "#4CAF50" },
  failed: { label: "Thanh toán thất bại", color: "#F44336" },
};

const PAYMENT_METHOD = {
  cod: "Thanh toán khi nhận hàng (COD)",
  vnpay: "VNPay",
  momo: "Ví MoMo",
};

function StatusTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 0",
        }}
      >
        <XCircle size={22} style={{ color: "#F44336" }} />
        <span style={{ color: "#F44336", fontWeight: "600", fontSize: "14px" }}>
          Đơn hàng đã bị hủy
        </span>
      </div>
    );
  }

  const steps = [
    { key: "processing", label: "Đang xử lý", icon: Package },
    { key: "shipped", label: "Đang giao", icon: Truck },
    { key: "delivered", label: "Đã giao", icon: CheckCircle },
  ];

  const currentStep = STATUS_CONFIG[status]?.step || 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0",
        padding: "16px 0",
      }}
    >
      {steps.map((s, i) => {
        const isActive = i + 1 <= currentStep;
        const isCurrent = i + 1 === currentStep;
        const Icon = s.icon;
        return (
          <div
            key={s.key}
            style={{ display: "flex", alignItems: "center", flex: 1 }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "70px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isActive
                    ? "linear-gradient(135deg, #C62828 0%, #FF6B35 100%)"
                    : "#e0e0e0",
                  boxShadow: isCurrent
                    ? "0 0 0 4px rgba(198,40,40,0.2)"
                    : "none",
                  transition: "all 0.3s",
                }}
              >
                <Icon size={18} style={{ color: isActive ? "#fff" : "#999" }} />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  marginTop: "6px",
                  fontWeight: isCurrent ? "700" : "500",
                  color: isActive ? "#C62828" : "#999",
                }}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "3px",
                  background:
                    i + 1 < currentStep
                      ? "linear-gradient(90deg, #C62828, #FF6B35)"
                      : "#e0e0e0",
                  borderRadius: "2px",
                  margin: "0 4px",
                  marginBottom: "20px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const statusConf =
    STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.processing;
  const paymentConf =
    PAYMENT_STATUS[order.paymentStatus] || PAYMENT_STATUS.pending;

  // Check if can retry payment (pending payment for vnpay/momo)
  const canRetryPayment =
    order.paymentStatus === "pending" &&
    (order.paymentMethod === "vnpay" || order.paymentMethod === "momo");

  // Check if can cancel order (not shipped yet)
  const canCancel =
    order.orderStatus !== "shipped" &&
    order.orderStatus !== "delivered" &&
    order.orderStatus !== "cancelled";

  const handleRetryPayment = async () => {
    try {
      setLoading(true);
      const endpoint =
        order.paymentMethod === "vnpay"
          ? "/api/payment/vnpay/create"
          : "/api/payment/momo/create";

      const res = await axiosInstance.post(endpoint, {
        orderId: order._id,
        orderInfo: `Thanh toán lại đơn hàng #${order._id}`,
      });

      if (res.data.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = res.data.paymentUrl;
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Không thể tạo thanh toán. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.patch(`/api/orders/${order._id}/cancel`);
      alert("Hủy đơn hàng thành công!");
      onRefresh(); // Refresh the order list
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Không thể hủy đơn hàng. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        border: "1px solid #f0e8e0",
        marginBottom: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          cursor: "pointer",
          borderBottom: expanded ? "1px solid #f0e8e0" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Package size={20} style={{ color: "#C62828" }} />
          <div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#333" }}>
              Đơn hàng - {order.cartItems[0].name}
            </div>
            <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>
              {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
              color: "#fff",
              background: statusConf.color,
            }}
          >
            {statusConf.label}
          </span>
          {expanded ? (
            <ChevronUp size={18} color="#999" />
          ) : (
            <ChevronDown size={18} color="#999" />
          )}
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div style={{ padding: "16px 20px" }}>
          {/* Timeline */}
          <StatusTimeline status={order.orderStatus} />

          {/* Products */}
          <div style={{ marginTop: "12px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#555",
                marginBottom: "10px",
              }}
            >
              Sản phẩm
            </div>
            {order.cartItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px 0",
                  borderBottom:
                    idx < order.cartItems.length - 1
                      ? "1px solid #f5f5f5"
                      : "none",
                }}
              >
                {item.imageUrl ||
                item.product?.images?.[0] ||
                item.product?.imageUrl ? (
                  <img
                    src={
                      item.imageUrl ||
                      item.product?.images?.[0] ||
                      item.product?.imageUrl
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
                ) : (
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "8px",
                      background: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Package size={20} color="#ccc" />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    {item.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#999" }}>
                    x{item.quantity}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#C62828",
                  }}
                >
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Info */}
          <div
            style={{
              marginTop: "16px",
              padding: "14px",
              background: "#fafafa",
              borderRadius: "10px",
              fontSize: "13px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#888" }}>Địa chỉ giao hàng</span>
              <span
                style={{
                  fontWeight: "500",
                  color: "#333",
                  textAlign: "right",
                  maxWidth: "60%",
                }}
              >
                {order.shippingAddress}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#888" }}>Số điện thoại</span>
              <span style={{ fontWeight: "500", color: "#333" }}>
                {order.phone}
              </span>
            </div>
            {order.note && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "#888" }}>Ghi chú</span>
                <span
                  style={{
                    fontWeight: "500",
                    color: "#333",
                    textAlign: "right",
                    maxWidth: "60%",
                  }}
                >
                  {order.note}
                </span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#888" }}>Phương thức thanh toán</span>
              <span style={{ fontWeight: "500", color: "#333" }}>
                {PAYMENT_METHOD[order.paymentMethod] || order.paymentMethod}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#888" }}>Trạng thái thanh toán</span>
              <span style={{ fontWeight: "600", color: paymentConf.color }}>
                {paymentConf.label}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "8px",
                borderTop: "1px solid #eee",
              }}
            >
              <span style={{ fontWeight: "700", color: "#333" }}>
                Tổng cộng
              </span>
              <span
                style={{
                  fontWeight: "700",
                  fontSize: "16px",
                  color: "#C62828",
                }}
              >
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {(canRetryPayment || canCancel) && (
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              {canRetryPayment && (
                <button
                  onClick={handleRetryPayment}
                  disabled={loading}
                  style={{
                    padding: "10px 20px",
                    background:
                      "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {loading ? "Đang xử lý..." : "Thanh toán lại"}
                </button>
              )}
              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={loading}
                  style={{
                    padding: "10px 20px",
                    background: "#fff",
                    color: "#F44336",
                    border: "2px solid #F44336",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Đang hủy..." : "Hủy đơn hàng"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/orders/my-orders");
      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  const filters = [
    { key: "all", label: "Tất cả" },
    { key: "processing", label: "Đang xử lý" },
    { key: "shipped", label: "Đang giao" },
    { key: "delivered", label: "Đã giao" },
    { key: "cancelled", label: "Đã hủy" },
  ];

  return (
    <div
      style={{
        background: "#FFF8F0",
        minHeight: "100vh",
        padding: "30px 40px",
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#C62828",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          <ArrowLeft size={20} />
          Trang chủ
        </button>
      </div>

      <h1
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#C62828",
          marginBottom: "20px",
        }}
      >
        Theo dõi đơn hàng
      </h1>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "8px 18px",
              borderRadius: "20px",
              border: filter === f.key ? "2px solid #C62828" : "1px solid #ddd",
              background: filter === f.key ? "#FFF0ED" : "#fff",
              color: filter === f.key ? "#C62828" : "#666",
              fontWeight: filter === f.key ? "700" : "500",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {f.label}
            {f.key === "all"
              ? ` (${orders.length})`
              : ` (${orders.filter((o) => o.orderStatus === f.key).length})`}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
          Đang tải đơn hàng...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid #f0e8e0",
          }}
        >
          <Package size={48} style={{ color: "#ddd", marginBottom: "12px" }} />
          <p style={{ color: "#999", fontSize: "14px" }}>
            Không có đơn hàng nào
          </p>
          <button
            onClick={() => navigate("/qua-tet")}
            style={{
              marginTop: "16px",
              padding: "10px 24px",
              background: "linear-gradient(135deg, #C62828 0%, #FF6B35 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Mua sắm ngay
          </button>
        </div>
      ) : (
        filteredOrders.map((order) => (
          <OrderCard key={order._id} order={order} onRefresh={fetchOrders} />
        ))
      )}
    </div>
  );
}
