const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

/**
 * Order Service
 * Xử lý business logic liên quan đến đơn hàng
 */
class OrderService {
  /**
   * Lấy tất cả đơn hàng với filter
   */
  async getAllOrders(filters = {}) {
    try {
      const orders = await Order.find(filters)
        .populate("customer", "fullname email phone")
        .populate("cartItems.product")
        .sort({ createdAt: -1 });
      return orders;
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
      if (!item.product || !item.quantity) {
        throw new Error("Thông tin sản phẩm trong giỏ hàng không hợp lệ");
      }

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
      });
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
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: -item.quantity },
        });
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
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: item.quantity },
        });
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
