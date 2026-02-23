const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  deleteOrder,
} = require("../controllers/OrderController");
const { authenticateToken, checkRole } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Admin/StaffManager only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orderStatus
 *         schema:
 *           type: string
 *           enum: [processing, shipped, delivered, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [pending, paid, failed]
 *         description: Filter by payment status
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  authenticateToken,
  checkRole(["Admin", "StaffManager"]),
  getAllOrders,
);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/my-orders", authenticateToken, getOrdersByCustomer);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/:id", authenticateToken, getOrderById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartItems
 *             properties:
 *               cartItems:
 *                 type: array
 *                 description: Mảng sản phẩm (name và price sẽ tự động lấy từ database)
 *                 items:
 *                   type: object
 *                   required:
 *                     - product
 *                     - quantity
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Product ID
 *                       example: 60a7c9b4f3d2e45a8c9b1234
 *                     quantity:
 *                       type: integer
 *                       description: Số lượng sản phẩm
 *                       example: 2
 *               shippingAddress:
 *                 type: string
 *                 description: Địa chỉ giao hàng (nếu không gửi sẽ lấy từ user profile)
 *                 example: 123 Test Street, District 1, Ho Chi Minh
 *               phone:
 *                 type: string
 *                 description: Số điện thoại (nếu không gửi sẽ lấy từ user profile)
 *                 example: "0123456789"
 *               note:
 *                 type: string
 *                 description: Ghi chú đơn hàng
 *                 example: Giao hàng giờ hành chính
 *               paymentMethod:
 *                 type: string
 *                 enum: [cod, vnpay, momo]
 *                 default: cod
 *                 example: cod
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input or insufficient stock
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", authenticateToken, createOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin/StaffManager only)
 *     description: |
 *       Cập nhật trạng thái đơn hàng với các quy tắc chuyển đổi:
 *       - processing → shipped, cancelled
 *       - shipped → delivered, cancelled
 *       - delivered → không thể chuyển
 *       - cancelled → không thể chuyển
 *
 *       Khi chuyển sang cancelled, hệ thống tự động hoàn trả số lượng sản phẩm vào kho.
 *       Không thể hủy đơn hàng đã thanh toán online (cần xử lý hoàn tiền trước).
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderStatus
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 enum: [processing, shipped, delivered, cancelled]
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.patch(
  "/:id/status",
  authenticateToken,
  checkRole(["Admin", "StaffManager"]),
  updateOrderStatus,
);

/**
 * @swagger
 * /api/orders/{id}/payment:
 *   patch:
 *     summary: Update payment status (Admin/StaffManager only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentStatus
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, failed]
 *                 example: paid
 *     responses:
 *       200:
 *         description: Payment status updated
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.patch(
  "/:id/payment",
  authenticateToken,
  checkRole(["Admin", "StaffManager"]),
  updatePaymentStatus,
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel order (restores product stock)
 *     description: |
 *       Hủy đơn hàng với các quy tắc:
 *       - Không thể hủy đơn đã bị hủy trước đó
 *       - Không thể hủy đơn đã giao hoặc đang vận chuyển
 *       - Không thể hủy đơn đã thanh toán online (cần xử lý hoàn tiền)
 *       - Tự động hoàn trả số lượng sản phẩm vào kho
 *       - Tự động cập nhật paymentStatus thành failed
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Cannot cancel order (already cancelled, delivered, shipped, or paid online)
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.patch("/:id/cancel", authenticateToken, cancelOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete order (Admin only)
 *     description: |
 *       Xóa đơn hàng với các quy tắc:
 *       - Chỉ có thể xóa đơn hàng đã hủy hoặc đã giao
 *       - Nếu đơn hàng đang xử lý hoặc vận chuyển, sẽ hoàn trả số lượng sản phẩm vào kho (không nên xảy ra do validation)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       400:
 *         description: Cannot delete order (not cancelled or delivered)
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticateToken, checkRole(["Admin"]), deleteOrder);

module.exports = router;
