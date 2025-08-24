const express = require("express");
const roleService = require("../service/role-service");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Role management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         roleName:
 *           type: string
 *         createDate:
 *           type: string
 *           format: date-time
 *         updateDate:
 *           type: string
 *           format: date-time
 *         isDeleted:
 *           type: boolean
 *         listPermision:
 *           type: string
 *
 *     RoleInput:
 *       type: object
 *       required:
 *         - roleName
 *         - listPermision
 *       properties:
 *         roleName:
 *           type: string
 *         listPermision:
 *           type: string
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Role]
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
router.get("/", async (req, res) => {
  try {
    const roles = await roleService.getAllRole();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Role]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const role = await roleService.getRoleById(id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleInput'
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       500:
 *         description: Error creating role
 */
router.post("/", async (req, res) => {
  try {
    const newRole = await roleService.createRole(req.body);
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update role by ID
 *     tags: [Role]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleInput'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log("asdhajldhasl;dá", req.body);
    const updatedRole = await roleService.updateRole(id, req.body);
    if (!updatedRole)
      return res.status(404).json({ message: "Role not found" });
    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete role by ID
 *     tags: [Role]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await roleService.deleteRole(id);
    if (!deleted) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
