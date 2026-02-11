const express = require("express");
const router = express.Router();
const {
  createVNPayPayment,
  vnpayReturn,
  createMoMoPayment,
  momoReturn,
  momoIPN,
  queryMoMoTransaction,
} = require("../controllers/PaymentController");
const { authenticateToken } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment integration endpoints (VNPAY & MoMo)
 */

// ==================== VNPAY ROUTES ====================

/**
 * @swagger
 * /api/payment/vnpay/create:
 *   post:
 *     summary: Create VNPAY payment URL
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: 'Order ID (số tiền sẽ tự động lấy từ đơn hàng)'
 *                 example: '698c201dc49da7e292935534'
 *               orderInfo:
 *                 type: string
 *                 description: 'Thông tin đơn hàng (tùy chọn)'
 *                 example: 'Thanh toán đơn hàng #12345'
 *               orderType:
 *                 type: string
 *                 default: other
 *               locale:
 *                 type: string
 *                 enum: [vn, en]
 *                 default: vn
 *     responses:
 *       200:
 *         description: Payment URL created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/vnpay/create", authenticateToken, createVNPayPayment);

/**
 * @swagger
 * /api/payment/vnpay-return:
 *   get:
 *     summary: VNPAY return callback (redirect from VNPAY)
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: vnp_TmnCode
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_Amount
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_BankCode
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_SecureHash
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       400:
 *         description: Payment failed or invalid signature
 *       500:
 *         description: Server error
 */
router.get("/vnpay-return", vnpayReturn);

// ==================== MOMO ROUTES ====================

/**
 * @swagger
 * /api/payment/momo/create:
 *   post:
 *     summary: Create MoMo payment
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: 'Order ID (số tiền sẽ tự động lấy từ đơn hàng)'
 *                 example: '698c201dc49da7e292935534'
 *               orderInfo:
 *                 type: string
 *                 description: 'Thông tin đơn hàng (tùy chọn)'
 *                 example: 'Thanh toán đơn hàng #12345'
 *               extraData:
 *                 type: string
 *                 description: Extra data (optional)
 *               autoCapture:
 *                 type: boolean
 *                 default: true
 *               lang:
 *                 type: string
 *                 enum: [vi, en]
 *                 default: vi
 *     responses:
 *       200:
 *         description: Payment created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/momo/create", authenticateToken, createMoMoPayment);

/**
 * @swagger
 * /api/payment/momo-return:
 *   get:
 *     summary: MoMo return callback (redirect from MoMo)
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: partnerCode
 *         schema:
 *           type: string
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *       - in: query
 *         name: resultCode
 *         schema:
 *           type: number
 *       - in: query
 *         name: signature
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       400:
 *         description: Payment failed or invalid signature
 *       500:
 *         description: Server error
 */
router.get("/momo-return", momoReturn);

/**
 * @swagger
 * /api/payment/momo-ipn:
 *   post:
 *     summary: MoMo IPN callback (server-to-server notification)
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: IPN processed successfully
 *       400:
 *         description: Invalid signature
 *       500:
 *         description: Server error
 */
router.post("/momo-ipn", momoIPN);

/**
 * @swagger
 * /api/payment/momo/query:
 *   post:
 *     summary: Query MoMo transaction status
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - requestId
 *             properties:
 *               orderId:
 *                 type: string
 *               requestId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction status retrieved
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/momo/query", authenticateToken, queryMoMoTransaction);

module.exports = router;
