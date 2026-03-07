import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../services/productService";
import axiosInstance from "../../lib/axios";
import { removeFromWishlist } from "../../api/addWishList";
import { ArrowLeft } from "lucide-react";

export default function PayMoneyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const selectedItems = location.state?.selectedItems || [];
  const totalAmount = location.state?.totalAmount || 0;

  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (selectedItems.length === 0) {
      navigate("/cart");
      return;
    }
    // Pre-fill from user profile
    setShippingAddress(user.address || "");
    setPhone(user.phone || "");
  }, [user]);

  const handleSubmitOrder = async () => {
    if (!shippingAddress.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng");
      return;
    }
    if (!phone.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return;
    }

    const cartData = selectedItems.map((item) => ({
      product: item.product?._id,
      quantity: item.quantity || 1,
    }));

    try {
      setOrdering(true);
      await axiosInstance.post("/api/orders", {
        cartItems: cartData,
        shippingAddress: shippingAddress.trim(),
        phone: phone.trim(),
        note: note.trim(),
        paymentMethod,
      });

      // Remove ordered items from wishlist
      for (const item of selectedItems) {
        await removeFromWishlist(item.product?._id);
      }

      alert("Đặt hàng thành công!");
      navigate("/cart");
    } catch (error) {
      alert(
        "Đặt hàng thất bại: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setOrdering(false);
    }
  };

  const paymentMethods = [
    {
      value: "cod",
      label: "Thanh toán khi nhận hàng (COD)",
      icon: "💵",
      desc: "Thanh toán bằng tiền mặt khi nhận hàng",
    },
    {
      value: "momo",
      label: "Ví MoMo",
      icon: "📱",
      desc: "Thanh toán qua ví điện tử MoMo",
    },
    {
      value: "vnpay",
      label: "VNPay",
      icon: "🏦",
      desc: "Thanh toán qua cổng VNPay",
    },
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
          onClick={() => navigate("/cart")}
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
          Quay lại giỏ hàng
        </button>
      </div>

      <h1
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#C62828",
          marginBottom: "24px",
        }}
      >
        Thanh toán đơn hàng
      </h1>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
        {/* Left: Form */}
        <div style={{ flex: 1 }}>
          {/* Shipping Info */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "16px",
              border: "1px solid #f0e8e0",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#333",
                marginBottom: "16px",
              }}
            >
              Thông tin giao hàng
            </h3>

            {/* Shipping Address */}
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#555",
                  marginBottom: "6px",
                }}
              >
                Địa chỉ giao hàng <span style={{ color: "#C62828" }}>*</span>
              </label>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Nhập địa chỉ giao hàng..."
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#C62828")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#555",
                  marginBottom: "6px",
                }}
              >
                Số điện thoại <span style={{ color: "#C62828" }}>*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại..."
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#C62828")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              />
            </div>

            {/* Note */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#555",
                  marginBottom: "6px",
                }}
              >
                Ghi chú
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú cho đơn hàng (không bắt buộc)..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#C62828")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "16px",
              border: "1px solid #f0e8e0",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#333",
                marginBottom: "16px",
              }}
            >
              Phương thức thanh toán
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 16px",
                    borderRadius: "10px",
                    border:
                      paymentMethod === method.value
                        ? "2px solid #C62828"
                        : "1px solid #e0e0e0",
                    background:
                      paymentMethod === method.value ? "#FFF5E6" : "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "22px" }}>{method.icon}</span>
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#333",
                      }}
                    >
                      {method.label}
                    </div>
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                      {method.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Product List */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid #f0e8e0",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#333",
                marginBottom: "16px",
              }}
            >
              Sản phẩm ({selectedItems.length})
            </h3>

            {selectedItems.map((item) => {
              const product = item.product;
              if (!product) return null;
              const price = product.discountPrice || product.price;
              return (
                <div
                  key={product._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "12px 0",
                    borderBottom: "1px solid #f5f5f5",
                  }}
                >
                  <img
                    src={product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #eee",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#333",
                      }}
                    >
                      {product.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>
                      {formatPrice(price)} x {item.quantity || 1}
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: "700",
                      color: "#C62828",
                      fontSize: "14px",
                    }}
                  >
                    {formatPrice(price * (item.quantity || 1))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div
          style={{
            width: "340px",
            background: "#fff",
            borderRadius: "12px",
            padding: "24px",
            border: "1px solid #f0e8e0",
            position: "sticky",
            top: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#333",
              marginBottom: "16px",
            }}
          >
            Tóm tắt đơn hàng
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              fontSize: "14px",
              color: "#666",
            }}
          >
            <span>Số lượng sản phẩm:</span>
            <span>{selectedItems.length}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              fontSize: "14px",
              color: "#666",
            }}
          >
            <span>Tổng số lượng:</span>
            <span>
              {selectedItems.reduce(
                (sum, item) => sum + (item.quantity || 1),
                0
              )}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              fontSize: "14px",
              color: "#666",
            }}
          >
            <span>Phương thức:</span>
            <span style={{ fontWeight: "600" }}>
              {paymentMethods.find((m) => m.value === paymentMethod)?.label}
            </span>
          </div>

          <div
            style={{
              borderTop: "1px solid #eee",
              paddingTop: "14px",
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            <span style={{ color: "#333" }}>Tổng tiền:</span>
            <span style={{ color: "#C62828" }}>{formatPrice(totalAmount)}</span>
          </div>

          <button
            onClick={handleSubmitOrder}
            disabled={ordering}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "14px",
              background: "linear-gradient(135deg, #C62828 0%, #FF6B35 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: ordering ? "not-allowed" : "pointer",
              opacity: ordering ? 0.7 : 1,
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 12px rgba(198,40,40,0.3)",
            }}
            onMouseEnter={(e) => {
              if (!ordering) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(198,40,40,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(198,40,40,0.3)";
            }}
          >
            {ordering ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
}
