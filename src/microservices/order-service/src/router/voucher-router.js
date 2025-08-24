const express = require("express");
const voucherService = require("../service/voucher-service");

const router = express.Router();
// const BaseRepository = require("base-repository");
// const notifyRepository = new BaseRepository("Notification");
// console.log(notifyRepository.renderSwagger())
/**
 * @swagger
 * components:
 *   schemas:
 *     Voucher:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - code
 *         - type
 *         - startDate
 *         - expiryDate
 *         - usageCount
 *         - usagePerUser
 *         - minOrderValue
 *         - discountAmount
 *         - discountPercent
 *         - maxDiscountValue
 *         - image_url
 *         - tenantId
 *         - platform
 *         - userType
 *         - isPublic
 *         - isFreeShipping
 *         - addedValue
 *         - totalDenomination
 *         - status
 *         - userUpdate
 *         - createDate
 *         - updateDate
 *         - isDeleted
 *         - isShow
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           default: ""
 *         code:
 *           type: string
 *           example: "FREESHIP50"
 *         type:
 *           type: string
 *           default: "discount"
 *         startDate:
 *           type: string
 *           format: date-time
 *           default: "2024-01-01T00:00:00Z"
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           default: "2024-12-31T23:59:59Z"
 *         usageCount:
 *           type: integer
 *           default: 0
 *         usagePerUser:
 *           type: integer
 *           default: 1
 *         minOrderValue:
 *           type: number
 *           format: float
 *           default: 0
 *         discountAmount:
 *           type: number
 *           format: float
 *           default: 0
 *         discountPercent:
 *           type: number
 *           format: float
 *           default: 0
 *         maxDiscountValue:
 *           type: number
 *           format: float
 *           default: 0
 *         itemList:
 *           type: string
 *           description: Danh sách sản phẩm áp dụng (LongText)
 *         icon:
 *           type: string
 *           description: Biểu tượng (LongText)
 *         image_url:
 *           type: string
 *           default: ""
 *           maxLength: 1000
 *         tenantId:
 *           type: integer
 *           default: 0
 *         platform:
 *           type: string
 *           default: "all"
 *         userType:
 *           type: string
 *           default: "all"
 *         isPublic:
 *           type: boolean
 *           default: true
 *         isFreeShipping:
 *           type: boolean
 *           default: false
 *         addedValue:
 *           type: number
 *           format: float
 *           default: 0
 *         totalDenomination:
 *           type: number
 *           format: float
 *           default: 0
 *         status:
 *           type: string
 *           default: "active"
 *         userUpdate:
 *           type: string
 *           default: ""
 *         createDate:
 *           type: string
 *           format: date-time
 *           default: "2024-01-01T00:00:00Z"
 *         updateDate:
 *           type: string
 *           format: date-time
 *           default: "2024-01-01T00:00:00Z"
 *         isDeleted:
 *           type: boolean
 *           default: false
 *         isShow:
 *           type: boolean
 *           default: true
 */

/**
 * @swagger
 * /api/vouchers:
 *   post:
 *     summary: Create a new vouchers
 *     tags: [Voucher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Voucher'
 *     responses:
 *       201:
 *         description: The created Voucher
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Voucher'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/vouchers:
 *   get:
 *     summary: Get all Voucher
 *     tags: [Voucher]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword for organization or product name
 *       - in: query
 *         name: pageCurrent
 *         schema:
 *           type: integer
 *         description: Current page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sortList
 *         required: false
 *         schema:
 *           type: string
 *         description: |
 *           Danh sách các điều kiện sắp xếp, mỗi điều kiện được truyền dưới dạng chuỗi JSON.
 *           Ví dụ: '[{"key": "firstName", "value": "asc"}, {"key": "lastName", "value": "desc"}]'
 *       - in: query
 *         name: optionExtend
 *         required: false
 *         schema:
 *           type: string
 *         description: |
 *           Danh sách các điều kiện sắp xếp, mỗi điều kiện được truyền dưới dạng chuỗi JSON.
 *           Ví dụ: '[{"key": "firstName", "value": "asc"}, {"key": "lastName", "value": "desc"}]'
 *     responses:
 *       200:
 *         description: A list of Notificationss
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notifications'
 */

/**
 * @swagger
 * /api/vouchers/{Voucherid}:
 *   get:
 *     summary: Get a Voucher by ID
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: Voucherid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: The Notification data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /api/vouchers/{Voucherid}:
 *   put:
 *     summary: Update a Voucher by ID
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: Voucherid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Voucher ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Voucher'
 *     responses:
 *       200:
 *         description: The updated Voucher
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Voucher'
 *       400:
 *         description: Invalid input or Voucher not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/vouchers/soft/{Voucherid}:
 *   delete:
 *     summary: Soft delete a Voucher
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: Voucherid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Voucher ID
 *     responses:
 *       200:
 *         description: Voucher soft-deleted successfully
 */

/**
 * @swagger
 * /api/vouchers/hard/{Voucherid}:
 *   delete:
 *     summary: Permanently delete a Voucher
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: Voucherid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Voucher ID
 *     responses:
 *       200:
 *         description: Voucher permanently deleted
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
    const result = await voucherService.getVoucher(
      search,
      parseInt(pageCurrent),
      parseInt(pageSize),
      parsedSortList,
      parsedOptionExtend
    );
    res.json(result);
  } catch (error) {
    console.error("Error fetching getVoucher:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình lấy voucher.",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await voucherService.getVoucherById(req.params.id);
    res.json(result);
  } catch (e) {
    console.error(e);
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await voucherService.createVoucher(req.body);
    if (result.statusCode === 409) {
      return res
        .status(409)
        .json({ status: 409, error: "voucher này đã tồn tại" });
    }

    // if (req.files.length > 0) {
    //   const file = await fileService.uploadSingleFileAsync(
    //     req.files,
    //     req.body.code + "/image/",
    //     "image"
    //   );

    //   req.body.image_url = file.fileName;
    //   const result = await voucherService.updateVoucher(result.id, req.body);
    //   res.json(result);
    // }
    res.json(result);
  } catch (error) {
    console.error("Error fetching notify:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình cập nhật notify.",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = await voucherService.updateVoucher(req.params.id, req.body);
    if (result.statusCode === 409) {
      return res
        .status(409)
        .json({ status: 409, error: "voucher này đã tồn tại" });
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching notify:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình cập nhật notify.",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    var result = await voucherService.deleteVoucher(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error fetching notify:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình xóa notify.",
      error: error.message,
    });
  }
});

router.get("/userVoucher/data", async (req, res) => {
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
    const result = await voucherService.getVoucherUser(
      search,
      parseInt(pageCurrent),
      parseInt(pageSize),
      parsedSortList,
      parsedOptionExtend
    );
    res.json(result);
  } catch (error) {
    console.error("Error fetching getVoucher:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình lấy voucher.",
      error: error.message,
    });
  }
});

module.exports = router;
