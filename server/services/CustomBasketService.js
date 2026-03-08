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
  async cancelBasket(basketId, userId) {
    const basket = await CustomBasket.findOneAndDelete({
      _id: basketId,
      user: userId,
    });

    if (!basket) {
      throw new Error("Không tìm thấy giỏ quà");
    }

    return { message: "Đã hủy giỏ quà" };
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
  async updatePackaging(packagingId, updateData) {
    const packaging = await Packaging.findById(packagingId);
    if (!packaging) {
      throw new Error("Không tìm thấy loại bao bì");
    }

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
