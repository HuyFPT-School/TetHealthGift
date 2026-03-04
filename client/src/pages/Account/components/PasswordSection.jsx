import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const inputClass =
  "w-full h-[44px] pl-10 pr-11 rounded-[10px] border-[1.5px] border-[#f0d0a0] bg-white text-[14px] outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#F9A825] focus:shadow-[0_0_0_3px_rgba(249,168,37,0.15)]";

function PasswordField({ label, name, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <label className="flex flex-col gap-1.5 text-[14px] text-[#3b3339]">
      <span className="font-medium">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8a070] pointer-events-none">
          <Lock size={15} />
        </span>
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClass}
          required
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b7b84] hover:text-[#3b3339] bg-transparent border-0 cursor-pointer p-0 transition-colors"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </label>
  );
}

export default function PasswordSection({ value, onChange, onSubmit, status, loading }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[18px] font-semibold text-[#2b2730]">Đổi Mật Khẩu</h2>
        <p className="text-[13px] text-[#8b7b84] mt-1">
          Mật khẩu mới nên có 8–30 ký tự, bao gồm chữ hoa, chữ thường và số.
        </p>
      </div>

      {/* Status message */}
      {status?.message && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-[10px] text-[13px] font-medium border ${
            status.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle size={15} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={15} className="flex-shrink-0" />
          )}
          {status.message}
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <PasswordField
          label="Mật khẩu hiện tại"
          name="oldPassword"
          value={value?.oldPassword || ""}
          onChange={onChange}
          placeholder="Nhập mật khẩu hiện tại"
        />
        <PasswordField
          label="Mật khẩu mới"
          name="newPassword"
          value={value?.newPassword || ""}
          onChange={onChange}
          placeholder="Tối thiểu 8 ký tự, chữ hoa, chữ thường, số"
        />
        <PasswordField
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          value={value?.confirmPassword || ""}
          onChange={onChange}
          placeholder="Nhập lại mật khẩu mới"
        />

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="h-[44px] px-6 rounded-[12px] border-0 bg-[#C62828] text-white font-semibold text-[15px] cursor-pointer shadow-[0_8px_16px_rgba(198,40,40,0.25)] disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Đang cập nhật...</>
            ) : (
              "Cập nhật mật khẩu"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
