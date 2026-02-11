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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Processing, Shipped, Delivered, Cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [Pending, Paid, Failed]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Processing, Shipped, Delivered, Cancelled]
 *                 example: Processing
 *     responses:
 *       200:
 *         description: Order status updated
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
 *                 enum: [Pending, Paid, Failed]
 *                 example: Paid
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
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticateToken, checkRole(["Admin"]), deleteOrder);

module.exports = router;
