const CustomBasket = require("../models/CustomBasketModel");
const Product = require("../models/ProductModel");
const Packaging = require("../models/PackagingModel");

class CustomBasketService {
  // Get all available packaging types
  async getPackagingTypes() {
    return await Packaging.find({ isAvailable: true }).sort({ price: 1 });
  }

  // Create a new custom basket
  async createBasket(userId, packagingId) {
    const packaging = await Packaging.findById(packagingId);
    if (!packaging || !packaging.isAvailable) {
      throw new Error("Loại bao bì không khả dụng");
    }

    const basket = new CustomBasket({
      user: userId,
      packaging: packagingId,
      items: [],
      status: "draft",
    });

    basket.setReservation();
    await basket.save();

    return await basket.populate(["packaging", "items.product"]);
  }

  // Get basket by ID
  async getBasket(basketId, userId) {
    const basket = await CustomBasket.findOne({
      _id: basketId,
      user: userId,
    }).populate(["packaging", "items.product"]);

    if (!basket) {
      throw new Error("Không tìm thấy giỏ quà");
    }

    // Check if reservation expired
    if (basket.reservedUntil && basket.reservedUntil < new Date()) {
      basket.status = "expired";
    }

    return basket;
  }

  // Add item to basket
  async addItem(basketId, userId, productId, quantity = 1) {
    const basket = await this.getBasket(basketId, userId);

    if (basket.status !== "draft") {
      throw new Error("Không thể chỉnh sửa giỏ quà này");
    }

    // Check if reservation expired
    if (basket.reservedUntil && basket.reservedUntil < new Date()) {
      throw new Error("Thời gian giữ chỗ đã hết. Vui lòng tạo giỏ quà mới.");
    }

    // Get product and check stock
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }

    if (product.quantity < quantity) {
      throw new Error(`Sản phẩm "${product.name}" không đủ số lượng trong kho`);
    }

    // Calculate total items after adding
    const currentTotal = basket.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const newTotal = currentTotal + quantity;

    await basket.populate("packaging");
    if (newTotal > basket.packaging.capacity) {
      throw new Error(
        `Giỏ quà đã đầy. Sức chứa tối đa: ${basket.packaging.capacity} sản phẩm`,
      );
    }

    // Check if item already exists in basket
    const existingItem = basket.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Use discounted price if available
      const price = product.discountPrice || product.price;
      basket.items.push({
        product: productId,
        quantity,
        priceAtTime: price,
      });
    }

    // Extend reservation
    basket.setReservation();
    await basket.save();

    return await basket.populate(["packaging", "items.product"]);
  }

  // Remove item from basket
  async removeItem(basketId, userId, productId) {
    const basket = await this.getBasket(basketId, userId);

    if (basket.status !== "draft") {
      throw new Error("Không thể chỉnh sửa giỏ quà này");
    }

    basket.items = basket.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await basket.save();
    return await basket.populate(["packaging", "items.product"]);
  }

  // Update item quantity
  async updateItemQuantity(basketId, userId, productId, quantity) {
    if (quantity <= 0) {
      return await this.removeItem(basketId, userId, productId);
    }

    const basket = await this.getBasket(basketId, userId);

    if (basket.status !== "draft") {
      throw new Error("Không thể chỉnh sửa giỏ quà này");
    }

    // Check stock
    const product = await Product.findById(productId);
    if (!product || product.quantity < quantity) {
      throw new Error("Số lượng vượt quá tồn kho");
    }

    const item = basket.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      throw new Error("Sản phẩm không có trong giỏ quà");
    }

    // Check capacity
    const otherItemsTotal = basket.items
      .filter((i) => i.product.toString() !== productId)
      .reduce((sum, i) => sum + i.quantity, 0);

    await basket.populate("packaging");
    if (otherItemsTotal + quantity > basket.packaging.capacity) {
      throw new Error(
        `Vượt quá sức chứa của giỏ quà (${basket.packaging.capacity} sản phẩm)`,
      );
    }

    item.quantity = quantity;
    basket.setReservation();
    await basket.save();

    return await basket.populate(["packaging", "items.product"]);
  }

  // Complete basket and validate (BR-02)
  async completeBasket(basketId, userId, customName) {
    const basket = await this.getBasket(basketId, userId);

    if (basket.status !== "draft") {
      throw new Error("Giỏ quà đã được hoàn thành");
    }

    // Check minimum composition (BR-02)
    if (!basket.meetsMinimumComposition()) {
      throw new Error("Giỏ quà phải có ít nhất 3 sản phẩm");
    }

    // Check if within capacity
    if (!(await basket.isWithinCapacity())) {
      throw new Error("Giỏ quà vượt quá sức chứa");
    }

    // Validate stock for all items
    await basket.populate("items.product");
    for (const item of basket.items) {
      if (item.product.quantity < item.quantity) {
        throw new Error(`Sản phẩm "${item.product.name}" không đủ số lượng`);
      }
    }

    basket.status = "completed";
    if (customName) {
      basket.name = customName;
    }

    await basket.save();
    return basket;
  }

  // Cancel/delete basket
  // Chỉ cho phép hủy basket ở trạng thái draft
  async cancelBasket(basketId, userId) {
    const basket = await CustomBasket.findOne({ _id: basketId, user: userId });

    if (!basket) {
      throw new Error("Không tìm thấy giỏ quà");
    }

    // Không xóa basket đã được thêm vào giỏ hàng / thanh toán
    if (basket.status === "added_to_cart") {
      throw new Error(
        "Giỏ quà này đã được thêm vào giỏ hàng. Vui lòng xóa khỏi giỏ hàng trước khi hủy."
      );
    }

    await basket.deleteOne();
    return { message: "Dã hủy giỏ quà" };
  }

  // Get user's baskets
  async getUserBaskets(userId, status = null) {
    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    return await CustomBasket.find(query)
      .populate(["packaging", "items.product"])
      .sort({ createdAt: -1 });
  }

  // ============ ADMIN - Packaging Management ============

  // Get all packaging types (including unavailable)
  async getAllPackaging() {
    return await Packaging.find().sort({ type: 1, price: 1 });
  }

  // Create new packaging type
  async createPackaging(packagingData) {
    const { name, type, description, price, capacity, imageUrl, dimensions } =
      packagingData;

    // Validate required fields
    if (!name || !type || !price || !capacity) {
      throw new Error("Vui lòng điền đầy đủ thông tin bao bì");
    }

    const packaging = new Packaging({
      name,
      type,
      description,
      price,
      capacity,
      imageUrl,
      dimensions,
      isAvailable: true,
    });

    await packaging.save();
    return packaging;
  }

  // Update packaging type
  // Khi thay đổi price/capacity: đồng bộ với các CustomBasket đang draft
  async updatePackaging(packagingId, updateData) {
    const packaging = await Packaging.findById(packagingId);
    if (!packaging) {
      throw new Error("Không tìm thấy loại bao bì");
    }

    const oldCapacity = packaging.capacity;
    const isPriceChanging = updateData.price !== undefined && updateData.price !== packaging.price;
    const isCapacityDecreasing = updateData.capacity !== undefined && updateData.capacity < oldCapacity;

    // Update allowed fields
    const allowedFields = [
      "name",
      "type",
      "description",
      "price",
      "capacity",
      "imageUrl",
      "dimensions",
      "isAvailable",
    ];
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        packaging[field] = updateData[field];
      }
    });

    await packaging.save();

    // Khi giảm capacity: invalidate các draft basket đang vượt capacity mới
    if (isCapacityDecreasing) {
      const newCapacity = updateData.capacity;
      const affectedBaskets = await CustomBasket.find({
        packaging: packagingId,
        status: "draft",
      });

      for (const basket of affectedBaskets) {
        const totalItems = basket.items.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > newCapacity) {
          // Giảm items xuống bằng cách xóa bớt item cuối cho đến khi vừa capacity
          let current = totalItems;
          while (current > newCapacity && basket.items.length > 0) {
            const lastItem = basket.items[basket.items.length - 1];
            const overflow = current - newCapacity;
            if (lastItem.quantity <= overflow) {
              current -= lastItem.quantity;
              basket.items.pop();
            } else {
              lastItem.quantity -= overflow;
              current = newCapacity;
            }
          }
          await basket.save();
        }
      }
    }

    // Khi thay đổi price: recalculate totalPrice cho các draft basket
    if (isPriceChanging) {
      const draftBaskets = await CustomBasket.find({
        packaging: packagingId,
        status: "draft",
      });

      for (const basket of draftBaskets) {
        // Mark packaging as modified để trigger pre-save hook tính lại totalPrice
        basket.markModified("packaging");
        await basket.save();
      }
    }

    return packaging;
  }

  // Delete packaging type
  async deletePackaging(packagingId) {
    const packaging = await Packaging.findById(packagingId);
    if (!packaging) {
      throw new Error("Không tìm thấy loại bao bì");
    }

    // Check if any baskets use this packaging
    const basketsUsingPackaging = await CustomBasket.countDocuments({
      packaging: packagingId,
    });

    if (basketsUsingPackaging > 0) {
      throw new Error(
        `Không thể xóa loại bao bì này vì có ${basketsUsingPackaging} giỏ quà đang sử dụng. Hãy đặt trạng thái 'Không khả dụng' thay vì xóa.`,
      );
    }

    await Packaging.findByIdAndDelete(packagingId);
    return {
      message: "Xóa loại bao bì thành công",
    };
  }
}

module.exports = new CustomBasketService();
