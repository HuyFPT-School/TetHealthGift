import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { formatPrice } from "../../services/productService";
import { CheckCircle, XCircle, Loader } from "lucide-react";

export default function PaymentResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Initialize status from location state if it's COD
  const initialStatus = useMemo(() => {
    return location.state?.method === "cod" ? "success" : "loading";
  }, [location.state]);

  const initialPaymentData = useMemo(() => {
    if (location.state?.method === "cod") {
      return {
        orderId: location.state.orderId,
        amount: location.state.amount,
      };
    }
    return null;
  }, [location.state]);

  const [status, setStatus] = useState(initialStatus);
  const [paymentData, setPaymentData] = useState(initialPaymentData);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Skip if already handled (COD case)
    if (location.state?.method === "cod") {
      return;
    }

    const verifyPayment = async () => {
      try {
        // ✅ Backend đã redirect về với query params
        // Đọc trực tiếp từ query params (không gọi API)
        const statusParam = searchParams.get("status");
        const orderId = searchParams.get("orderId");
        const amount = searchParams.get("amount");
        const transactionNo = searchParams.get("transactionNo");
        const bankCode = searchParams.get("bankCode");
        const paymentMethod = searchParams.get("paymentMethod");
        const message = searchParams.get("message");

        // Check if redirected from backend
        if (statusParam === "success") {
          setStatus("success");
          setPaymentData({
            orderId,
            amount: amount ? parseFloat(amount) : null,
            transactionNo,
            bankCode,
            paymentMethod,
          });
        } else if (statusParam === "failed" || statusParam === "error") {
          setStatus("failed");
          setErrorMessage(decodeURIComponent(message || "Thanh toán thất bại"));
        } else {
          // Legacy: Nếu không có status param, fallback về API call cũ
          const vnpResponseCode = searchParams.get("vnp_ResponseCode");
          const partnerCode = searchParams.get("partnerCode");

          if (vnpResponseCode !== null) {
            // VNPay return - forward query params to backend
            const queryString = searchParams.toString();
            const res = await axiosInstance.get(
              `/api/payment/vnpay-return?${queryString}`,
            );

            if (res.data.success) {
              setStatus("success");
              setPaymentData(res.data.data);
            } else {
              setStatus("failed");
              setErrorMessage(res.data.message || "Thanh toán thất bại");
            }
          } else if (partnerCode !== null) {
            // MoMo return - forward query params to backend
            const queryString = searchParams.toString();
            const res = await axiosInstance.get(
              `/api/payment/momo-return?${queryString}`,
            );

            if (res.data.success) {
              setStatus("success");
              setPaymentData(res.data.data);
            } else {
              setStatus("failed");
              setErrorMessage(res.data.message || "Thanh toán thất bại");
            }
          } else {
            setStatus("failed");
            setErrorMessage("Không có thông tin thanh toán");
          }
        }
      } catch (error) {
        setStatus("failed");
        setErrorMessage(
          error.response?.data?.message || "Lỗi xác thực thanh toán",
        );
      }
    };

    verifyPayment();
  }, [searchParams, location.state]);

  return (
    <div
      style={{
        background: "#FFF8F0",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px 40px",
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #f0e8e0",
        }}
      >
        {status === "loading" && (
          <>
            <Loader
              size={60}
              style={{
                color: "#C62828",
                animation: "spin 1s linear infinite",
                marginBottom: "20px",
              }}
            />
            <h2
              style={{ fontSize: "20px", color: "#333", marginBottom: "8px" }}
            >
              Đang xác thực thanh toán...
            </h2>
            <p style={{ fontSize: "14px", color: "#888" }}>
              Vui lòng đợi trong giây lát
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle
              size={60}
              style={{ color: "#4CAF50", marginBottom: "20px" }}
            />
            <h2
              style={{ fontSize: "22px", color: "#333", marginBottom: "10px" }}
            >
              Thanh toán thành công!
            </h2>
            <p
              style={{ fontSize: "14px", color: "#888", marginBottom: "20px" }}
            >
              Cảm ơn bạn đã thanh toán. Đơn hàng đã được xác nhận.
            </p>

            {paymentData && (
              <div
                style={{
                  background: "#f9f9f9",
                  borderRadius: "10px",
                  padding: "16px",
                  marginBottom: "24px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ color: "#888" }}>Mã đơn hàng:</span>
                  <span style={{ fontWeight: "600", color: "#333" }}>
                    {paymentData.orderId}
                  </span>
                </div>
                {paymentData.amount && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ color: "#888" }}>Số tiền:</span>
                    <span style={{ fontWeight: "600", color: "#C62828" }}>
                      {formatPrice(paymentData.amount)}
                    </span>
                  </div>
                )}
                {paymentData.transactionNo && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ color: "#888" }}>Mã giao dịch:</span>
                    <span style={{ fontWeight: "600", color: "#333" }}>
                      {paymentData.transactionNo}
                    </span>
                  </div>
                )}
                {paymentData.transId && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ color: "#888" }}>Mã giao dịch:</span>
                    <span style={{ fontWeight: "600", color: "#333" }}>
                      {paymentData.transId}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => navigate("/")}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#fff",
                  color: "#C62828",
                  border: "2px solid #C62828",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Về trang chủ
              </button>
              <button
                onClick={() => navigate("/my-orders")}
                style={{
                  flex: 1,
                  padding: "12px",
                  background:
                    "linear-gradient(135deg, #C62828 0%, #FF6B35 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Theo dõi đơn hàng
              </button>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle
              size={60}
              style={{ color: "#C62828", marginBottom: "20px" }}
            />
            <h2
              style={{ fontSize: "22px", color: "#333", marginBottom: "10px" }}
            >
              Thanh toán thất bại
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#888",
                marginBottom: "24px",
              }}
            >
              {errorMessage}
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => navigate("/")}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#fff",
                  color: "#C62828",
                  border: "2px solid #C62828",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Về trang chủ
              </button>
              <button
                onClick={() => navigate("/cart")}
                style={{
                  flex: 1,
                  padding: "12px",
                  background:
                    "linear-gradient(135deg, #C62828 0%, #FF6B35 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Quay lại giỏ hàng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
