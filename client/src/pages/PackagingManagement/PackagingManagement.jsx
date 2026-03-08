import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllPackaging,
  createPackaging,
  updatePackaging,
  deletePackaging,
  formatPrice,
} from "../../services/packagingAdminService";
import axiosInstance from "../../lib/axios";
import "./PackagingManagement.css";

export default function PackagingManagement() {
  const [packagingList, setPackagingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [selectedPackaging, setSelectedPackaging] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "basket",
    description: "",
    price: "",
    capacity: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadPackaging();
  }, []);

  const loadPackaging = async () => {
    try {
      setLoading(true);
      const response = await getAllPackaging();
      setPackagingList(response.data || []);
    } catch (error) {
      console.error("Error loading packaging:", error);
      toast.error("Không thể tải danh sách bao bì");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setFormData({
      name: "",
      type: "basket",
      description: "",
      price: "",
      capacity: "",
      imageUrl: "",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (packaging) => {
    setModalMode("edit");
    setSelectedPackaging(packaging);
    setFormData({
      name: packaging.name,
      type: packaging.type,
      description: packaging.description || "",
      price: packaging.price,
      capacity: packaging.capacity,
      imageUrl: packaging.imageUrl || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPackaging(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    try {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const response = await axiosInstance.post(
        "/api/upload/packaging",
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data && response.data.data && response.data.data.imageUrl) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: response.data.data.imageUrl,
        }));
        toast.success("Upload ảnh thành công");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Không thể upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.name || !formData.price || !formData.capacity) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description?.trim() || "",
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        imageUrl: formData.imageUrl || "",
      };

      console.log("Submitting data:", submitData); // Debug log

      if (modalMode === "create") {
        const response = await createPackaging(submitData);
        console.log("Create response:", response);
        toast.success("Tạo loại bao bì thành công");
      } else {
        console.log("Updating packaging ID:", selectedPackaging._id);
        const response = await updatePackaging(
          selectedPackaging._id,
          submitData,
        );
        console.log("Update response:", response);
        toast.success("Cập nhật loại bao bì thành công");
      }

      handleCloseModal();
      await loadPackaging();
    } catch (error) {
      console.error("Submit error:", error);
      console.error("Error response:", error.response);
      const errorMsg =
        error.response?.data?.message || error.message || "Có lỗi xảy ra";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (packagingId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa loại bao bì này?")) {
      return;
    }

    try {
      setLoading(true);
      await deletePackaging(packagingId);
      toast.success("Xóa loại bao bì thành công");
      loadPackaging();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Không thể xóa loại bao bì");
    } finally {
      setLoading(false);
    }
  };

  const filteredList = packagingList.filter((pkg) => {
    if (filterType === "all") return true;
    return pkg.type === filterType;
  });

  const getTypeLabel = (type) => {
    const labels = {
      basket: "Giỏ tre",
      box: "Hộp gỗ",
      bag: "Túi vải",
    };
    return labels[type] || type;
  };

  if (loading && packagingList.length === 0) {
    return (
      <div className="packaging-management">
        <div className="pm-loading">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="packaging-management">
      <div className="pm-header">
        <div>
          <h1>Quản lý Bao Bì</h1>
          <p className="pm-subtitle">
            Quản lý các loại bao bì cho giỏ quà tự tạo
          </p>
        </div>
        <button className="btn-create" onClick={handleOpenCreateModal}>
          ➕ Thêm Bao Bì Mới
        </button>
      </div>

      {/* Filter */}
      <div className="pm-filters">
        <div className="filter-group">
          <label>Loại bao bì:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="basket">Giỏ tre</option>
            <option value="box">Hộp gỗ</option>
            <option value="bag">Túi vải</option>
          </select>
        </div>
        <div className="pm-stats">
          <span>Tổng: {filteredList.length} loại bao bì</span>
        </div>
      </div>

      {/* Grid */}
      <div className="pm-grid">
        {filteredList.map((pkg) => (
          <div key={pkg._id} className="packaging-card">
            <div className="pkg-image-container">
              {pkg.imageUrl ? (
                <img src={pkg.imageUrl} alt={pkg.name} className="pkg-image" />
              ) : (
                <div className="pkg-no-image">Không có ảnh</div>
              )}
            </div>

            <div className="pkg-content">
              <div className="pkg-header-row">
                <h3 className="pkg-name">{pkg.name}</h3>
                <span className="pkg-type-badge">{getTypeLabel(pkg.type)}</span>
              </div>

              {pkg.description && (
                <p className="pkg-description">{pkg.description}</p>
              )}

              <div className="pkg-details">
                <div className="pkg-detail-item">
                  <span className="label">Sức chứa:</span>
                  <span className="value">{pkg.capacity} sản phẩm</span>
                </div>
                <div className="pkg-detail-item">
                  <span className="label">Giá:</span>
                  <span className="value price">{formatPrice(pkg.price)}</span>
                </div>
              </div>

              <div className="pkg-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleOpenEditModal(pkg)}
                >
                  ✏️ Sửa
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(pkg._id)}
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredList.length === 0 && (
        <div className="pm-empty">
          <p>Không có bao bì nào</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="pm-modal-overlay" onClick={handleCloseModal}>
          <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === "create"
                  ? "Thêm Bao Bì Mới"
                  : "Chỉnh Sửa Bao Bì"}
              </h2>
              <button className="btn-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Tên bao bì <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="VD: Túi Vải Canvas Nhỏ"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Loại <span className="required">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    required
                  >
                    <option value="basket">Giỏ tre</option>
                    <option value="box">Hộp gỗ</option>
                    <option value="bag">Túi vải</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả chi tiết về bao bì..."
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Giá (VNĐ) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="35000"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Sức chứa (sản phẩm) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    placeholder="4"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Hình ảnh</label>
                <div className="image-upload-container">
                  {formData.imageUrl && (
                    <div className="image-preview">
                      <img src={formData.imageUrl} alt="Preview" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                    disabled={uploading}
                  />
                  {uploading && (
                    <p className="uploading-text">Đang upload...</p>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading || uploading}
                >
                  {loading
                    ? "Đang xử lý..."
                    : modalMode === "create"
                      ? "Tạo Bao Bì"
                      : "Cập Nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
