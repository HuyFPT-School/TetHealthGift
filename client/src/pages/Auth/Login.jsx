import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/lib/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

const isLoginPath = () => window.location.pathname === "/login";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isOpen, setIsOpen] = useState(isLoginPath());
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const statusTimerRef = useRef(null);

  useEffect(() => {
    const handlePopState = () => setIsOpen(isLoginPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    return () => {
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const hidden = [];
    document
      .querySelectorAll(
        "header, footer, .fixed.inset-0.pointer-events-none.overflow-hidden",
      )
      .forEach((el) => {
        if (!el.dataset.loginHidden) {
          el.dataset.loginHidden = "true";
          el.classList.add("hidden");
          hidden.push(el);
        }
      });
    return () => {
      document.body.style.overflow = prev;
      hidden.forEach((el) => {
        if (el.dataset.loginHidden === "true") {
          delete el.dataset.loginHidden;
          el.classList.remove("hidden");
        }
      });
    };
  }, [isOpen]);

  const openLogin = () => {
    if (!isLoginPath()) window.history.pushState({}, "", "/login");
    setIsOpen(true);
  };

  const showStatus = (nextStatus, ms = 4000) => {
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    setStatus(nextStatus);
    if (nextStatus)
      statusTimerRef.current = setTimeout(() => setStatus(null), ms);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleInput = (e) => e.target.setCustomValidity("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    showStatus(null);
    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });
      const { accessToken, user } = response?.data || {};
      if (accessToken) {
        login(accessToken, user);
      }

      if (user?.role === "Admin") {
        navigate("/admin/products");
      } else if (user?.role === "Staff") {
        navigate("/staff");
      } else {
        navigate("/");
      }
    } catch (error) {
      const serverMessage =
        error?.response?.data?.error || error?.response?.data?.message;
      const errorMessage =
        serverMessage || error?.message || "Không thể kết nối máy chủ.";
      showStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={openLogin}
        className="border-0 px-4 py-2 rounded-full text-[14px] font-semibold cursor-pointer bg-[#c0392b] text-white shadow-[0_6px_14px_rgba(192,57,43,0.35)]"
      >
        Đăng nhập
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex"
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      {/* LEFT: Brand Panel */}
      <div
        className="hidden lg:flex flex-col justify-center items-center w-[45%] relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #8B0000 0%, #C62828 45%, #E53935 100%)",
        }}
      >
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)",
          }}
        />
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/3 -right-10 w-40 h-40 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <img
            src="/TetHealthGift-logo.png"
            alt="TetHealthGift"
            className="w-32 h-32 object-contain mb-8 drop-shadow-2xl"
          />
          <h1 className="text-white text-3xl font-black mb-3 leading-tight">
            Quà Tết Sức Khỏe
          </h1>
          <p className="text-red-100 text-base font-medium mb-8 leading-relaxed max-w-xs">
            Trao gửi yêu thương qua những món quà sức khỏe ý nghĩa nhất
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {[
              { icon: "✓", text: "Miễn phí giao hàng từ 5 triệu" },
              { icon: "✓", text: "Khắc logo miễn phí từ 20 hộp" },
              { icon: "✓", text: "Tiết kiệm 5% khi đặt online" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 text-left"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                  {item.icon}
                </span>
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
            <img
              src="/TetHealthGift-logo.png"
              alt="TetHealthGift"
              className="h-16 object-contain"
            />
          </div>

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm text-[#C62828] font-semibold mb-1 uppercase tracking-wider">
              Chào mừng trở lại
            </p>
            <h2 className="text-3xl font-black text-gray-900">Đăng nhập</h2>
            <p className="text-gray-500 text-sm mt-2">
              Nhập thông tin tài khoản của bạn để tiếp tục
            </p>
          </div>

          {/* Status */}
          {status && (
            <div
              className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium border ${
                status.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={17} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onInput={handleInput}
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#C62828] focus:bg-white focus:shadow-[0_0_0_3px_rgba(198,40,40,0.1)] hover:border-gray-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  Mật khẩu
                </label>
                <a
                  href="/forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, "", "/forgot-password");
                    window.dispatchEvent(new PopStateEvent("popstate"));
                  }}
                  className="text-xs text-[#C62828] hover:underline font-medium"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={17} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onInput={handleInput}
                  required
                  autoComplete="current-password"
                  placeholder="Mật khẩu của bạn"
                  className="w-full h-12 pl-11 pr-11 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#C62828] focus:bg-white focus:shadow-[0_0_0_3px_rgba(198,40,40,0.1)] hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-0 cursor-pointer p-0"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] shadow-lg shadow-red-200 mt-1"
              style={{
                background: "linear-gradient(135deg, #C62828 0%, #E53935 100%)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Đang xử lý...
                </>
              ) : (
                <>
                  <ArrowRight size={18} /> Đăng nhập
                </>
              )}
            </button>
          </form>

          {/* Divider + Register link */}
          <div className="mt-7 text-center">
            <p className="text-sm text-gray-500">
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, "", "/register");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="text-[#C62828] font-semibold hover:underline"
              >
                Đăng ký ngay
              </a>
            </p>
          </div>

          {/* Back to home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
