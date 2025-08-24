const express = require("express");
const spotlightService = require("../service/spotlight-service");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Spotlight
 *   description: Spotlight product highlights
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Spotlight:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     SpotlightInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /api/spotlights:
 *   get:
 *     summary: Get all spotlight entries
 *     tags: [Spotlight]
 *     responses:
 *       200:
 *         description: List of spotlights
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Spotlight'
 */
router.get("/", async (req, res) => {
  try {
    const data = await spotlightService.getAllSpotlights();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/spotlights/{id}:
 *   get:
 *     summary: Get Spotlight by ID
 *     tags: [Spotlight]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Spotlight ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Spotlight found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spotlight'
 *       404:
 *         description: Spotlight not found
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await spotlightService.getSpotlightById(id);
    if (!data) return res.status(404).json({ message: "Spotlight not found" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/spotlights:
 *   post:
 *     summary: Create a new spotlight entry
 *     tags: [Spotlight]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpotlightInput'
 *     responses:
 *       201:
 *         description: Spotlight created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spotlight'
 */
router.post("/", async (req, res) => {
  try {
    const newSpotlight = await spotlightService.createSpotlight(req.body);
    res.status(201).json(newSpotlight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/spotlights/{id}:
 *   put:
 *     summary: Update spotlight entry
 *     tags: [Spotlight]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Spotlight ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpotlightInput'
 *     responses:
 *       200:
 *         description: Spotlight updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Spotlight'
 *       404:
 *         description: Spotlight not found
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await spotlightService.updateSpotlight(id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Spotlight not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/spotlights/{id}:
 *   delete:
 *     summary: Delete spotlight entry
 *     tags: [Spotlight]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Spotlight ID
 *     responses:
 *       200:
 *         description: Spotlight deleted
 *       404:
 *         description: Spotlight not found
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await spotlightService.deleteSpotlight(id);
    if (!deleted)
      return res.status(404).json({ message: "Spotlight not found" });
    res.status(200).json({ message: "Spotlight deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
