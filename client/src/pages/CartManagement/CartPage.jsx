import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
} from "../../services/cartService";
import { formatPrice } from "../../services/productService";
import { Trash2, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();

    // Nghe event để cập nhật khi xoá khỏi localStorage ở tab khác (optional)
    const handleCartUpdate = () => fetchCart();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const fetchCart = () => {
    try {
      setLoading(true);
      const data = getCart();
      setCartItems(data || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (productId) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cartItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((item) => item.product?._id));
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const qty = Math.max(1, parseInt(newQuantity) || 1);
    try {
      updateCartQuantity(productId, qty);
      setCartItems((prev) =>
        prev.map((item) =>
          item.product?._id === productId ? { ...item, quantity: qty } : item,
        ),
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const removeItem = (productId) => {
    try {
      removeFromCart(productId);

      setCartItems((prev) =>
        prev.filter((item) => item.product?._id !== productId),
      );

      setSelectedIds((prev) => prev.filter((id) => id !== productId));

      toast.success("Đã xóa khỏi giỏ hàng");
    } catch (error) {
      toast.error("Xóa sản phẩm thất bại");
    }
  };
  const selectedItems = cartItems.filter((item) =>
    selectedIds.includes(item.product?._id),
  );

  const totalAmount = selectedItems.reduce((sum, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    navigate("/checkout", {
      state: {
        selectedItems,
        totalAmount,
      },
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>
        Đang tải giỏ hàng...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#FFF8F0",
        minHeight: "100vh",
        padding: "30px 40px",
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#C62828",
          marginBottom: "24px",
        }}
      >
        🛒 Giỏ hàng của bạn
      </h1>

      {cartItems.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#999",
            fontSize: "16px",
          }}
        >
          Giỏ hàng trống. Hãy thêm sản phẩm vào giỏ hàng!
        </div>
      ) : (
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
          {/* Cart items list */}
          <div style={{ flex: 1 }}>
            {/* Select all */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 20px",
                background: "#fff",
                borderRadius: "10px",
                marginBottom: "12px",
                border: "1px solid #f0e8e0",
              }}
            >
              <input
                type="checkbox"
                checked={
                  selectedIds.length === cartItems.length &&
                  cartItems.length > 0
                }
                onChange={toggleSelectAll}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span style={{ fontWeight: "600", color: "#333" }}>
                Chọn tất cả ({cartItems.length} sản phẩm)
              </span>
            </div>

            {/* Items */}
            {cartItems.map((item) => {
              const product = item.product;
              if (!product) return null;
              const price = product.discountPrice || product.price;
              const isSelected = selectedIds.includes(product._id);

              return (
                <div
                  key={product._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px 20px",
                    background: isSelected ? "#FFF5E6" : "#fff",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    border: isSelected
                      ? "2px solid #F9A825"
                      : "1px solid #f0e8e0",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(product._id)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <img
                    src={product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #eee",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "15px",
                        color: "#333",
                        marginBottom: "6px",
                      }}
                    >
                      {product.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          color: "#C62828",
                          fontWeight: "700",
                          fontSize: "15px",
                        }}
                      >
                        {formatPrice(price)}
                      </span>
                      {product.discountPrice &&
                        product.discountPrice < product.price && (
                          <span
                            style={{
                              color: "#999",
                              textDecoration: "line-through",
                              fontSize: "13px",
                            }}
                          >
                            {formatPrice(product.price)}
                          </span>
                        )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "6px",
                      }}
                    >
                      <span style={{ color: "#888", fontSize: "13px" }}>
                        Số lượng:
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            (item.quantity || 1) - 1,
                          )
                        }
                        disabled={(item.quantity || 1) <= 1}
                        style={{
                          width: "28px",
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          background:
                            (item.quantity || 1) <= 1 ? "#f5f5f5" : "#fff",
                          cursor:
                            (item.quantity || 1) <= 1
                              ? "not-allowed"
                              : "pointer",
                          color: (item.quantity || 1) <= 1 ? "#ccc" : "#333",
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity || 1}
                        onChange={(e) =>
                          handleQuantityChange(product._id, e.target.value)
                        }
                        style={{
                          width: "48px",
                          height: "28px",
                          textAlign: "center",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          fontSize: "14px",
                          outline: "none",
                          MozAppearance: "textfield",
                        }}
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            product._id,
                            (item.quantity || 1) + 1,
                          )
                        }
                        style={{
                          width: "28px",
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          background: "#fff",
                          cursor: "pointer",
                          color: "#333",
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: "700",
                      color: "#C62828",
                      fontSize: "16px",
                      minWidth: "120px",
                      textAlign: "right",
                    }}
                  >
                    {formatPrice(price * (item.quantity || 1))}
                  </div>
                  <button
                    onClick={() => removeItem(product._id)}
                    title="Xóa"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "6px",
                      borderRadius: "6px",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#ffe5e5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
                  >
                    <Trash2 size={18} color="#c0392b" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div
            style={{
              width: "320px",
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
              <span>Sản phẩm đã chọn:</span>
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
                  0,
                )}
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
              <span style={{ color: "#C62828" }}>
                {formatPrice(totalAmount)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "14px",
                background:
                  selectedItems.length === 0
                    ? "#ccc"
                    : "linear-gradient(135deg, #C62828 0%, #FF6B35 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow:
                  selectedItems.length > 0
                    ? "0 4px 12px rgba(198,40,40,0.3)"
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (selectedItems.length > 0) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(198,40,40,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                if (selectedItems.length > 0) {
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(198,40,40,0.3)";
                }
              }}
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
