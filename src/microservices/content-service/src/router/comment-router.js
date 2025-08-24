const express = require("express");
const router = express.Router();
const commentService = require("../service/comment-service");

/**
 * @openapi
 * /api/comment:
 *   get:
 *     tags:
 *       - comment
 *     summary: Lấy danh sách người dùng
 *     description: Trả về danh sách tất cả người dùng trong hệ thống.
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   emailAddress:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   fullName:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   address:
 *                     type: string
 *                   points:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   createDate:
 *                     type: string
 *                     format: date-time
 *                   updateDate:
 *                     type: string
 *                     format: date-time
 *                   isDeleted:
 *                     type: boolean
 *                   listTenant:
 *                     type: string
 *                   role:
 *                     type: integer
 */
router.get("/", async (req, res) => {
  const {
    search = "",
    pageCurrent = 1,
    pageSize = 5,
    sortList = "[]",
  } = req.query;
  try {
    const parsedSortList = sortList ? JSON.parse(sortList) : [];
    const users = await commentService.getAllComment(
      search,
      parseInt(pageCurrent),
      parseInt(pageSize),
      parsedSortList
    );
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
  }
});

/**
 * @openapi
 * /api/comment/{id}:
 *   get:
 *     tags:
 *       - comment
 *     summary: Lấy thông tin người dùng theo ID
 *     description: Trả về thông tin chi tiết của người dùng theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng cần tìm
 *         schema:
 *           type: integer
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
router.get("/:id", async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
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
 * /api/comment:
 *   post:
 *     tags:
 *       - comment
 *     summary: Tạo một người dùng mới
 *     description: Tạo một người dùng mới trong hệ thống.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailAddress
 *               - firstName
 *               - lastName
 *               - fullName
 *               - status
 *               - passwordHash
 *               - listTenant
 *               - role
 *             properties:
 *               emailAddress:
 *                 type: string
 *                 description: Địa chỉ email của người dùng
 *                 example: johndoe@mail.com
 *               firstName:
 *                 type: string
 *                 description: Tên của người dùng
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: Họ của người dùng
 *                 example: Doe
 *               fullName:
 *                 type: string
 *                 description: Họ và tên đầy đủ của người dùng
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 description: Số điện thoại
 *                 example: "0123456789"
 *               address:
 *                 type: string
 *                 description: Địa chỉ
 *                 example: "123 Main St"
 *               points:
 *                 type: integer
 *                 description: Điểm của người dùng
 *                 example: 100
 *               status:
 *                 type: string
 *                 description: Trạng thái người dùng
 *                 example: "active"
 *               passwordHash:
 *                 type: string
 *                 description: Mã hash mật khẩu của người dùng
 *               listTenant:
 *                 type: string
 *                 description: Danh sách tenant
 *               role:
 *                 type: integer
 *                 description: Vai trò của người dùng
 *                 example: 1
 *     responses:
 *       201:
 *         description: Người dùng được tạo thành công
 *       409:
 *         description: Email đã tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post("/", async (req, res) => {
  try {
    const newUser = await commentService.createComment(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tạo người dùng" });
  }
});

/**
 * @openapi
 * /api/comment/{id}:
 *   put:
 *     tags:
 *       - comment
 *     summary: Cập nhật thông tin người dùng
 *     description: Cập nhật thông tin của người dùng theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng cần cập nhật
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailAddress:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               points:
 *                 type: integer
 *               status:
 *                 type: string
 *               passwordHash:
 *                 type: string
 *               listTenant:
 *                 type: string
 *               role:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Người dùng đã được cập nhật thành công
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await commentService.updateComment(
      req.params.id,
      req.body
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật người dùng" });
  }
});

/**
 * @openapi
 * /api/comment/{id}:
 *   delete:
 *     tags:
 *       - comment
 *     summary: Xóa người dùng
 *     description: Xóa một người dùng khỏi hệ thống theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng cần xóa
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Xóa người dùng thành công
 *       404:
 *         description: Người dùng không tồn tại
 */
router.delete("/:id", async (req, res) => {
  try {
    const result = await commentService.deleteComment(req.params.id);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa người dùng" });
  }
});

module.exports = router;
