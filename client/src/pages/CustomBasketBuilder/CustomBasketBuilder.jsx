import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPackagingTypes } from "../../services/customBasketService";
import {
  getLocalBasket,
  createLocalBasket,
  addItemToLocalBasket,
  removeItemFromLocalBasket,
  updateLocalBasketItemQuantity,
  completeLocalBasket,
  clearLocalBasket,
  formatPrice,
} from "../../services/localBasketService";
import { fetchProducts } from "../../services/productService";
import { addToCart } from "../../services/cartService";
import { toast } from "react-toastify";
import "./CustomBasketBuilder.css";

const CustomBasketBuilder = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [step, setStep] = useState(1); // 1: Select Packaging, 2: Add Items
  const [packagingTypes, setPackagingTypes] = useState([]);
  const [selectedPackaging, setSelectedPackaging] = useState(null);
  const [basket, setBasket] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [basketName, setBasketName] = useState("Giỏ quà tùy chỉnh");

  useEffect(() => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để tạo giỏ quà tùy chỉnh");
      navigate("/login");
      return;
    }

    // Load from localStorage if exists
    const existingBasket = getLocalBasket();
    if (existingBasket) {
      setBasket(existingBasket);
      setSelectedPackaging(existingBasket.packaging);
      setBasketName(existingBasket.name || "Giỏ quà tùy chỉnh");
      setStep(2);
    } else {
      loadPackagingTypes();
    }

    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadPackagingTypes = async () => {
    try {
      setLoading(true);
      const response = await getPackagingTypes();
      setPackagingTypes(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách bao bì");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetchProducts({ limit: 100 });
      const productList = response.products || [];
      setProducts(Array.isArray(productList) ? productList : []);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleSelectPackaging = (packaging) => {
    try {
      const newBasket = createLocalBasket(packaging, basketName);
      setBasket(newBasket);
      setSelectedPackaging(packaging);
      setStep(2);
      toast.success("Đã chọn bao bì thành công");
    } catch (error) {
      console.error(error);
      toast.error("Không thể tạo giỏ quà");
    }
  };

  const handleAddProduct = (product) => {
    if (!basket) return;

    try {
      const updatedBasket = addItemToLocalBasket(product, 1);
      setBasket(updatedBasket);
      toast.success(`Đã thêm ${product.name}`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Không thể thêm sản phẩm");
    }
  };

  const handleRemoveProduct = (productId) => {
    if (!basket) return;

    try {
      const updatedBasket = removeItemFromLocalBasket(productId);
      setBasket(updatedBasket);
      toast.success("Đã xóa sản phẩm");
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (!basket || quantity < 0) return;

    try {
      const updatedBasket = updateLocalBasketItemQuantity(productId, quantity);
      setBasket(updatedBasket);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Không thể cập nhật số lượng");
    }
  };

  const handleCompleteAndAddToCart = () => {
    if (!basket) return;

    try {
      setLoading(true);

      // Complete basket (validates minimum 3 items)
      const completedBasket = completeLocalBasket(basketName);

      // Add to cart with full basket data (no basketId, send entire basket)
      const customProduct = {
        _id: `custom-${completedBasket.id}`,
        name: basketName,
        price: completedBasket.totalPrice,
        discountPrice: null,
        imageUrl: selectedPackaging?.imageUrl || "",
        quantity: 1, // Custom basket is always 1 unit
        isCustomBasket: true,
        basketData: completedBasket, // ✅ Send full basket data instead of basketId
      };

      addToCart(customProduct, 1);

      // Clear localStorage after adding to cart
      clearLocalBasket();

      toast.success("Đã thêm giỏ quà vào giỏ hàng!");
      navigate("/cart");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Không thể hoàn thành giỏ quà");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (basket) {
      clearLocalBasket();
      toast.info("Đã hủy giỏ quà");
    }
    navigate("/");
  };

  const getTotalItems = () => {
    if (!basket) return 0;
    return basket.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCapacityPercentage = () => {
    if (!selectedPackaging) return 0;
    return (getTotalItems() / selectedPackaging.capacity) * 100;
  };

  const isProductInBasket = (productId) => {
    return basket?.items?.some((item) => item.product._id === productId);
  };

  if (loading && !basket) {
    return (
      <div className="custom-basket-loading">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="custom-basket-page">
      {/* Header */}
      <div className="custom-basket-header">
        <h1>Tạo Giỏ Quà Tùy Chỉnh</h1>
        <p>Chọn bao bì và sản phẩm để tạo món quà Tết độc đáo</p>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`step ${step >= 1 ? "active" : ""}`}>
          <span className="step-number">1</span>
          <span className="step-label">Chọn bao bì</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>
          <span className="step-number">2</span>
          <span className="step-label">Thêm sản phẩm</span>
        </div>
      </div>

      {/* Step 1: Select Packaging */}
      {step === 1 && (
        <div className="packaging-selection">
          <h2>Chọn loại bao bì</h2>
          <div className="packaging-grid">
            {packagingTypes.map((packaging) => (
              <div
                key={packaging._id}
                className="packaging-card"
                onClick={() => handleSelectPackaging(packaging)}
              >
                <div className="packaging-image">
                  {packaging.imageUrl ? (
                    <img src={packaging.imageUrl} alt={packaging.name} />
                  ) : (
                    <div className="packaging-placeholder">📦</div>
                  )}
                </div>
                <h3>{packaging.name}</h3>
                <p className="packaging-desc">{packaging.description}</p>
                <div className="packaging-info">
                  <span className="packaging-capacity">
                    Sức chứa: {packaging.capacity} sản phẩm
                  </span>
                  <span className="packaging-price">
                    {formatPrice(packaging.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Add Items */}
      {step === 2 && basket && (
        <div className="basket-builder">
          <div className="builder-content">
            {/* Left: Product Selection */}
            <div className="product-selection">
              <h2>Chọn sản phẩm</h2>
              <div className="product-grid">
                {products
                  .filter((p) => p.quantity > 0)
                  .map((product) => (
                    <div
                      key={product._id}
                      className={`product-card ${isProductInBasket(product._id) ? "in-basket" : ""}`}
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                      />
                      <h4>{product.name}</h4>
                      <p className="product-price">
                        {formatPrice(product.discountPrice || product.price)}
                      </p>
                      <button
                        onClick={() => handleAddProduct(product)}
                        disabled={isProductInBasket(product._id)}
                        className="btn-add-product"
                      >
                        {isProductInBasket(product._id)
                          ? "✓ Đã thêm"
                          : "+ Thêm"}
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Right: Basket Preview */}
            <div className="basket-preview">
              <div className="basket-sticky">
                <h3>Giỏ quà của bạn</h3>

                {/* Basket Name Input */}
                <div className="basket-name-input">
                  <label>Tên giỏ quà</label>
                  <input
                    type="text"
                    value={basketName}
                    onChange={(e) => setBasketName(e.target.value)}
                    placeholder="Giỏ quà tùy chỉnh"
                  />
                </div>

                {/* Packaging Info */}
                <div className="basket-packaging">
                  <div className="packaging-info-line">
                    <span>Bao bì: {selectedPackaging?.name}</span>
                    <span>{formatPrice(selectedPackaging?.price || 0)}</span>
                  </div>
                </div>

                {/* Capacity Progress */}
                <div className="capacity-section">
                  <div className="capacity-header">
                    <span>Sức chứa</span>
                    <span>
                      {getTotalItems()} / {selectedPackaging?.capacity}
                    </span>
                  </div>
                  <div className="capacity-bar">
                    <div
                      className="capacity-fill"
                      style={{
                        width: `${Math.min(getCapacityPercentage(), 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Items List */}
                <div className="basket-items">
                  {basket.items.length === 0 ? (
                    <div className="empty-basket">
                      <p>Chưa có sản phẩm nào</p>
                      <p className="hint">Chọn ít nhất 3 sản phẩm</p>
                    </div>
                  ) : (
                    basket.items.map((item) => (
                      <div key={item.product._id} className="basket-item">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="item-image"
                        />
                        <div className="item-info">
                          <h5>{item.product.name}</h5>
                          <span className="item-price">
                            {formatPrice(item.priceAtTime)}
                          </span>
                        </div>
                        <div className="item-actions">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.quantity - 1,
                              )
                            }
                            className="btn-qty"
                          >
                            −
                          </button>
                          <span className="item-qty">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.quantity + 1,
                              )
                            }
                            className="btn-qty"
                          >
                            +
                          </button>
                          <button
                            onClick={() =>
                              handleRemoveProduct(item.product._id)
                            }
                            className="btn-remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Total Price */}
                <div className="basket-total">
                  <span>Tổng cộng</span>
                  <span className="total-price">
                    {formatPrice(basket.totalPrice)}
                  </span>
                </div>

                {/* Minimum Items Warning */}
                {getTotalItems() < 3 && (
                  <div className="warning-message">
                    ⚠️ Cần thêm {3 - getTotalItems()} sản phẩm nữa
                  </div>
                )}

                {/* Action Buttons */}
                <div className="basket-actions">
                  <button className="btn-cancel" onClick={handleCancel}>
                    Hủy
                  </button>
                  <button
                    className="btn-complete"
                    onClick={handleCompleteAndAddToCart}
                    disabled={getTotalItems() < 3 || loading}
                  >
                    {loading ? "Đang xử lý..." : "Hoàn thành & Thêm vào giỏ"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomBasketBuilder;
