import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ForgotPasswordEmailForm from "./components/ForgotPasswordEmailForm";
import ForgotPasswordOtpResetForm from "./components/ForgotPasswordOtpResetForm";
import { useForgotPasswordFlow } from "./hooks/useForgotPasswordFlow";
import { KeyRound } from "lucide-react";

const STEP_CONTENT = {
  email: { title: "Quên mật khẩu", description: "Nhập email để nhận mã OTP đặt lại mật khẩu." },
  reset: { title: "Đặt lại mật khẩu", description: "Nhập mã OTP và mật khẩu mới." },
};

function ForgotPassword() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const statusTimerRef = useRef(null);
  const {
    step, email, setEmail, otp, setOtp, newPassword, setNewPassword,
    confirmPassword, setConfirmPassword, loading, error, message,
    handleSubmitEmail, handleSubmitReset, goToEmailStep,
  } = useForgotPasswordFlow();

  const showStatus = (nextStatus, ms = 4000) => {
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    setStatus(nextStatus);
    if (nextStatus) statusTimerRef.current = setTimeout(() => setStatus(null), ms);
  };

  useEffect(() => {
    return () => { if (statusTimerRef.current) clearTimeout(statusTimerRef.current); };
  }, []);

  useEffect(() => {
    if (error) { showStatus({ type: "error", message: error }); return; }
    if (message) { showStatus({ type: "success", message }); return; }
    showStatus(null);
  }, [error, message]);

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
    if (message !== "Đổi mật khẩu thành công.") return;
    const t = setTimeout(() => navigate("/login"), 2000);
    return () => clearTimeout(t);
  }, [message, navigate]);

  const content = useMemo(() => STEP_CONTENT[step] || STEP_CONTENT.email, [step]);

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
          <h1 className="text-white text-3xl font-black mb-3">Bảo mật tài khoản</h1>
          <p className="text-red-100 text-base font-medium mb-2 leading-relaxed max-w-xs">
            Đặt lại mật khẩu của bạn một cách dễ dàng và bảo mật
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

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <KeyRound size={20} className="text-[#C62828]" />
              <p className="text-sm text-[#C62828] font-semibold uppercase tracking-wider">Khôi phục tài khoản</p>
            </div>
            <h2 className="text-3xl font-black text-gray-900">{content.title}</h2>
            <p className="text-gray-500 text-sm mt-2">{content.description}</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${step === "email" ? "bg-[#C62828] text-white" : "bg-green-500 text-white"}`}>
              {step === "email" ? "1" : "✓"}
            </div>
            <div className={`flex-1 h-0.5 ${step === "reset" ? "bg-[#C62828]" : "bg-gray-200"}`} />
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${step === "reset" ? "bg-[#C62828] text-white" : "bg-gray-200 text-gray-500"}`}>
              2
            </div>
          </div>

          {/* Status */}
          {status && (
            <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium border ${
              status.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {status.message}
            </div>
          )}

          {step === "email" && (
            <ForgotPasswordEmailForm
              email={email} onEmailChange={setEmail}
              onSubmit={handleSubmitEmail} loading={loading}
              error={null} message={null}
            />
          )}
          {step === "reset" && (
            <ForgotPasswordOtpResetForm
              otp={otp} newPassword={newPassword} confirmPassword={confirmPassword}
              onOtpChange={setOtp} onNewPasswordChange={setNewPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onSubmit={handleSubmitReset} onBack={goToEmailStep}
              loading={loading} error={null}
            />
          )}

          <div className="mt-7 text-center">
            <a href="/login"
              onClick={(e) => { e.preventDefault(); window.history.pushState({}, "", "/login"); window.dispatchEvent(new PopStateEvent("popstate")); }}
              className="text-sm text-gray-500 hover:text-[#C62828] font-medium transition-colors">
              Quay lại đăng nhập
            </a>
          </div>
          <div className="mt-3 text-center">
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Quay về trang chủ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
