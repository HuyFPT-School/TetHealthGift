import { useState } from "react";
import { KeyRound, Lock, Eye, EyeOff, CheckCircle, Loader2, ArrowLeft } from "lucide-react";

function ForgotPasswordOtpResetForm({
  otp, newPassword, confirmPassword,
  onOtpChange, onNewPasswordChange, onConfirmPasswordChange,
  onSubmit, onBack, loading, error,
}) {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); onSubmit?.(); };

  const handleInvalid = (msg) => (e) => {
    if (e.target.validity.valueMissing) e.target.setCustomValidity(msg);
    else e.target.setCustomValidity("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* OTP */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <KeyRound size={14} className="text-[#C62828]" /> Mã OTP
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => onOtpChange?.(e.target.value)}
          onInvalid={handleInvalid("Vui lòng nhập mã OTP.")}
          onInput={(e) => e.target.setCustomValidity("")}
          required
          placeholder="Nhập mã 6 chữ số"
          className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-center font-bold tracking-[8px] text-gray-900 outline-none transition-all duration-200 focus:border-[#C62828] focus:bg-white focus:shadow-[0_0_0_3px_rgba(198,40,40,0.1)] hover:border-gray-300"
        />
      </div>

      {/* New Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Lock size={14} className="text-[#C62828]" /> Mật khẩu mới
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Lock size={17} />
          </span>
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => onNewPasswordChange?.(e.target.value)}
            onInvalid={handleInvalid("Vui lòng nhập mật khẩu mới.")}
            onInput={(e) => e.target.setCustomValidity("")}
            required
            autoComplete="new-password"
            placeholder="Mật khẩu mới"
            className="w-full h-12 pl-11 pr-11 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#C62828] focus:bg-white focus:shadow-[0_0_0_3px_rgba(198,40,40,0.1)] hover:border-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowNew((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-0"
          >
            {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <Lock size={14} className="text-[#C62828]" /> Xác nhận mật khẩu
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Lock size={17} />
          </span>
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
            onInvalid={handleInvalid("Vui lòng xác nhận mật khẩu.")}
            onInput={(e) => e.target.setCustomValidity("")}
            required
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu mới"
            className="w-full h-12 pl-11 pr-11 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#C62828] focus:bg-white focus:shadow-[0_0_0_3px_rgba(198,40,40,0.1)] hover:border-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-0"
          >
            {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 mt-1">
        <button
          type="button"
          onClick={onBack}
          className="h-12 flex-shrink-0 px-5 rounded-xl font-semibold text-sm text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Quay lại
        </button>
        <button
          type="submit"
          disabled={loading}
          className="h-12 flex-1 rounded-xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] shadow-lg shadow-red-200"
          style={{ background: "linear-gradient(135deg, #C62828 0%, #E53935 100%)" }}
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Đang cập nhật...</>
          ) : (
            <><CheckCircle size={18} /> Đổi mật khẩu</>
          )}
        </button>
      </div>
    </form>
  );
}

export default ForgotPasswordOtpResetForm;
