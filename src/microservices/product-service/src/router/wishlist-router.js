const express = require("express");
const wishlistService = require("../service/wishlist-service");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Manage user's wishlist
 */

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
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
 *         description: Product added to wishlist
 *       400:
 *         description: Product already in wishlist
 *       500:
 *         description: Server error
 */

router.post("/", async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const result = await wishlistService.addToWishlist(userId, productId);
    res.status(201).json(result);
  } catch (error) {
    res
      .status(error.message === "Product already in wishlist" ? 400 : 500)
      .json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/wishlist/user/{userId}:
 *   get:
 *     summary: Get wishlist of a user
 *     tags: [Wishlist]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Wishlist fetched
 *       500:
 *         description: Server error
 */
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlist = await wishlistService.getWishlistByUser(parseInt(userId));
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/wishlist/{id}:
 *   delete:
 *     summary: Remove a wishlist item
 *     tags: [Wishlist]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Wishlist item ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Wishlist item deleted
 *       500:
 *         description: Server error
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await wishlistService.removeWishlistItem(parseInt(id));
    res.status(200).json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/wishlist/clear/{userId}:
 *   delete:
 *     summary: Clear all wishlist items of a user
 *     tags: [Wishlist]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Wishlist cleared
 *       500:
 *         description: Server error
 */
router.delete("/clear/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await wishlistService.clearWishlistByUser(parseInt(userId));
    res.status(200).json({ message: "Wishlist cleared", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
