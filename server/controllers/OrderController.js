const orderService = require("../services/OrderService");
const productService = require("../services/ProductService");
const User = require("../models/UserModel");

const getAllOrders = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, page, limit } = req.query;
    const filter = { orderStatus, paymentStatus };

    const options = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    };

    const result = await orderService.getAllOrders(filter, options);

    res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);

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
    const orders = await orderService.getOrdersByCustomer(customerId);

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
    const { cartItems, note, paymentMethod, shippingAddress, phone, isInstallment } = req.body;
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

    // Tạo đơn hàng thông qua service
    const orderData = {
      customer,
      cartItems,
      shippingAddress: finalShippingAddress,
      phone: finalPhone,
      note: note || "",
      paymentMethod: paymentMethod || "cod",
      isInstallment: isInstallment || false,
    };

    const newOrder = await orderService.createOrder(orderData);

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

    const order = await orderService.updateOrderStatus(id, orderStatus);

    res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    // Handle specific error messages from service
    if (
      error.message.includes("Không tìm thấy") ||
      error.message.includes("không hợp lệ") ||
      error.message.includes("Không thể")
    ) {
      return res.status(400).json({ message: error.message });
    }
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

    const order = await orderService.updatePaymentStatus(id, paymentStatus);

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
    const { cancelReason } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Get order to check ownership
    const order = await orderService.getOrderById(id);

    // Check authorization: Admin/StaffManager can cancel any order, Customer can only cancel their own
    if (userRole !== "Admin" && userRole !== "StaffManager") {
      if (order.customer._id.toString() !== userId) {
        return res.status(403).json({
          message: "Bạn không có quyền hủy đơn hàng này",
        });
      }
    }

    const cancelledOrder = await orderService.cancelOrder(id, cancelReason);

    res.status(200).json({
      message: "Hủy đơn hàng thành công",
      data: cancelledOrder,
    });
  } catch (error) {
    if (
      error.message.includes("Không tìm thấy") ||
      error.message.includes("Không thể") ||
      error.message.includes("đã bị hủy")
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await orderService.deleteOrder(id);

    res.status(200).json({
      message: "Xóa đơn hàng thành công",
    });
  } catch (error) {
    if (
      error.message.includes("Không tìm thấy") ||
      error.message.includes("Chỉ có thể")
    ) {
      return res.status(400).json({ message: error.message });
    }
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
