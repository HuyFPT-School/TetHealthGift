// Local Storage Custom Basket Service
// Quản lý custom basket trong localStorage (không cần database)

const BASKET_KEY = "customBasket";

// Tính tổng giá giỏ quà (BR-01: Packaging + Products)
const calculateTotal = (basket) => {
  if (!basket || !basket.packaging) return 0;

  const packagingPrice = basket.packaging.price || 0;
  const itemsTotal = basket.items.reduce((sum, item) => {
    return sum + (item.priceAtTime || 0) * item.quantity;
  }, 0);

  return packagingPrice + itemsTotal;
};

// Get current basket from localStorage
export const getLocalBasket = () => {
  try {
    const basketJson = localStorage.getItem(BASKET_KEY);
    if (!basketJson) return null;

    const basket = JSON.parse(basketJson);

    // Check if reservation expired (BR-03: 15 minutes)
    if (basket.reservedUntil && new Date(basket.reservedUntil) < new Date()) {
      clearLocalBasket();
      return null;
    }

    return basket;
  } catch (error) {
    console.error("Error reading basket from localStorage:", error);
    return null;
  }
};

// Create new basket with packaging
export const createLocalBasket = (
  packaging,
  basketName = "Giỏ quà tùy chỉnh",
) => {
  const basket = {
    id: `local_${Date.now()}`, // Temporary ID
    packaging: packaging,
    items: [],
    name: basketName,
    status: "draft",
    createdAt: new Date().toISOString(),
    reservedUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
  };

  localStorage.setItem(BASKET_KEY, JSON.stringify(basket));
  return basket;
};

// Add item to basket
export const addItemToLocalBasket = (product, quantity = 1) => {
  const basket = getLocalBasket();
  if (!basket) {
    throw new Error("Không tìm thấy giỏ quà. Vui lòng chọn bao bì trước.");
  }

  // Check capacity
  const currentTotal = basket.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  if (currentTotal + quantity > basket.packaging.capacity) {
    throw new Error(
      `Giỏ quà đã đầy. Sức chứa tối đa: ${basket.packaging.capacity} sản phẩm`,
    );
  }

  // Check if product already exists
  const existingIndex = basket.items.findIndex(
    (item) => item.product._id === product._id,
  );

  if (existingIndex >= 0) {
    basket.items[existingIndex].quantity += quantity;
  } else {
    basket.items.push({
      product: product,
      quantity: quantity,
      priceAtTime: product.discountPrice || product.price,
    });
  }

  // Extend reservation
  basket.reservedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  localStorage.setItem(BASKET_KEY, JSON.stringify(basket));
  return basket;
};

// Update item quantity
export const updateLocalBasketItemQuantity = (productId, quantity) => {
  const basket = getLocalBasket();
  if (!basket) {
    throw new Error("Không tìm thấy giỏ quà");
  }

  if (quantity <= 0) {
    return removeItemFromLocalBasket(productId);
  }

  const itemIndex = basket.items.findIndex(
    (item) => item.product._id === productId,
  );
  if (itemIndex === -1) {
    throw new Error("Sản phẩm không có trong giỏ quà");
  }

  // Check capacity
  const otherItemsTotal = basket.items
    .filter((item, idx) => idx !== itemIndex)
    .reduce((sum, item) => sum + item.quantity, 0);

  if (otherItemsTotal + quantity > basket.packaging.capacity) {
    throw new Error(
      `Vượt quá sức chứa của giỏ quà (${basket.packaging.capacity} sản phẩm)`,
    );
  }

  basket.items[itemIndex].quantity = quantity;
  basket.reservedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  localStorage.setItem(BASKET_KEY, JSON.stringify(basket));
  return basket;
};

// Remove item from basket
export const removeItemFromLocalBasket = (productId) => {
  const basket = getLocalBasket();
  if (!basket) {
    throw new Error("Không tìm thấy giỏ quà");
  }

  basket.items = basket.items.filter((item) => item.product._id !== productId);
  localStorage.setItem(BASKET_KEY, JSON.stringify(basket));
  return basket;
};

// Complete basket (validate before adding to cart)
export const completeLocalBasket = (customName) => {
  const basket = getLocalBasket();
  if (!basket) {
    throw new Error("Không tìm thấy giỏ quà");
  }

  // BR-02: Minimum 3 items
  if (basket.items.length < 3) {
    throw new Error("Giỏ quà phải có ít nhất 3 sản phẩm");
  }

  basket.status = "completed";
  if (customName) {
    basket.name = customName;
  }
  basket.totalPrice = calculateTotal(basket);

  localStorage.setItem(BASKET_KEY, JSON.stringify(basket));
  return basket;
};

// Clear basket from localStorage
export const clearLocalBasket = () => {
  localStorage.removeItem(BASKET_KEY);
};

// Update basket name
export const updateLocalBasketName = (name) => {
  const basket = getLocalBasket();
  if (!basket) {
    throw new Error("Không tìm thấy giỏ quà");
  }

  basket.name = name;
  localStorage.setItem(BASKET_KEY, JSON.stringify(basket));
  return basket;
};

// Check if basket meets minimum composition
export const checkBasketValidity = () => {
  const basket = getLocalBasket();
  if (!basket) return { valid: false, message: "Không có giỏ quà" };

  if (basket.items.length < 3) {
    return { valid: false, message: "Giỏ quà phải có ít nhất 3 sản phẩm" };
  }

  const total = basket.items.reduce((sum, item) => sum + item.quantity, 0);
  if (total > basket.packaging.capacity) {
    return { valid: false, message: "Vượt quá sức chứa của giỏ quà" };
  }

  // Check expiration
  if (basket.reservedUntil && new Date(basket.reservedUntil) < new Date()) {
    return { valid: false, message: "Thời gian giữ chỗ đã hết" };
  }

  return { valid: true };
};

// Re-export formatPrice from productService for convenience
export { formatPrice } from "./productService";
