const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

/**
 * Order Service
 * Xử lý business logic liên quan đến đơn hàng
 */
class OrderService {
  /**
   * Lấy tất cả đơn hàng với filter và pagination
   */
  async getAllOrders(filters = {}, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;

      // Clean filters - remove undefined/null/empty values
      const cleanFilter = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, v]) => v !== undefined && v !== null && v !== "",
        ),
      );

      // Calculate skip
      const skip = (page - 1) * limit;

      // Get total count
      const total = await Order.countDocuments(cleanFilter);

      // Get paginated orders
      const orders = await Order.find(cleanFilter)
        .populate("customer", "fullname email phone")
        .populate("cartItems.product")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      return {
        orders,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách đơn hàng: ${error.message}`);
    }
  }

  /**
   * Lấy đơn hàng theo ID
   */
  async getOrderById(orderId) {
    try {
      const order = await Order.findById(orderId)
        .populate("customer", "fullname email phone")
        .populate("cartItems.product");

      if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      return order;
    } catch (error) {
      throw new Error(`Lỗi khi lấy đơn hàng: ${error.message}`);
    }
  }

  /**
   * Lấy đơn hàng của customer
   */
  async getOrdersByCustomer(customerId) {
    try {
      const orders = await Order.find({ customer: customerId })
        .populate("cartItems.product")
        .sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      throw new Error(`Lỗi khi lấy đơn hàng của khách hàng: ${error.message}`);
    }
  }

  /**
   * Validate và xử lý cartItems
   */
  async processCartItems(cartItems) {
    const processedItems = [];
    let totalAmount = 0;

    for (const item of cartItems) {
      const isCustom = Boolean(item.isCustomBasket || item.basketData);

      // Validate based on item type
      if (!isCustom && (!item.product || !item.quantity)) {
        throw new Error("Thông tin sản phẩm trong giỏ hàng không hợp lệ");
      }

      if (isCustom) {
        if (!item.basketData) {
          throw new Error(
            "Dữ liệu giỏ quà tùy chỉnh bị thiếu hoặc không hợp lệ",
          );
        }
        const basketData = item.basketData;

        // Validate stock for all items in custom basket
        if (!basketData.items || !Array.isArray(basketData.items)) {
          throw new Error("Dữ liệu sản phẩm trong giỏ quà bị thiết hợp lệ");
        }

        for (const basketItem of basketData.items) {
          // Handle both cases simpler: fallback to basketItem.product if _id is undefined
          const productId = basketItem.product?._id || basketItem.product;

          const product = await Product.findById(productId);
          if (!product) {
            const productName = basketItem.product?.name || "Unknown";
            throw new Error(`Sản phẩm "${productName}" không tồn tại`);
          }
          if (product.quantity < basketItem.quantity) {
            throw new Error(
              `Sản phẩm "${product.name}" trong giỏ quà không đủ số lượng`,
            );
          }
        }

        const itemTotal = (basketData.totalPrice || 0) * item.quantity;
        totalAmount += itemTotal;

        const newItem = {
          name: basketData.name || "Giỏ quà tùy chỉnh",
          price: basketData.totalPrice,
          quantity: item.quantity,
          imageUrl: basketData.packaging?.imageUrl || "",
          isCustomBasket: true,
          basketDetails: {
            packaging: {
              name: basketData.packaging?.name,
              price: basketData.packaging?.price,
            },
            items: basketData.items.map((bi) => {
              const productId = bi.product?._id || bi.product;
              const productName = bi.product?.name || "Product";
              return {
                productId: productId,
                name: productName,
                quantity: bi.quantity,
                price: bi.priceAtTime,
              };
            }),
          },
        };
        processedItems.push(newItem);
      } else {
        // Regular product
        // Mongoose might fail if item.product is a custom-local string but it bypasses the if condition
        // We added the isCustomId check above, so it should be fine.
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Không tìm thấy sản phẩm có ID: ${item.product}`);
        }

        // Kiểm tra số lượng tồn kho
        if (product.quantity < item.quantity) {
          throw new Error(
            `Sản phẩm "${product.name}" không đủ số lượng. Còn lại: ${product.quantity}`,
          );
        }

        // Tính giá (ưu tiên discountPrice)
        const price = product.discountPrice || product.price;
        const itemTotal = price * item.quantity;
        totalAmount += itemTotal;

        processedItems.push({
          product: product._id,
          name: product.name,
          price: price,
          quantity: item.quantity,
          imageUrl: product.imageUrl || "",
        });
      }
    }

    return { processedItems, totalAmount };
  }

  /**
   * Tạo đơn hàng mới
   */
  async createOrder(orderData) {
    try {
      const {
        customer,
        cartItems,
        shippingAddress,
        phone,
        note,
        paymentMethod,
      } = orderData;

      // Validate và xử lý cartItems
      const { processedItems, totalAmount } =
        await this.processCartItems(cartItems);

      // Tạo đơn hàng
      const order = new Order({
        customer,
        cartItems: processedItems,
        shippingAddress,
        phone,
        note,
        totalAmount,
        paymentMethod: paymentMethod || "cod",
        paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
        orderStatus: "processing",
      });

      await order.save();

      // Giảm số lượng sản phẩm trong kho
      await this.updateProductStock(processedItems);

      // Populate thông tin
      await order.populate("customer", "fullname email phone");
      await order.populate("cartItems.product");

      return order;
    } catch (error) {
      throw new Error(`Lỗi khi tạo đơn hàng: ${error.message}`);
    }
  }

  /**
   * Cập nhật stock sản phẩm sau khi tạo order
   */
  async updateProductStock(cartItems) {
    try {
      for (const item of cartItems) {
        if (item.isCustomBasket && item.basketDetails) {
          // Update stock for all items in custom basket
          for (const basketItem of item.basketDetails.items) {
            await Product.findByIdAndUpdate(basketItem.productId, {
              $inc: { quantity: -(basketItem.quantity * item.quantity) },
            });
          }
        } else if (item.product) {
          // Regular product
          await Product.findByIdAndUpdate(item.product, {
            $inc: { quantity: -item.quantity },
          });
        }
      }
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật tồn kho: ${error.message}`);
    }
  }

  /**
   * Hoàn trả stock khi hủy order
   */
  async restoreProductStock(cartItems) {
    try {
      for (const item of cartItems) {
        if (item.isCustomBasket && item.basketDetails) {
          // Restore stock for all items in custom basket
          for (const basketItem of item.basketDetails.items) {
            await Product.findByIdAndUpdate(basketItem.productId, {
              $inc: { quantity: basketItem.quantity * item.quantity },
            });
          }
        } else if (item.product) {
          // Regular product
          await Product.findByIdAndUpdate(item.product, {
            $inc: { quantity: item.quantity },
          });
        }
      }
    } catch (error) {
      throw new Error(`Lỗi khi hoàn trả tồn kho: ${error.message}`);
    }
  }

  /**
   * Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(orderId, orderStatus) {
    try {
      const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
      if (!validStatuses.includes(orderStatus)) {
        throw new Error("Trạng thái đơn hàng không hợp lệ");
      }

      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      // Prevent shipping if online payment (VNPay/MoMo) not completed
      if (orderStatus === "shipped") {
        const isOnlinePayment =
          order.paymentMethod === "vnpay" || order.paymentMethod === "momo";
        const isNotPaid = order.paymentStatus !== "paid";

        if (isOnlinePayment && isNotPaid) {
          const statusText =
            order.paymentStatus === "failed"
              ? "thanh toán thất bại"
              : "chưa thanh toán";
          throw new Error(
            `Không thể chuyển sang trạng thái "Đang giao" vì đơn hàng ${statusText}. Vui lòng đợi khách thanh toán thành công.`,
          );
        }
      }

      // Only allow delivered status if current status is shipped (customer confirmation only)
      if (orderStatus === "delivered" && order.orderStatus !== "shipped") {
        throw new Error(
          'Chỉ có thể chuyển sang trạng thái "Hoàn thành" khi đơn hàng đang ở trạng thái "Đang giao".',
        );
      }

      // Nếu hủy đơn, hoàn trả tồn kho
      if (orderStatus === "cancelled" && order.orderStatus !== "cancelled") {
        await this.restoreProductStock(order.cartItems);
      }

      order.orderStatus = orderStatus;
      await order.save();

      await order.populate("customer", "fullname email phone");
      await order.populate("cartItems.product");

      return order;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật trạng thái: ${error.message}`);
    }
  }

  /**
   * Hủy đơn hàng
   */
  async cancelOrder(orderId) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      // Kiểm tra xem đơn hàng đã bị hủy chưa
      if (order.orderStatus === "cancelled") {
        throw new Error("Đơn hàng đã bị hủy trước đó");
      }

      // Không thể hủy đơn hàng đã giao hoàn thành
      if (order.orderStatus === "delivered") {
        throw new Error("Không thể hủy đơn hàng đã giao hoàn thành");
      }

      // Cập nhật trạng thái sang cancelled (sẽ tự động hoàn trả tồn kho)
      return await this.updateOrderStatus(orderId, "cancelled");
    } catch (error) {
      throw new Error(`Lỗi khi hủy đơn hàng: ${error.message}`);
    }
  }

  /**
   * Cập nhật trạng thái thanh toán
   */
  async updatePaymentStatus(orderId, paymentStatus, paymentMethod = null) {
    try {
      const validStatuses = ["pending", "paid", "failed"];
      if (!validStatuses.includes(paymentStatus)) {
        throw new Error("Trạng thái thanh toán không hợp lệ");
      }

      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      order.paymentStatus = paymentStatus;
      if (paymentMethod) {
        order.paymentMethod = paymentMethod;
      }

      await order.save();

      await order.populate("customer", "fullname email phone");
      await order.populate("cartItems.product");

      return order;
    } catch (error) {
      throw new Error(
        `Lỗi khi cập nhật trạng thái thanh toán: ${error.message}`,
      );
    }
  }

  /**
   * Xóa đơn hàng
   */
  async deleteOrder(orderId) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      // Hoàn trả tồn kho nếu đơn hàng chưa hủy
      if (order.orderStatus !== "cancelled") {
        await this.restoreProductStock(order.cartItems);
      }

      await Order.findByIdAndDelete(orderId);
      return { message: "Xóa đơn hàng thành công" };
    } catch (error) {
      throw new Error(`Lỗi khi xóa đơn hàng: ${error.message}`);
    }
  }

  /**
   * Thống kê đơn hàng
   */
  async getOrderStatistics() {
    try {
      const stats = await Order.aggregate([
        {
          $group: {
            _id: "$orderStatus",
            count: { $sum: 1 },
            totalRevenue: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0],
              },
            },
          },
        },
      ]);

      return stats;
    } catch (error) {
      throw new Error(`Lỗi khi lấy thống kê: ${error.message}`);
    }
  }
}

module.exports = new OrderService();
