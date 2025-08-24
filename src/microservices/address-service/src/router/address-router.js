const express = require("express");
const router = express.Router();
const addressService = require("../service/address-service");

/**
 * @openapi
 * /api/address/province:
 *   get:
 *     tags:
 *       - PROVINCE
 *     summary: Lấy danh sách tỉnh/thành phố
 *     description: Trả về danh sách tất cả tỉnh/thành phố trong hệ thống.
 *     responses:
 *       200:
 *         description: Danh sách tỉnh/thành phố
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   name:
 *                     type: string
 *                   full_name:
 *                     type: string
 *                   code_name:
 *                     type: string
 */
router.get("/province", async (req, res) => {
  try {
    const address = await addressService.getAllProvince();

    res.json(address);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
  }
});

/**
 * @openapi
 * /api/address/district/{id}:
 *   get:
 *     tags:
 *       - DISTRICT
 *     summary: Lấy thông tin người dùng theo ID
 *     description: Trả về thông tin chi tiết của người dùng theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng cần tìm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 emailAddress:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 fullName:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 address:
 *                   type: string
 *                 points:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 createDate:
 *                   type: string
 *                   format: date-time
 *                 updateDate:
 *                   type: string
 *                   format: date-time
 *                 isDeleted:
 *                   type: boolean
 *                 listTenant:
 *                   type: string
 *                 role:
 *                   type: integer
 *       404:
 *         description: Người dùng không tồn tại
 */
router.get("/district/:id", async (req, res) => {
  try {
    const user = await addressService.getDistrictId(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin người dùng" });
  }
});

/**
 * @openapi
 * /api/address/wards/{id}:
 *   get:
 *     tags:
 *       - WARDS
 *     summary: Lấy danh sách phường/xã theo mã quận/huyện
 *     description: Trả về danh sách phường/xã theo mã quận/huyện.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Mã quận/huyện
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách phường/xã
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   name:
 *                     type: string
 *                   full_name:
 *                     type: string
 *                   code_name:
 *                     type: string
 *                   district_code:
 *                     type: string
 *       404:
 *         description: Không tìm thấy phường/xã
 */
router.get("/wards/:id", async (req, res) => {
  try {
    const user = await addressService.getWardId(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin người dùng" });
  }
});

module.exports = router;
