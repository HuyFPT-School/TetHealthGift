const Product = require("../models/ProductModel");
const CustomBasket = require("../models/CustomBasketModel");
const Order = require("../models/OrderModel");

/**
 * Product Service
 * Xử lý business logic liên quan đến sản phẩm
 */
class ProductService {
  /**
   * Lấy tất cả sản phẩm với phân trang
   */
  async getAllProducts(filters = {}, options = {}) {
    try {
      const { page = 1, limit = 10, search, category } = options;

      // Build query
      let query = { ...filters };

      // Add search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ];
      }

      // Add category filter
      if (category) {
        query.category = category;
      }

      // Calculate skip
      const skip = (page - 1) * limit;

      // Get total count
      const total = await Product.countDocuments(query);

      // Get paginated products
      const products = await Product.find(query)
        .populate("category")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      return {
        products,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách sản phẩm: ${error.message}`);
    }
  }

  /**
   * Lấy sản phẩm theo ID
   */
  async getProductById(productId) {
    try {
      const product = await Product.findById(productId)
        .populate("category")
        .populate("comments.author", "fullname avatar");

      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      return product;
    } catch (error) {
      throw new Error(`Lỗi khi lấy sản phẩm: ${error.message}`);
    }
  }

  /**
   * Tìm kiếm sản phẩm
   */
  async searchProducts(keyword, filters = {}) {
    try {
      const searchQuery = {
        ...filters,
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { tags: { $regex: keyword, $options: "i" } },
        ],
      };

      const products = await Product.find(searchQuery).populate("category");
      return products;
    } catch (error) {
      throw new Error(`Lỗi khi tìm kiếm sản phẩm: ${error.message}`);
    }
  }

  /**
   * Lấy sản phẩm theo category
   */
  async getProductsByCategory(categoryId) {
    try {
      const products = await Product.find({ category: categoryId }).populate(
        "category",
      );
      return products;
    } catch (error) {
      throw new Error(`Lỗi khi lấy sản phẩm theo danh mục: ${error.message}`);
    }
  }

  /**
   * Lấy sản phẩm featured
   */
  async getFeaturedProducts(limit = 10) {
    try {
      const products = await Product.find({ isFeatured: true })
        .populate("category")
        .limit(limit)
        .sort({ createdAt: -1 });
      return products;
    } catch (error) {
      throw new Error(`Lỗi khi lấy sản phẩm nổi bật: ${error.message}`);
    }
  }

  /**
   * Tạo sản phẩm mới
   */
  async createProduct(productData) {
    try {
      const {
        name,
        price,
        description,
        category,
        content,
        isFeatured,
        tags,
        discountPrice,
        quantity,
        imageUrl,
      } = productData;

      // Validate required fields
      if (!name || !price || !category || quantity === undefined || !imageUrl) {
        throw new Error("Thiếu thông tin bắt buộc");
      }

      // Validate price
      if (price <= 0) {
        throw new Error("Giá sản phẩm phải lớn hơn 0");
      }

      // Validate discount price
      if (discountPrice && discountPrice >= price) {
        throw new Error("Giá khuyến mãi phải nhỏ hơn giá gốc");
      }

      // Validate quantity
      if (quantity < 0) {
        throw new Error("Số lượng không được âm");
      }

      const product = new Product({
        name,
        price,
        description,
        category,
        content,
        isFeatured: isFeatured || false,
        tags: tags || [],
        discountPrice,
        quantity,
        imageUrl,
      });

      await product.save();
      await product.populate("category");

      return product;
    } catch (error) {
      throw new Error(`Lỗi khi tạo sản phẩm: ${error.message}`);
    }
  }

  /**
   * Cập nhật sản phẩm
   */
  async updateProduct(productId, updateData) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      // Validate price if updated
      if (updateData.price !== undefined && updateData.price <= 0) {
        throw new Error("Giá sản phẩm phải lớn hơn 0");
      }

      // Validate discount price — kiểm tra cả discountPrice cũ nếu chỉ cập nhật price
      const finalPrice = updateData.price !== undefined ? updateData.price : product.price;
      const finalDiscountPrice = updateData.discountPrice !== undefined ? updateData.discountPrice : product.discountPrice;

      if (finalDiscountPrice && finalDiscountPrice >= finalPrice) {
        throw new Error(
          `Giá khuyến mãi (${finalDiscountPrice.toLocaleString()}đ) phải nhỏ hơn giá gốc (${finalPrice.toLocaleString()}đ). Vui lòng cập nhật lại giá khuyến mãi.`
        );
      }

      // Validate quantity
      if (updateData.quantity !== undefined && updateData.quantity < 0) {
        throw new Error("Số lượng không được âm");
      }

      Object.assign(product, updateData);
      await product.save();
      await product.populate("category");

      return product;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật sản phẩm: ${error.message}`);
    }
  }

  /**
   * Cập nhật số lượng sản phẩm
   */
  async updateStock(productId, quantityChange) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      const newQuantity = product.quantity + quantityChange;
      if (newQuantity < 0) {
        throw new Error("Số lượng tồn kho không đủ");
      }

      product.quantity = newQuantity;
      await product.save();

      return product;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật tồn kho: ${error.message}`);
    }
  }

  /**
   * Xóa sản phẩm
   * Kiểm tra ràng buộc với CustomBasket (draft) trước khi xóa
   */
  async deleteProduct(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      // Kiểm tra sản phẩm đang nằm trong giỏ quà nháp
      const draftBasketCount = await CustomBasket.countDocuments({
        "items.product": productId,
        status: { $in: ["draft", "completed", "added_to_cart"] },
      });
      if (draftBasketCount > 0) {
        throw new Error(
          `Không thể xóa sản phẩm này vì có ${draftBasketCount} giỏ quà đang sử dụng. ` +
          `Hãy đặt sản phẩm sang trạng thái ẩn thay vì xóa.`
        );
      }

      // Kiểm tra sản phẩm đang nằm trong đơn hàng chưa hoàn thành
      const activeOrderCount = await Order.countDocuments({
        "cartItems.product": productId,
        orderStatus: { $in: ["processing", "shipped"] },
      });
      if (activeOrderCount > 0) {
        throw new Error(
          `Không thể xóa sản phẩm này vì có ${activeOrderCount} đơn hàng đang xử lý hoặc đang giao chứa sản phẩm này.`
        );
      }

      await Product.findByIdAndDelete(productId);
      return { message: "Xóa sản phẩm thành công" };
    } catch (error) {
      throw new Error(`Lỗi khi xóa sản phẩm: ${error.message}`);
    }
  }

  /**
   * Thêm comment vào sản phẩm
   */
  async addComment(productId, commentData) {
    try {
      const { rating, content, author } = commentData;

      // Validate
      if (!rating || !content || !author) {
        throw new Error("Thiếu thông tin đánh giá");
      }

      if (rating < 1 || rating > 5) {
        throw new Error("Rating phải từ 1 đến 5");
      }

      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      product.comments.push({ rating, content, author });
      await product.save();
      await product.populate("comments.author", "fullname avatar");

      return product;
    } catch (error) {
      throw new Error(`Lỗi khi thêm đánh giá: ${error.message}`);
    }
  }

  /**
   * Xóa comment
   */
  async deleteComment(productId, commentId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      product.comments = product.comments.filter(
        (comment) => comment._id.toString() !== commentId,
      );

      await product.save();
      return product;
    } catch (error) {
      throw new Error(`Lỗi khi xóa đánh giá: ${error.message}`);
    }
  }

  /**
   * Lấy sản phẩm liên quan (cùng category)
   */
  async getRelatedProducts(productId, limit = 5) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      const relatedProducts = await Product.find({
        category: product.category,
        _id: { $ne: productId },
      })
        .populate("category")
        .limit(limit)
        .sort({ createdAt: -1 });

      return relatedProducts;
    } catch (error) {
      throw new Error(`Lỗi khi lấy sản phẩm liên quan: ${error.message}`);
    }
  }

  /**
   * Kiểm tra tồn kho
   */
  async checkStock(productId, quantity) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      return product.quantity >= quantity;
    } catch (error) {
      throw new Error(`Lỗi khi kiểm tra tồn kho: ${error.message}`);
    }
  }
}

module.exports = new ProductService();
