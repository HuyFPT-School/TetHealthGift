import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

const isRegisterPath = () => window.location.pathname === "/register";

function Register() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(isRegisterPath());
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const statusTimerRef = useRef(null);

  useEffect(() => {
    const handlePopState = () => setIsOpen(isRegisterPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

  useEffect(() => {
    return () => { if (statusTimerRef.current) clearTimeout(statusTimerRef.current); };
  }, []);

  const showStatus = (nextStatus, ms = 4000) => {
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    setStatus(nextStatus);
    if (nextStatus) statusTimerRef.current = setTimeout(() => setStatus(null), ms);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    if (form.password !== form.confirmPassword) {
      showStatus({ type: "error", message: "Mật khẩu xác nhận không khớp." });
      setLoading(false);
      return;
    }
    try {
      await axiosInstance.post("/api/auth/register", {
        fullname: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      showStatus({ type: "success", message: "Đăng ký thành công! Vui lòng xác thực email." });
      setTimeout(() => navigate("/verify-email", { state: { email: form.email.trim() } }), 1500);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Không thể kết nối máy chủ.";
      showStatus({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
        <div className="absolute top-1/3 -right-10 w-40 h-40 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <img src="/TetHealthGift-logo.png" alt="TetHealthGift" className="w-32 h-32 object-contain mb-8 drop-shadow-2xl" />
          <h1 className="text-white text-3xl font-black mb-3 leading-tight">Tham gia cùng chúng tôi</h1>
          <p className="text-red-100 text-base font-medium mb-8 leading-relaxed max-w-xs">
            Tạo tài khoản để khám phá hàng ngàn món quà sức khỏe ý nghĩa
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {[
              { icon: "✓", text: "Nhận ưu đãi thành viên độc quyền" },
              { icon: "✓", text: "Theo dõi đơn hàng dễ dàng" },
              { icon: "✓", text: "Thanh toán nhanh chóng, bảo mật" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-left">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">{item.icon}</span>
                <span className="text-red-100 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
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
            <p className="text-sm text-[#C62828] font-semibold mb-1 uppercase tracking-wider">Tài khoản mới</p>
            <h2 className="text-3xl font-black text-gray-900">Đăng ký</h2>
            <p className="text-gray-500 text-sm mt-2">Điền thông tin để tạo tài khoản của bạn</p>
          </div>

          {/* Status */}
          {status && (
            <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium border ${
              status.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Họ và tên</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><User size={17} /></span>
                <input
                  type="text" name="fullName" value={form.fullName} onChange={handleChange}
                  required autoComplete="name" placeholder="Nguyễn Văn A"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#C62828] focus:bg-white focus:shadow-[0_0_0_3px_rgba(198,40,40,0.1)] hover:border-gray-300"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={17} /></span>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  required autoComplete="email" placeholder="your@email.com"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#C62828] focus:bg-white focus:shadow-[0_0_0_3px_rgba(198,40,40,0.1)] hover:border-gray-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={17} /></span>
                <input
                  type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                  required autoComplete="new-password" placeholder="Tối thiểu 8 ký tự"
                  className="w-full h-12 pl-11 pr-11 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#C62828] focus:bg-white focus:shadow-[0_0_0_3px_rgba(198,40,40,0.1)] hover:border-gray-300"
                />
                <button type="button" onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-0">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Xác nhận mật khẩu</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={17} /></span>
                <input
                  type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                  required autoComplete="new-password" placeholder="Nhập lại mật khẩu"
                  className="w-full h-12 pl-11 pr-11 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#C62828] focus:bg-white focus:shadow-[0_0_0_3px_rgba(198,40,40,0.1)] hover:border-gray-300"
                />
                <button type="button" onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-0">
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="h-12 w-full rounded-xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] shadow-lg shadow-red-200 mt-2"
              style={{ background: "linear-gradient(135deg, #C62828 0%, #E53935 100%)" }}
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Đang xử lý...</> : <><ArrowRight size={18} /> Tạo tài khoản</>}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-7 text-center">
            <p className="text-sm text-gray-500">
              Đã có tài khoản?{" "}
              <a href="/login"
                onClick={(e) => { e.preventDefault(); window.history.pushState({}, "", "/login"); window.dispatchEvent(new PopStateEvent("popstate")); }}
                className="text-[#C62828] font-semibold hover:underline">
                Đăng nhập
              </a>
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

export default Register;
