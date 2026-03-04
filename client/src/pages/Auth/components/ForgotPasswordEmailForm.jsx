import { Mail, ArrowRight, Loader2 } from "lucide-react";

function ForgotPasswordEmailForm({
  email, onEmailChange, onSubmit, loading, error, message,
}) {
  const handleSubmit = (e) => { e.preventDefault(); onSubmit?.(); };

  const handleEmailInvalid = (e) => {
    const input = e.target;
    if (input.validity.valueMissing) input.setCustomValidity("Vui lòng nhập email.");
    else if (input.validity.typeMismatch) input.setCustomValidity("Vui lòng nhập email hợp lệ.");
    else input.setCustomValidity("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">Địa chỉ email</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Mail size={17} />
          </span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => onEmailChange?.(e.target.value)}
            onInvalid={handleEmailInvalid}
            onInput={(e) => e.target.setCustomValidity("")}
            required
            autoComplete="email"
            placeholder="your@email.com"
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#C62828] focus:bg-white focus:shadow-[0_0_0_3px_rgba(198,40,40,0.1)] hover:border-gray-300"
          />
        </div>
      </div>

      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] shadow-lg shadow-red-200"
        style={{ background: "linear-gradient(135deg, #C62828 0%, #E53935 100%)" }}
      >
        {loading ? (
          <><Loader2 size={18} className="animate-spin" /> Đang gửi...</>
        ) : (
          <><ArrowRight size={18} /> Gửi mã OTP</>
        )}
      </button>
    </form>
  );
}

export default ForgotPasswordEmailForm;
