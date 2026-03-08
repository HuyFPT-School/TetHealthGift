const express = require("express");
const router = express.Router();
const {
  upload,
  uploadAvatar,
  uploadProductImage,
  uploadBlogImage,
  uploadPackagingImage,
} = require("../controllers/UploadController");
const { authenticateToken } = require("../middleware/auth");

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: No file selected
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/avatar",
  authenticateToken,
  upload.single("avatar"),
  uploadAvatar,
);

/**
 * @swagger
 * /api/upload/product:
 *   post:
 *     summary: Upload product image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product image uploaded successfully
 *       400:
 *         description: No file selected
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/product",
  authenticateToken,
  upload.single("image"),
  uploadProductImage,
);

/**
 * @swagger
 * /api/upload/blog:
 *   post:
 *     summary: Upload blog image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Blog image uploaded successfully
 *       400:
 *         description: No file selected
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/blog",
  authenticateToken,
  upload.single("image"),
  uploadBlogImage,
);

/**
 * @swagger
 * /api/upload/packaging:
 *   post:
 *     summary: Upload packaging image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Packaging image uploaded successfully
 *       400:
 *         description: No file selected
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/packaging",
  authenticateToken,
  upload.single("image"),
  uploadPackagingImage,
);

module.exports = router;
