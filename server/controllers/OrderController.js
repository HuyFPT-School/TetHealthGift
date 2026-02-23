const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");

const getAllOrders = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.query;
    let filter = {};

    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const orders = await Order.find(filter)
      .populate("customer", "fullname email phone")
      .populate("cartItems.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("customer", "fullname email phone")
      .populate("cartItems.product");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json({
      message: "Lấy thông tin đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getOrdersByCustomer = async (req, res) => {
  try {
    const customerId = req.user.id;
    const orders = await Order.find({ customer: customerId })
      .populate("cartItems.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { cartItems, note, paymentMethod, shippingAddress, phone } = req.body;
    const customer = req.user.id;

    // Validate cartItems
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        message: "Vui lòng cung cấp giỏ hàng",
      });
    }

    // Lấy thông tin user để lấy địa chỉ và phone mặc định
    const user = await User.findById(customer);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    // Sử dụng địa chỉ và phone từ request hoặc từ user profile
    const finalShippingAddress = shippingAddress || user.address;
    const finalPhone = phone || user.phone;

    if (!finalShippingAddress || !finalPhone) {
      return res.status(400).json({
        message: "Vui lòng cung cấp địa chỉ giao hàng và số điện thoại",
      });
    }

    // Xây dựng cartItems với thông tin đầy đủ từ Product
    const processedCartItems = [];
    let totalAmount = 0;

    for (const item of cartItems) {
      // Validate item structure
      if (!item.product || !item.quantity) {
        return res.status(400).json({
          message: "Mỗi sản phẩm cần có product ID và quantity",
        });
      }

      // Lấy thông tin sản phẩm từ database
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          message: `Không tìm thấy sản phẩm ID: ${item.product}`,
        });
      }

      // Kiểm tra số lượng tồn kho
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${product.name}" không đủ số lượng (còn ${product.quantity})`,
        });
      }

      // Trừ số lượng sản phẩm
      product.quantity -= item.quantity;
      await product.save();

      // Thêm vào giỏ hàng với thông tin đầy đủ từ Product
      processedCartItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      // Tính tổng tiền
      totalAmount += product.price * item.quantity;
    }

    // Tạo đơn hàng mới
    const newOrder = new Order({
      customer,
      cartItems: processedCartItems,
      shippingAddress: finalShippingAddress,
      phone: finalPhone,
      note: note || "",
      totalAmount,
      paymentMethod: paymentMethod || "cod",
    });

    await newOrder.save();
    await newOrder.populate("customer", "fullname email phone");
    await newOrder.populate("cartItems.product");

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        message: "Vui lòng cung cấp trạng thái đơn hàng",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Validate trạng thái chuyển đổi hợp lệ
    const validTransitions = {
      processing: ["shipped", "cancelled"],
      shipped: ["delivered", "cancelled"],
      delivered: [], // Không thể chuyển từ delivered sang trạng thái khác
      cancelled: [], // Không thể chuyển từ cancelled sang trạng thái khác
    };

    const currentStatus = order.orderStatus;
    if (!validTransitions[currentStatus]) {
      return res.status(400).json({
        message: "Trạng thái đơn hàng hiện tại không hợp lệ",
      });
    }

    if (!validTransitions[currentStatus].includes(orderStatus)) {
      return res.status(400).json({
        message: `Không thể chuyển từ trạng thái "${currentStatus}" sang "${orderStatus}"`,
      });
    }

    // Nếu chuyển sang cancelled, hoàn trả số lượng sản phẩm
    if (orderStatus === "cancelled") {
      // Kiểm tra payment status
      if (order.paymentStatus === "paid" && order.paymentMethod !== "cod") {
        return res.status(400).json({
          message:
            "Không thể hủy đơn hàng đã thanh toán online. Cần xử lý hoàn tiền trước",
        });
      }

      for (const item of order.cartItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: item.quantity },
        });
      }

      order.paymentStatus = "failed";
    }

    order.orderStatus = orderStatus;
    await order.save();
    await order.populate("customer", "fullname email phone");
    await order.populate("cartItems.product");

    res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        message: "Vui lòng cung cấp trạng thái thanh toán",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true, runValidators: true },
    )
      .populate("customer", "fullname email phone")
      .populate("cartItems.product");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json({
      message: "Cập nhật trạng thái thanh toán thành công",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra đơn hàng đã bị hủy chưa
    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        message: "Đơn hàng đã bị hủy trước đó",
      });
    }

    // Không thể hủy đơn đã giao hoặc đang vận chuyển
    if (order.orderStatus === "delivered" || order.orderStatus === "shipped") {
      return res.status(400).json({
        message: "Không thể hủy đơn hàng đã giao hoặc đang vận chuyển",
      });
    }

    // Không cho phép hủy đơn hàng đã thanh toán online (cần xử lý hoàn tiền)
    if (order.paymentStatus === "paid" && order.paymentMethod !== "cod") {
      return res.status(400).json({
        message:
          "Không thể hủy đơn hàng đã thanh toán online. Vui lòng liên hệ hỗ trợ để được hoàn tiền",
      });
    }

    // Hoàn trả số lượng sản phẩm vào kho
    for (const item of order.cartItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: item.quantity },
      });
    }

    order.orderStatus = "cancelled";
    order.paymentStatus = "failed";
    await order.save();

    res.status(200).json({
      message: "Hủy đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Chỉ cho phép xóa đơn hàng đã hủy hoặc đã giao
    if (
      order.orderStatus !== "cancelled" &&
      order.orderStatus !== "delivered"
    ) {
      return res.status(400).json({
        message: "Chỉ có thể xóa đơn hàng đã hủy hoặc đã giao",
      });
    }

    // Nếu đơn hàng chưa bị hủy và chưa giao, hoàn trả số lượng sản phẩm
    if (order.orderStatus === "processing" || order.orderStatus === "shipped") {
      for (const item of order.cartItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: item.quantity },
        });
      }
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
      message: "Xóa đơn hàng thành công",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  deleteOrder,
};
