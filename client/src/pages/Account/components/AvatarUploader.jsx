import { Camera, Loader2, CheckCircle } from "lucide-react";

export default function AvatarUploader({ previewUrl, onChange, loading, uploadStatus }) {
  return (
    <div className="w-full max-w-[220px] border border-[#f0d0a0] rounded-[16px] p-5 flex flex-col items-center gap-3 bg-white shadow-sm">
      {/* Avatar preview */}
      <div className="relative">
        <div className="w-[120px] h-[120px] rounded-full border-2 border-[#f0d0a0] bg-[#fff5e6] overflow-hidden flex items-center justify-center text-[#8b7355] text-[22px] font-semibold">
          {previewUrl ? (
            <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#c8a070]">Ảnh</span>
          )}
        </div>
        {/* Camera badge overlay */}
        <label className={`absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#C62828] flex items-center justify-center shadow-md cursor-pointer transition-opacity ${loading ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-[#a82020]"}`}>
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={onChange}
            disabled={loading}
          />
          {loading ? (
            <Loader2 size={14} className="text-white animate-spin" />
          ) : (
            <Camera size={14} className="text-white" />
          )}
        </label>
      </div>

      {/* Upload hint / status */}
      {uploadStatus?.type === "success" ? (
        <div className="flex items-center gap-1.5 text-[12px] text-green-600 font-medium">
          <CheckCircle size={13} /> Ảnh đã được cập nhật
        </div>
      ) : (
        <p className="text-[12px] text-[#8b7b84] text-center leading-relaxed">
          Nhấn vào biểu tượng <span className="font-semibold text-[#C62828]">máy ảnh</span> để chọn ảnh
        </p>
      )}

      {/* Upload action button */}
      <label className={`w-full ${loading ? "pointer-events-none" : ""}`}>
        <input
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={onChange}
          disabled={loading}
        />
        <span
          className={`block w-full text-center px-3 py-2 rounded-[10px] border border-[#f0d0a0] text-[13px] font-semibold text-[#2b2730] transition select-none ${
            loading
              ? "opacity-50 cursor-not-allowed bg-gray-50"
              : "cursor-pointer hover:bg-[#fff4e6]"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-1.5">
              <Loader2 size={13} className="animate-spin" /> Đang tải lên...
            </span>
          ) : (
            "Chọn ảnh"
          )}
        </span>
      </label>

      <p className="text-[11px] text-[#aaa] text-center">
        Tối đa 1MB · JPEG, PNG
      </p>
    </div>
  );
}
