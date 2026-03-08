const express = require("express");
const router = express.Router();
const {
  getPackagingTypes, // ACTIVE - Used by frontend to fetch packaging options
  // DEPRECATED - User basket CRUD (kept for reference, now uses localStorage):
  createBasket,
  getBasket,
  addItem,
  removeItem,
  updateItemQuantity,
  completeBasket,
  cancelBasket,
  getUserBaskets,
  // ACTIVE - Admin packaging management:
  getAllPackagingAdmin,
  createPackagingAdmin,
  updatePackagingAdmin,
  deletePackagingAdmin,
} = require("../controllers/CustomBasketController");
const { authenticateToken, checkRole } = require("../middleware/auth");

/**
 * @swagger
 * /api/custom-baskets/packaging:
 *   get:
 *     summary: Get all available packaging types
 *     tags: [CustomBasket]
 *     responses:
 *       200:
 *         description: List of packaging types
 */
router.get("/packaging", getPackagingTypes);

// ============ DEPRECATED - User Basket CRUD Endpoints ============
// NOTE: Custom baskets are now stored in localStorage on the frontend.
// These endpoints are no longer used but kept for reference/future use.
// If needed, uncomment to re-enable database-backed custom basket functionality.

/**
 * @swagger
 * /api/custom-baskets:
 *   post:
 *     summary: Create a new custom basket (DEPRECATED - now uses localStorage)
 *     deprecated: true
 *     tags: [CustomBasket]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               packagingId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Basket created successfully
 */
// router.post("/", authenticateToken, createBasket);

/**
 * @swagger
 * /api/custom-baskets/my-baskets:
 *   get:
 *     summary: Get user's custom baskets (DEPRECATED - now uses localStorage)
 *     deprecated: true
 *     tags: [CustomBasket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, completed, added_to_cart]
 *     responses:
 *       200:
 *         description: List of user's baskets
 */
// router.get("/my-baskets", authenticateToken, getUserBaskets);

// ============ ADMIN ROUTES - Packaging Management ============
// NOTE: Admin routes MUST be placed BEFORE dynamic routes like /:id

/**
 * @swagger
 * /api/custom-baskets/admin/packaging:
 *   get:
 *     summary: Get all packaging types (admin)
 *     tags: [CustomBasket-Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all packaging types
 */
router.get(
  "/admin/packaging",
  authenticateToken,
  checkRole(["Admin"]),
  getAllPackagingAdmin,
);

/**
 * @swagger
 * /api/custom-baskets/admin/packaging:
 *   post:
 *     summary: Create new packaging type (admin)
 *     tags: [CustomBasket-Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [basket, box, bag]
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               capacity:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Packaging created successfully
 */
router.post(
  "/admin/packaging",
  authenticateToken,
  checkRole(["Admin"]),
  createPackagingAdmin,
);

/**
 * @swagger
 * /api/custom-baskets/admin/packaging/{id}:
 *   put:
 *     summary: Update packaging type (admin)
 *     tags: [CustomBasket-Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               capacity:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Packaging updated successfully
 */
router.put(
  "/admin/packaging/:id",
  authenticateToken,
  checkRole(["Admin"]),
  updatePackagingAdmin,
);

/**
 * @swagger
 * /api/custom-baskets/admin/packaging/{id}:
 *   delete:
 *     summary: Delete packaging type (admin)
 *     tags: [CustomBasket-Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Packaging deleted successfully
 */
router.delete(
  "/admin/packaging/:id",
  authenticateToken,
  checkRole(["Admin"]),
  deletePackagingAdmin,
);

// ============ DEPRECATED - Individual Basket Operations ============

/**
 * @swagger
 * /api/custom-baskets/{id}:
 *   get:
 *     summary: Get basket by ID (DEPRECATED - now uses localStorage)
 *     deprecated: true
 *     tags: [CustomBasket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Basket details
 */
// router.get("/:id", authenticateToken, getBasket);

/**
 * @swagger
 * /api/custom-baskets/{id}/items:
 *   post:
 *     summary: Add item to basket (DEPRECATED - now uses localStorage)
 *     deprecated: true
 *     tags: [CustomBasket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item added successfully
 */
// router.post("/:id/items", authenticateToken, addItem);

/**
 * @swagger
 * /api/custom-baskets/{id}/items/{productId}:
 *   delete:
 *     summary: Remove item from basket (DEPRECATED - now uses localStorage)
 *     deprecated: true
 *     tags: [CustomBasket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: productId
 *         required: true
 *     responses:
 *       200:
 *         description: Item removed successfully
 */
// router.delete("/:id/items/:productId", authenticateToken, removeItem);

/**
 * @swagger
 * /api/custom-baskets/{id}/items/{productId}:
 *   put:
 *     summary: Update item quantity (DEPRECATED - now uses localStorage)
 *     deprecated: true
 *     tags: [CustomBasket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *       - in: path
 *         name: productId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 */
// router.put("/:id/items/:productId", authenticateToken, updateItemQuantity);

/**
 * @swagger
 * /api/custom-baskets/{id}/complete:
 *   post:
 *     summary: Complete basket (DEPRECATED - now uses localStorage)
 *     deprecated: true
 *     tags: [CustomBasket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Basket completed successfully
 */
// router.post("/:id/complete", authenticateToken, completeBasket);

/**
 * @swagger
 * /api/custom-baskets/{id}:
 *   delete:
 *     summary: Cancel/delete basket (DEPRECATED - now uses localStorage)
 *     deprecated: true
 *     tags: [CustomBasket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Basket cancelled successfully
 */
// router.delete("/:id", authenticateToken, cancelBasket);

module.exports = router;
