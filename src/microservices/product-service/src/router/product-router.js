const express = require("express");
const productService = require("../service/product-service");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const upload = require("../middleware/upload");
const fileService = require("../service/file-service");
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Laptop products management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         image:
 *           type: string
 *         brand:
 *           type: string
 *         cpu:
 *           type: string
 *         ram:
 *           type: string
 *         storage:
 *           type: string
 *         screen:
 *           type: string
 *         graphics:
 *           type: string
 *         os:
 *           type: string
 *         ports:
 *           type: string
 *         battery:
 *           type: string
 *         weight:
 *           type: string
 *         warranty:
 *           type: string
 *         categoryId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         image:
 *           type: string
 *         brand:
 *           type: string
 *         cpu:
 *           type: string
 *         ram:
 *           type: string
 *         storage:
 *           type: string
 *         screen:
 *           type: string
 *         graphics:
 *           type: string
 *         os:
 *           type: string
 *         ports:
 *           type: string
 *         battery:
 *           type: string
 *         weight:
 *           type: string
 *         warranty:
 *           type: string
 *         categoryId:
 *           type: integer
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", async (req, res) => {
  try {
    const {
      search,
      pageCurrent = 1,
      pageSize = 10,
      sortList = "[]",
      optionExtend = "[]",
    } = req.query;
    const parsedSortList = sortList ? JSON.parse(sortList) : [];
    const parsedOptionExtend = sortList ? JSON.parse(optionExtend) : [];
    const products = await productService.getAllProducts(
      search,
      parseInt(pageCurrent),
      parseInt(pageSize),
      parsedSortList,
      parsedOptionExtend
    );
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productService.getProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error creating product
 */
router.post("/", upload.array("image", 10), async (req, res) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    console.log("new", newProduct);
    const folderName = newProduct.createdAt
      ? new Date(newProduct.createdAt)
          .toISOString()
          .split(".")[0] // Lấy phần trước dấu "."
          .replace(/[-:]/g, "") // Xóa dấu "-" và ":"
      : "unknown-date";
    const { fileNames } = await fileService.uploadMultipleFilesAsync(
      req.files,
      "product",
      folderName
    );

    req.body.image = fileNames;
    const final = await productService.updateProduct(newProduct.id, req.body);
    res.status(201).json(final);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.put("/:id", upload.array("image", 10), async (req, res) => {
  const { id } = req.params;

  // try {
  const existingProduct = await productService.getProductById(id);
  if (!existingProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  const updatedProduct = await productService.updateProduct(id, req.body);

  if (!updatedProduct)
    return res.status(404).json({ message: "Product not found" });
  const folderName = updatedProduct.createdAt
    ? new Date(updatedProduct.createdAt)
        .toISOString()
        .split(".")[0] // Lấy phần trước dấu "."
        .replace(/[-:]/g, "") // Xóa dấu "-" và ":"
    : "unknown-date";
  if (req.files.length > 0) {
    // Upload ảnh mới
    const fileNames = await fileService.uploadMultipleFilesAsync(
      req.files,
      "product",
      folderName
    );

    req.body.image = fileNames.fileNames;
    console.log("ljfhsdljfahsjlfasdfsaf", req.body);
    // Cập nhật lại ảnh vào sản phẩm
    await productService.updateProduct(id, req.body);
  }

  res.status(200).json(updatedProduct);
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
});
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await productService.deleteProduct(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/products/categoryId/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/categoryId/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productService.getProductByCategoryId(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/products/TruSoluong/trusoluong:
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.put("/TruSoluong/trusoluong", async (req, res) => {
  const { listProduct } = req.body;
  // console.log("slkdhja;kdasda", req.body);
  try {
    const updatedProduct = await productService.TruSoluong(req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
