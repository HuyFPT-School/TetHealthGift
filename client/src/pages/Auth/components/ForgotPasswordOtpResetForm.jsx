function ForgotPasswordOtpResetForm({
  otp,
  newPassword,
  confirmPassword,
  onOtpChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onBack,
  loading,
  error,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.();
  };

  const handleOtpInvalid = (event) => {
    const input = event.target;
    if (input.validity.valueMissing) {
      input.setCustomValidity("Vui lòng nhập mã OTP.");
    } else {
      input.setCustomValidity("");
    }
  };

  const handleNewPasswordInvalid = (event) => {
    const input = event.target;
    if (input.validity.valueMissing) {
      input.setCustomValidity("Vui lòng nhập mật khẩu mới.");
    } else {
      input.setCustomValidity("");
    }
  };

  const handleConfirmPasswordInvalid = (event) => {
    const input = event.target;
    if (input.validity.valueMissing) {
      input.setCustomValidity("Vui lòng xác nhận mật khẩu mới.");
    } else {
      input.setCustomValidity("");
    }
  };

  const handleInput = (event) => {
    event.target.setCustomValidity("");
  };

  return (
    <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-2 text-[14px] text-[#3b3339]">
        <span className="font-medium">Mã OTP</span>
        <input
          type="text"
          name="otp"
          className="w-full h-[44px] px-[14px] rounded-[10px] border-[1.5px] border-[#ddd] bg-white text-[14px] outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#c0392b] focus:shadow-[0_0_0_3px_rgba(192,57,43,0.15)]"
          placeholder="Nhập mã OTP 6 số"
          value={otp}
          onChange={(event) => onOtpChange?.(event.target.value)}
          onInvalid={handleOtpInvalid}
          onInput={handleInput}
          required
        />
      </label>

      <label className="flex flex-col gap-2 text-[14px] text-[#3b3339]">
        <span className="font-medium">Mật khẩu mới</span>
        <input
          type="password"
          name="newPassword"
          className="w-full h-[44px] px-[14px] rounded-[10px] border-[1.5px] border-[#ddd] bg-white text-[14px] outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#c0392b] focus:shadow-[0_0_0_3px_rgba(192,57,43,0.15)]"
          placeholder="Nhập mật khẩu mới"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => onNewPasswordChange?.(event.target.value)}
          onInvalid={handleNewPasswordInvalid}
          onInput={handleInput}
          required
        />
      </label>

      <label className="flex flex-col gap-2 text-[14px] text-[#3b3339]">
        <span className="font-medium">Xác nhận mật khẩu mới</span>
        <input
          type="password"
          name="confirmPassword"
          className="w-full h-[44px] px-[14px] rounded-[10px] border-[1.5px] border-[#ddd] bg-white text-[14px] outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#c0392b] focus:shadow-[0_0_0_3px_rgba(192,57,43,0.15)]"
          placeholder="Nhập lại mật khẩu mới"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => onConfirmPasswordChange?.(event.target.value)}
          onInvalid={handleConfirmPasswordInvalid}
          onInput={handleInput}
          required
        />
      </label>

      {error && <p className="text-[13px] text-[#e53935]">{error}</p>}

      <button
        className="h-[44px] rounded-[12px] border-0 bg-[#c0392b] text-white font-semibold text-[15px] cursor-pointer shadow-[0_8px_16px_rgba(192,57,43,0.35)] disabled:opacity-70 disabled:cursor-not-allowed"
        type="submit"
        disabled={loading}
      >
        {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
      </button>
    </form>
  );
}

export default ForgotPasswordOtpResetForm;
