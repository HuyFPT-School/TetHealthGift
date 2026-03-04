export default function AvatarUploader({ previewUrl, onChange, loading }) {
  return (
    <div className="w-full max-w-[260px] border border-[#f0d0a0] rounded-[14px] p-4 flex flex-col items-center gap-3 bg-white">
      <div className="w-[120px] h-[120px] rounded-full border border-[#f0d0a0] bg-[#fff5e6] overflow-hidden flex items-center justify-center text-[#8b7355] text-[24px] font-semibold">
        {previewUrl ? (
          <img src={previewUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span>Ảnh</span>
        )}
      </div>
      <label className="w-full">
        <input
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={onChange}
          disabled={loading}
        />
        <span
          className={`block w-full text-center px-3 py-2 rounded-[10px] border border-[#f0d0a0] text-[13px] font-semibold text-[#2b2730] transition ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-[#fff4e6]"
          }`}
        >
          {loading ? "Đang tải..." : "Chọn ảnh"}
        </span>
      </label>
      <p className="text-[12px] text-[#8b7b84] text-center">
        Dung lượng file tối đa 1MB. Định dạng .JPEG, .PNG
      </p>
    </div>
  );
}
