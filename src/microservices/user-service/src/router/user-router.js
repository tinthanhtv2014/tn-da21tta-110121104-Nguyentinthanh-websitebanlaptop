const express = require("express");
const router = express.Router();
const userService = require("../service/user-service");
const upload = require("../middleware/upload");
/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
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
    pageSize = 1500,
    sortList = "[]",
  } = req.query;
  try {
    const parsedSortList = sortList ? JSON.parse(sortList) : [];
    const users = await userService.getUsers(
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
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
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
 * /api/users:
 *   post:
 *     tags:
 *       - Users
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
router.post("/", upload.single("avatar"), async (req, res) => {
  // try {
  const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;
  if (avatarPath !== null) {
    req.body.avatar = avatarPath;
  }
  const newUser = await userService.createUser(req.body);
  res.status(201).json(newUser);
  // } catch (error) {
  //   res.status(500).json({ error: "Lỗi khi tạo người dùng" });
  // }
});

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
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
router.put("/:id", upload.single("avatar"), async (req, res) => {
  try {
    const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;
    if (avatarPath !== null) {
      req.body.avatar = avatarPath;
    }

    const updatedUser = await userService.updateUser(req.params.id, req.body);
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
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
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
    const result = await userService.deleteUser(req.params.id);
    if (result) {
      res.status(200).json({ result });
    } else {
      res.status(404).json({ error: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa người dùng" });
  }
});
/**
 * @openapi
 * /api/users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Đăng ký người dùng mới
 *     description: Đăng ký người dùng mới trong hệ thống và trả về thông tin người dùng cùng với token JWT.
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
 *               - password
 *               - guildId
 *             properties:
 *               emailAddress:
 *                 type: string
 *                 description: Địa chỉ email của người dùng
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: Mật khẩu người dùng
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               guildId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Người dùng được tạo thành công và trả về JWT token
 *       409:
 *         description: Email đã tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post("/register", async (req, res) => {
  try {
    const {
      emailAddress,
      firstName,
      lastName,
      phoneNumber,
      address,
      password,
      guildId,
    } = req.body;
    const { user, token } = await userService.register({
      emailAddress,
      firstName,
      lastName,
      phoneNumber,
      address,
      password,
      guildId,
    });
    res.status(201).json({ user, token });
  } catch (error) {
    if (error.message === "Email đã tồn tại") {
      res.status(409).json({ error: "Email đã tồn tại" });
    } else {
      res.status(500).json({ error: "Lỗi khi đăng ký người dùng" });
    }
  }
});

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Đăng nhập người dùng
 *     description: Đăng nhập người dùng và trả về token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailAddress
 *               - password
 *             properties:
 *               emailAddress:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về JWT token
 *       401:
 *         description: Email hoặc mật khẩu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/login", async (req, res) => {
  try {
    const { provider } = req.body;

    let access;
    switch (provider) {
      case "googleLogin":
        const { ggToken } = req.body;
        access = await userService.verifyGoogleToken(ggToken);
        break;

      default:
        const { emailAddress, password } = req.body;
        access = await userService.login(emailAddress, password);
        break;
    }

    res.status(200).json(access);
  } catch (error) {
    res.status(401).json({ error: "Email hoặc mật khẩu không hợp lệ" });
  }
});

/**
 * @openapi
 * /api/users/verifyAdmin:
 *   post:
 *     tags:
 *       - Users
 *     summary: Xác thực user
 *     description: Đăng nhập người dùng và trả về token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailAddress
 *               - password
 *             properties:
 *               emailAddress:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về JWT token
 *       401:
 *         description: Email hoặc mật khẩu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/verifyAdmin", async (req, res) => {
  try {
    const { accessToken } = req.body;
    console.log(req.body);
    const check = await userService.verifyAdmin(accessToken);
    res.status(200).json({ check });
  } catch (error) {
    9;
    res.status(401).json({ error: "Email hoặc mật khẩu không hợp lệ" });
  }
});

/**
 * @swagger
 * /api/users/updateDynamicUser/{id}:
 *   put:
 *     security:
 *       - BearerAuth: []
 *     summary: cập nhật bất kỳ thông tin nào của user trừ password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: users ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *     responses:
 *       200:
 *         description: The updated User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.put("/updateDynamicUser/:id", async (req, res) => {
  try {
    const updatedUser = await userService.updateDynamicUser(
      req.params.id,
      req.body
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: "Người dùng không tồn tại" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Lỗi khi cập nhật người dùng" });
  }
});

router.put(
  "/updateImage/Image/:id",
  upload.single("avatar"),
  async (req, res) => {
    try {
      const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;
      if (avatarPath !== null) {
        req.body.avatar = avatarPath;
      }

      const updatedUser = await userService.updateAvatarUser(
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
  }
);

router.put("/updatePasswordUser/password/data/:id", async (req, res) => {
  try {
    console.log("req.", req.body);
    const updatedUser = await userService.updatePasswordUser(
      req.params.id,
      req.body.newPassword
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
 * /api/users/getUsersSortList/getData:
 *   get:
 *     tags:
 *       - Users
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
router.get("/getUsersSortList/getData", async (req, res) => {
  const {
    search = "",
    pageCurrent = 1,
    pageSize = 1500,
    sortList = "[]",
  } = req.query;
  // try {

  const parsedSortList = sortList ? JSON.parse(sortList) : [];
  const users = await userService.getUsersSortList(
    search,
    parseInt(pageCurrent),
    parseInt(pageSize),
    parsedSortList
  );
  res.json(users);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
  // }
});

router.put("/updatePointUser/point/data/:id", async (req, res) => {
  try {
    console.log("req.", req.body);
    const updatedUser = await userService.updatePointUser(
      req.params.id,
      req.body.point,
      req.body.key
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
 * /api/users/getUserStats/getUserStats/data:
 *   get:
 *     tags:
 *       - Users
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
router.get("/getUserStats/getUserStats/data", async (req, res) => {
  // try {

  const users = await userService.getUserStats();
  res.json(users);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
  // }
});

/**
 * @openapi
 * /api/users/getNewUsersByMonth/getNewUsersByMonth/data:
 *   get:
 *     tags:
 *       - Users
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
router.get("/getNewUsersByMonth/getNewUsersByMonth/data", async (req, res) => {
  // try {

  const users = await userService.getNewUsersByMonth(2025);
  res.json(users);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
  // }
});

/**
 * @openapi
 * /api/users/sendOtp:
 *   post:
 *     tags:
 *       - Users
 *     summary: Tạo một người dùng mới
 *     description: Tạo một người dùng mới trong hệ thống.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Địa chỉ email của người dùng
 *                 example: johndoe@mail.com
 *     responses:
 *       201:
 *         description: Người dùng được tạo thành công
 *       409:
 *         description: Email đã tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post("/sendOtp", async (req, res) => {
  // try {

  const newUser = await userService.sendOtp(req.body.email);
  res.status(201).json(newUser);
  // } catch (error) {
  //   res.status(500).json({ error: "Lỗi khi tạo người dùng" });
  // }
});

router.post("/sendOrderConfirmationEmail", async (req, res) => {
  // try {

  const newUser = await userService.sendOrderConfirmationEmail(req.body);
  res.status(201).json(newUser);
  // } catch (error) {
  //   res.status(500).json({ error: "Lỗi khi tạo người dùng" });
  // }
});

router.put(
  "/updatePasswordUserWithEmail/updatePasswordUserWithEmail/data/:email",
  async (req, res) => {
    try {
      const updatedUser = await userService.updatePasswordUserWithEmail(
        req.params.email,
        req.body.newPassword
      );
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ error: "Người dùng không tồn tại" });
      }
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi cập nhật người dùng" });
    }
  }
);

/**
 * @openapi
 * /api/users/sendSms:
 *   post:
 *     tags:
 *       - Users
 *     summary: Tạo một người dùng mới
 *     description: Tạo một người dùng mới trong hệ thống.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Địa chỉ email của người dùng
 *                 example: johndoe@mail.com
 *     responses:
 *       201:
 *         description: Người dùng được tạo thành công
 *       409:
 *         description: Email đã tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post("/sendSms", async (req, res) => {
  // try {

  const newUser = await userService.sendSms(req.body.phone);
  res.status(201).json(newUser);
  // } catch (error) {
  //   res.status(500).json({ error: "Lỗi khi tạo người dùng" });
  // }
});

module.exports = router;
