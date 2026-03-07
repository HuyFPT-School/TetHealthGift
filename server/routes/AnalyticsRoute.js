const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/AnalyticsController");
const { authenticateToken, checkRole } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics and dashboard statistics endpoints
 */

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get dashboard statistics (Admin/StaffManager only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     kpis:
 *                       type: object
 *                       properties:
 *                         todayOrders:
 *                           type: number
 *                         todayRevenue:
 *                           type: number
 *                         lowStockProducts:
 *                           type: number
 *                         totalProducts:
 *                           type: number
 *                         totalRevenue:
 *                           type: number
 *                         pendingOrders:
 *                           type: number
 *                     revenueChart:
 *                       type: array
 *                     recentOrders:
 *                       type: array
 *                     categoryDistribution:
 *                       type: array
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin/StaffManager only
 *       500:
 *         description: Server error
 */
router.get(
  "/dashboard",
  authenticateToken,
  checkRole(["Admin", "StaffManager"]),
  getDashboardStats,
);

module.exports = router;
