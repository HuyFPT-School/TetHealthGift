// src/services/cartService.js
// Handles localStorage-based cart operations

const CART_KEY = "tet_health_gift_cart";

export const getCart = () => {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse cart data from localStorage", error);
    return [];
  }
};

export const saveCart = (cartItems) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    // Dispatch event to sync UI in real-time
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Failed to save cart data to localStorage", error);
  }
};

export const addToCart = (product, quantity = 1) => {
  const cartItems = getCart();
  const existingItemIndex = cartItems.findIndex(
    (item) => item.product._id === product._id,
  );

  if (existingItemIndex > -1) {
    // Custom baskets can't be duplicated - skip increment
    if (!product.isCustomBasket) {
      cartItems[existingItemIndex].quantity += quantity;
    }
  } else {
    const cartItem = {
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        imageUrl: Array.isArray(product.imageUrl)
          ? product.imageUrl[0]
          : product.imageUrl,
        quantity: product.quantity, // Max stock
      },
      quantity: quantity,
      createdAt: new Date().toISOString(),
    };

    // Add custom basket metadata (full basket data instead of just basketId)
    if (product.isCustomBasket) {
      cartItem.isCustomBasket = true;
      cartItem.basketData = product.basketData; // ✅ Store full basket data
      cartItem.product.isCustomBasket = true;
    }

    cartItems.push(cartItem);
  }

  saveCart(cartItems);
};

export const updateCartQuantity = (productId, quantity) => {
  const cartItems = getCart();
  const existingItemIndex = cartItems.findIndex(
    (item) => item.product._id === productId,
  );

  if (existingItemIndex > -1) {
    if (quantity <= 0) {
      cartItems.splice(existingItemIndex, 1);
    } else {
      cartItems[existingItemIndex].quantity = quantity;
    }
    saveCart(cartItems);
  }
};

export const removeFromCart = (productId) => {
  let cartItems = getCart();
  cartItems = cartItems.filter((item) => item.product._id !== productId);
  saveCart(cartItems);
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cartUpdated"));
};
