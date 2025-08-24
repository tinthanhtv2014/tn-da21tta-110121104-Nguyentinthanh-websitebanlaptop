const express = require("express");
const router = express.Router();
const cartService = require("../service/cart-service");

/**
 * @swagger
 * tags:
 *   name: carts
 *   description: Manage user carts
 */

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Add product to cart
 *     tags: [carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *             properties:
 *               userId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added to cart
 *       500:
 *         description: Error adding to cart
 */
router.post("/", async (req, res) => {
  const { userId, productId } = req.body;
  try {
    console.log("ạldhadad", req.body);
    const cartItem = await cartService.addToCart(userId, productId);
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/carts/{id}:
 *   put:
 *     summary: Add product to cart
 *     tags: [carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added to cart
 *       500:
 *         description: Error adding to cart
 */
router.put("/:id", async (req, res) => {
  const { quantity } = req.body;
  // try {
  const cartItem = await cartService.updateCart(req.params.id, quantity);
  res.status(201).json(cartItem);
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
});
/**
 * @swagger
 * /api/carts/user:
 *   get:
 *     summary: Get cart items by user ID
 *     tags: [carts]
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - name: listCart
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: List of cart items (optional, comma-separated IDs or JSON string)
 *     responses:
 *       200:
 *         description: Cart items returned
 *       500:
 *         description: Error fetching cart
 */
router.get("/user", async (req, res) => {
  const { userId, listCart } = req.query;

  try {
    const items = await cartService.getCartByUser(userId, listCart);
    res.status(200).json(items);
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/carts/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [carts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Cart item removed
 *       500:
 *         description: Error removing cart item
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await cartService.removeCartItem(id);
    res.status(200).json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/carts/clear/{userId}:
 *   delete:
 *     summary: Clear all cart items for a user
 *     tags: [carts]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Cart cleared
 *       500:
 *         description: Error clearing cart
 */
router.delete("/clear/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await cartService.clearCartByUser(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
