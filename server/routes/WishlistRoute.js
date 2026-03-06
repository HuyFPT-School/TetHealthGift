const express = require("express");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkInWishlist,
  updateQuantity,
} = require("../controllers/WishlistController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Tất cả routes wishlist yêu cầu authentication
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Quản lý danh sách yêu thích của người dùng
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Lấy danh sách sản phẩm yêu thích của user
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy wishlist thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 wishlist:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.get("/", getWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Thêm sản phẩm vào danh sách yêu thích
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID của sản phẩm cần thêm
 *                 example: '60a7c9b4f3d2e45a8c9b1234'
 *     responses:
 *       200:
 *         description: Thêm vào wishlist thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 wishlist:
 *                   type: array
 *       400:
 *         description: Thiếu productId
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi server
 */
router.post("/", addToWishlist);

/**
 * @swagger
 * /api/wishlist/{productId}:
 *   delete:
 *     summary: Xóa sản phẩm khỏi danh sách yêu thích
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần xóa
 *         example: '60a7c9b4f3d2e45a8c9b1234'
 *     responses:
 *       200:
 *         description: Xóa khỏi wishlist thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 wishlist:
 *                   type: array
 *       400:
 *         description: Thiếu productId
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.delete("/:productId", removeFromWishlist);

/**
 * @swagger
 * /api/wishlist/clear/all:
 *   delete:
 *     summary: Xóa tất cả sản phẩm khỏi danh sách yêu thích
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa tất cả thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 wishlist:
 *                   type: array
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.delete("/clear/all", clearWishlist);

/**
 * @swagger
 * /api/wishlist/check/{productId}:
 *   get:
 *     summary: Kiểm tra sản phẩm có trong danh sách yêu thích không
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần kiểm tra
 *         example: '60a7c9b4f3d2e45a8c9b1234'
 *     responses:
 *       200:
 *         description: Kiểm tra thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isInWishlist:
 *                   type: boolean
 *                   description: True nếu sản phẩm có trong wishlist
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.get("/check/:productId", checkInWishlist);

router.patch("/:productId/quantity", updateQuantity);

module.exports = router;
