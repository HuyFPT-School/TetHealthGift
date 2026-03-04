import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import { MailCheck, Hash, CheckCircle, RefreshCw, Loader2 } from "lucide-react";

function VerifyEmailOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const statusTimerRef = useRef(null);

  useEffect(() => {
    const emailFromState = location.state?.email;
    const emailFromQuery = new URLSearchParams(location.search).get("email");
    const userEmail = emailFromState || emailFromQuery;
    if (!userEmail) { navigate("/register"); return; }
    setEmail(userEmail);
  }, [location, navigate]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const hidden = [];
    document.querySelectorAll("header, footer, .fixed.inset-0.pointer-events-none.overflow-hidden").forEach((el) => {
      if (!el.dataset.loginHidden) { el.dataset.loginHidden = "true"; el.classList.add("hidden"); hidden.push(el); }
    });
    return () => {
      document.body.style.overflow = prev;
      hidden.forEach((el) => { if (el.dataset.loginHidden === "true") { delete el.dataset.loginHidden; el.classList.remove("hidden"); } });
    };
  }, []);

  useEffect(() => {
    return () => { if (statusTimerRef.current) clearTimeout(statusTimerRef.current); };
  }, []);

  const showStatus = (nextStatus, ms = 4000) => {
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    setStatus(nextStatus);
    if (nextStatus) statusTimerRef.current = setTimeout(() => setStatus(null), ms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await axiosInstance.post("/api/auth/verify-email", { email: email.trim(), otp: otp.trim() });
      showStatus({ type: "success", message: "Xác thực thành công! Đang chuyển hướng..." });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Không thể xác thực OTP.";
      showStatus({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setStatus(null);
    setResendLoading(true);
    try {
      await axiosInstance.post("/api/auth/send-reset-otp", { email: email.trim() });
      showStatus({ type: "success", message: "Đã gửi lại mã OTP. Vui lòng kiểm tra email." });
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Không thể gửi lại OTP.";
      showStatus({ type: "error", message: msg });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* LEFT: Brand Panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-[45%] relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #8B0000 0%, #C62828 45%, #E53935 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)"
        }} />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <img src="/TetHealthGift-logo.png" alt="TetHealthGift" className="w-32 h-32 object-contain mb-8 drop-shadow-2xl" />
          <h1 className="text-white text-3xl font-black mb-3">Xác thực Email</h1>
          <p className="text-red-100 text-base font-medium leading-relaxed max-w-xs">
            Một bước nữa để bảo vệ tài khoản của bạn an toàn
          </p>
        </div>
      </div>

      {/* RIGHT: Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white overflow-y-auto py-10 px-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src="/TetHealthGift-logo.png" alt="TetHealthGift" className="h-16 object-contain" />
          </div>

          {/* Icon + Header */}
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(198,40,40,0.08)" }}>
              <MailCheck size={32} className="text-[#C62828]" />
            </div>
            <h2 className="text-3xl font-black text-gray-900">Nhập mã OTP</h2>
            <p className="text-gray-500 text-sm mt-2">
              Mã xác thực đã được gửi đến{" "}
              <strong className="text-gray-700">{email}</strong>
            </p>
          </div>

          {/* Status */}
          {status && (
            <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium border ${
              status.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* OTP input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Hash size={14} className="text-[#C62828]" /> Mã OTP (6 chữ số)
              </label>
              <input
                type="text" name="otp" value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6} pattern="[0-9]{6}" required
                placeholder="0  0  0  0  0  0"
                className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 text-center text-2xl font-black tracking-[12px] text-gray-900 outline-none transition-all duration-200 focus:border-[#C62828] focus:bg-white focus:shadow-[0_0_0_3px_rgba(198,40,40,0.1)] hover:border-gray-300"
              />
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="h-12 w-full rounded-xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] shadow-lg shadow-red-200"
              style={{ background: "linear-gradient(135deg, #C62828 0%, #E53935 100%)" }}
            >
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Đang xác thực...</>
                : <><CheckCircle size={18} /> Xác thực</>}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Không nhận được mã?{" "}
              <button
                onClick={handleResendOTP} disabled={resendLoading || loading}
                className="text-[#C62828] font-semibold hover:underline bg-transparent border-0 cursor-pointer p-0 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
              >
                {resendLoading
                  ? <><Loader2 size={13} className="animate-spin" /> Đang gửi...</>
                  : <><RefreshCw size={13} /> Gửi lại OTP</>}
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Quay về trang chủ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailOTP;
