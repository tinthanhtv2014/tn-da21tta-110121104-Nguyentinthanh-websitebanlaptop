const express = require("express");
const router = express.Router();
const orderService = require("../service/order-service");
const crypto = require("crypto");
const axios = require("axios");
const querystring = require("qs");
const moment = require("moment");
const {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
} = require("vnpay");
/**
 * @openapi
 * /api/orders:
 *   get:
 *     tags:
 *       - orders
 *     summary: Lấy danh sách đơn hàng
 *     description: Trả về danh sách tất cả đơn hàng trong hệ thống.
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   orderStatus:
 *                     type: string
 *                   paymentStatus:
 *                     type: boolean
 *                   paymentMethod:
 *                     type: string
 *                   promotion:
 *                     type: string
 *                   listProducts:
 *                     type: string
 *                   user_info:
 *                     type: string
 *                   totalOrderPrice:
 *                     type: integer
 *                   orderId:
 *                     type: string
 *                   tenantId:
 *                     type: integer
 *                   plusPoint:
 *                     type: integer
 */
router.get("/", async (req, res) => {
  const { search = "", pageCurrent = 1, pageSize = 1500 } = req.query;
  try {
    const orders = await orderService.getAllOrder(
      search,
      parseInt(pageCurrent),
      parseInt(pageSize)
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
  }
});

/**
 * @openapi
 * /api/orders/getAllOrderbyUserId/getData:
 *   get:
 *     tags:
 *       - orders
 *     summary: Lấy danh sách đơn hàng
 *     description: Trả về danh sách tất cả đơn hàng trong hệ thống.
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   orderStatus:
 *                     type: string
 *                   paymentStatus:
 *                     type: boolean
 *                   paymentMethod:
 *                     type: string
 *                   promotion:
 *                     type: string
 *                   listProducts:
 *                     type: string
 *                   user_info:
 *                     type: string
 *                   totalOrderPrice:
 *                     type: integer
 *                   orderId:
 *                     type: string
 *                   tenantId:
 *                     type: integer
 *                   plusPoint:
 *                     type: integer
 */
router.get("/getAllOrderbyUserId/getData", async (req, res) => {
  const {
    search = "",
    pageCurrent = 1,
    pageSize = 5,
    userId,
    sortList = "[]",
  } = req.query;
  try {
    const parsedSortList = sortList ? JSON.parse(sortList) : [];
    const orders = await orderService.getAllOrderbyUserId(
      search,
      parseInt(pageCurrent),
      parseInt(pageSize),
      userId,
      parsedSortList
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
  }
});

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - orders
 *     summary: Lấy thông tin đơn hàng theo ID
 *     description: Trả về thông tin chi tiết của đơn hàng theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của đơn hàng cần tìm
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   orderStatus:
 *                     type: string
 *                   paymentStatus:
 *                     type: boolean
 *                   paymentMethod:
 *                     type: string
 *                   promotion:
 *                     type: string
 *                   listProducts:
 *                     type: string
 *                   user_info:
 *                     type: string
 *                   totalOrderPrice:
 *                     type: integer
 *                   orderId:
 *                     type: string
 *                   tenantId:
 *                     type: integer
 *                   plusPoint:
 *                     type: integer
 *       404:
 *         description: Người dùng không tồn tại
 */
router.get("/:id", async (req, res) => {
  try {
    const orders = await orderService.getOrderById(req.params.id);
    if (orders) {
      res.json(orders);
    } else {
      res.status(404).json({ error: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin người dùng" });
  }
});

/**
 * @openapi
 * /api/orders:
 *   post:
 *     tags:
 *       - orders
 *     summary: Tạo một đơn hàng mới
 *     description: Tạo một đơn hàng mới trong hệ thống.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - orderStatus
 *               - paymentStatus
 *               - paymentMethod
 *               - promotion
 *               - listProducts
 *               - user_info
 *               - totalOrderPrice
 *               - orderId
 *               - tenantId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID người dùng
 *                 example: 123
 *               quantity:
 *                 type: integer
 *                 description: Số lượng sản phẩm trong đơn hàng
 *                 example: 3
 *               orderStatus:
 *                 type: string
 *                 description: Trạng thái đơn hàng
 *                 example: "pending"
 *               paymentStatus:
 *                 type: boolean
 *                 description: Trạng thái thanh toán (true = đã thanh toán, false = chưa)
 *                 example: false
 *               paymentMethod:
 *                 type: string
 *                 description: Phương thức thanh toán
 *                 example: "Credit Card"
 *               promotion:
 *                 type: string
 *                 description: Thông tin khuyến mãi áp dụng
 *                 example: "Giảm 20%"
 *               listProducts:
 *                 type: string
 *                 description: Danh sách sản phẩm (dạng JSON string)
 *                 example: '[{"productId":1,"quantity":2},{"productId":2,"quantity":1}]'
 *               user_info:
 *                 type: string
 *                 description: Thông tin người đặt hàng (dạng JSON string)
 *                 example: '{"name":"John Doe","phone":"0123456789"}'
 *               totalOrderPrice:
 *                 type: number
 *                 format: float
 *                 description: Tổng giá trị đơn hàng
 *                 example: 199.99
 *               orderId:
 *                 type: string
 *                 description: Mã đơn hàng
 *                 example: "ORD123456"
 *               tenantId:
 *                 type: integer
 *                 description: ID tenant
 *                 example: 1
 *               userUpdate:
 *                 type: integer
 *                 description: ID người cập nhật (nếu có)
 *                 example: 456
 *               plusPoint:
 *                 type: integer
 *                 description: Điểm cộng sau khi đặt hàng
 *                 example: 10
 *     responses:
 *       201:
 *         description: Đơn hàng được tạo thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi server
 */

router.post("/", async (req, res) => {
  try {
    console.log("sdjlahsdjlasd,", req.body);
    const newUser = await orderService.createOrder(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tạo người dùng" });
  }
});

/**
 * @openapi
 * /api/orders/{id}:
 *   put:
 *     tags:
 *       - orders
 *     summary: Cập nhật thông tin đơn hàng
 *     description: Cập nhật thông tin đơn hàng theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của đơn hàng cần cập nhật
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               orderStatus:
 *                 type: string
 *               paymentStatus:
 *                 type: boolean
 *               paymentMethod:
 *                 type: string
 *               promotion:
 *                 type: string
 *               listProducts:
 *                 type: string
 *                 example: '[{"productId":1,"quantity":2}]'
 *               user_info:
 *                 type: string
 *                 example: '{"name":"John","phone":"0123456789"}'
 *               totalOrderPrice:
 *                 type: number
 *                 format: float
 *               orderId:
 *                 type: string
 *               tenantId:
 *                 type: integer
 *               userUpdate:
 *                 type: integer
 *               plusPoint:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Đơn hàng đã được cập nhật thành công
 *       404:
 *         description: Đơn hàng không tồn tại
 *       500:
 *         description: Lỗi server
 */

router.put("/:id", async (req, res) => {
  try {
    const updatedorders = await orderService.updateOrder(
      req.params.id,
      req.body
    );
    if (updatedorders) {
      res.json(updatedorders);
    } else {
      res.status(404).json({ error: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật người dùng" });
  }
});

/**
 * @openapi
 * /api/orders/{id}:
 *   delete:
 *     tags:
 *       - orders
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
    const result = await orderService.deleteOrder(req.params.id);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa người dùng" });
  }
});

router.post("/payment/momo", async (req, res) => {
  try {
    const { amount, orderInfo, redirectUrl, ipnUrl } = req.body;

    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const requestType = "payWithMethod";
    const extraData = "";

    const rawSignature =
      `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}` +
      `&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      ipnUrl,
      redirectUrl,
      extraData,
      requestType,
      signature,
      lang: "en",
    };

    const momoRes = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json(momoRes.data);
  } catch (error) {
    console.error("MoMo Payment Error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Thanh toán thất bại",
      error: error.response?.data || error.message,
    });
  }
});

router.post("/payment/momo-ipn", (req, res) => {
  console.log("MoMo IPN received:", req.body);
  res.status(200).send("OK");
});

///VNPAYYYYYYYYYYYY
const vnpConfig = {
  vnp_TmnCode: "VNPAYCODE",
  vnp_HashSecret: "VNPAYSECRET",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_ReturnUrl: "http://localhost:3000/thankpage",
};
router.post("/payment/vnpay", async (req, res) => {
  const vnpay = new VNPay({
    tmnCode: "I7I3JK33",
    secureSecret: "O4K1UDO9HFRFNW8HTSU8EGJI162HRVA3",
    vnpayHost: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    testMode: true,
    hashAlgorithm: "SHA512",
    loggerFn: ignoreLogger,
  });

  const vnpayResponse = await vnpay.buildPaymentUrl({
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_Amount: 70000,
    vnp_IpAddr: "127.0.0.1",
    vnp_TxnRef: req.body.orderInfo,
    vnp_OrderInfo: `Thanh toan cho ma GD: ${req.body.orderInfo}`,
    vnp_OrderType: "other",
    vnp_ReturnUrl: "http://localhost:3000/thankpage",
    vnp_Locale: req.body.language || "vn",
    vnp_CreateDate: dateFormat(new Date()),
  });

  // process.env.TZ = "Asia/Ho_Chi_Minh";

  // let date = new Date();
  // let createDate = moment(date).format("YYYYMMDDHHmmss");

  // let ipAddr =
  //   req.headers["x-forwarded-for"] ||
  //   req.connection.remoteAddress ||
  //   req.socket?.remoteAddress ||
  //   req.connection?.socket?.remoteAddress;

  // let tmnCode = "I7I3JK33";
  // let secretKey = "O4K1UDO9HFRFNW8HTSU8EGJI162HRVA3";
  // let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  // let returnUrl = "http://localhost:3000/thankpage";

  // let orderId = moment(date).format("DDHHmmss");
  // let amount = Number(req.body.amount);
  // let bankCode = req.body.bankCode;
  // let locale = req.body.language || "vn";

  // let vnp_Params = {
  //   vnp_Version: "2.1.0",
  //   vnp_Command: "pay",
  //   vnp_TmnCode: tmnCode,
  //   vnp_Locale: locale,
  //   vnp_CurrCode: "VND",
  //   vnp_TxnRef: orderId,
  //   vnp_OrderInfo: `Thanh toan cho ma GD: ${orderId}`,
  //   vnp_OrderType: "other",
  //   vnp_ReturnUrl: returnUrl,
  //   vnp_IpAddr: ipAddr,
  //   vnp_CreateDate: createDate,
  // };

  // if (bankCode) {
  //   vnp_Params["vnp_BankCode"] = bankCode;
  // }

  // // Sort và tạo chữ ký
  // vnp_Params = sortObject(vnp_Params);

  // const querystring = require("qs");
  // const crypto = require("crypto");

  // // Không encode
  // const signData = require("qs").stringify(vnp_Params, { encode: false });
  // const signed = crypto
  //   .createHmac("sha512", secretKey)
  //   .update(Buffer.from(signData, "utf-8"))
  //   .digest("hex");

  // vnp_Params["vnp_SecureHash"] = signed;

  // const paymentUrl =
  //   vnpUrl + "?" + require("qs").stringify(vnp_Params, { encode: false });

  return res.status(201).json({ data: vnpayResponse });
});

const sortObject = (obj) => {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
};

/**
 * @openapi
 * /api/orders/updateOrderCanceled/{id}:
 *   put:
 *     tags:
 *       - orders
 *     summary: Cập nhật thông tin đơn hàng
 *     description: Cập nhật thông tin đơn hàng theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của đơn hàng cần cập nhật
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               orderStatus:
 *                 type: string
 *               paymentStatus:
 *                 type: boolean
 *               paymentMethod:
 *                 type: string
 *               promotion:
 *                 type: string
 *               listProducts:
 *                 type: string
 *                 example: '[{"productId":1,"quantity":2}]'
 *               user_info:
 *                 type: string
 *                 example: '{"name":"John","phone":"0123456789"}'
 *               totalOrderPrice:
 *                 type: number
 *                 format: float
 *               orderId:
 *                 type: string
 *               tenantId:
 *                 type: integer
 *               userUpdate:
 *                 type: integer
 *               plusPoint:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Đơn hàng đã được cập nhật thành công
 *       404:
 *         description: Đơn hàng không tồn tại
 *       500:
 *         description: Lỗi server
 */

router.put("/updateOrderCanceled/:id", async (req, res) => {
  try {
    const updatedorders = await orderService.updateOrderCanceled(req.params.id);
    if (updatedorders) {
      res.json(updatedorders);
    } else {
      res.status(404).json({ error: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật người dùng" });
  }
});

/**
 * @openapi
 * /api/orders/getOrderStatusStats/getData/data:
 *   get:
 *     tags:
 *       - orders
 *     summary: Lấy danh sách đơn hàng
 *     description: Trả về danh sách tất cả đơn hàng trong hệ thống.
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   orderStatus:
 *                     type: string
 *                   paymentStatus:
 *                     type: boolean
 *                   paymentMethod:
 *                     type: string
 *                   promotion:
 *                     type: string
 *                   listProducts:
 *                     type: string
 *                   user_info:
 *                     type: string
 *                   totalOrderPrice:
 *                     type: integer
 *                   orderId:
 *                     type: string
 *                   tenantId:
 *                     type: integer
 *                   plusPoint:
 *                     type: integer
 */
router.get("/getOrderStatusStats/getData/data", async (req, res) => {
  try {
    const orders = await orderService.getOrderStatusStats();
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
  }
});

/**
 * @openapi
 * /api/orders/getTop5Products/getTop5Products/data:
 *   get:
 *     tags:
 *       - orders
 *     summary: Lấy danh sách đơn hàng
 *     description: Trả về danh sách tất cả đơn hàng trong hệ thống.
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   orderStatus:
 *                     type: string
 *                   paymentStatus:
 *                     type: boolean
 *                   paymentMethod:
 *                     type: string
 *                   promotion:
 *                     type: string
 *                   listProducts:
 *                     type: string
 *                   user_info:
 *                     type: string
 *                   totalOrderPrice:
 *                     type: integer
 *                   orderId:
 *                     type: string
 *                   tenantId:
 *                     type: integer
 *                   plusPoint:
 *                     type: integer
 */
router.get("/getTop5Products/getTop5Products/data", async (req, res) => {
  try {
    const orders = await orderService.getTop5Products();
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
  }
});

/**
 * @openapi
 * /api/orders/getMonthlyRevenueStats/getMonthlyRevenueStats/data:
 *   get:
 *     tags:
 *       - orders
 *     summary: Lấy danh sách đơn hàng
 *     description: Trả về danh sách tất cả đơn hàng trong hệ thống.
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   orderStatus:
 *                     type: string
 *                   paymentStatus:
 *                     type: boolean
 *                   paymentMethod:
 *                     type: string
 *                   promotion:
 *                     type: string
 *                   listProducts:
 *                     type: string
 *                   user_info:
 *                     type: string
 *                   totalOrderPrice:
 *                     type: integer
 *                   orderId:
 *                     type: string
 *                   tenantId:
 *                     type: integer
 *                   plusPoint:
 *                     type: integer
 */
router.get(
  "/getMonthlyRevenueStats/getMonthlyRevenueStats/data/:year",
  async (req, res) => {
    try {
      const orders = await orderService.getMonthlyRevenueStats(
        parseInt(req.params.year)
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
    }
  }
);

/**
 * @openapi
 * /api/orders/getRevenueStats/getRevenueStats/data:
 *   get:
 *     tags:
 *       - orders
 *     summary: Lấy danh sách đơn hàng
 *     description: Trả về danh sách tất cả đơn hàng trong hệ thống.
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   orderStatus:
 *                     type: string
 *                   paymentStatus:
 *                     type: boolean
 *                   paymentMethod:
 *                     type: string
 *                   promotion:
 *                     type: string
 *                   listProducts:
 *                     type: string
 *                   user_info:
 *                     type: string
 *                   totalOrderPrice:
 *                     type: integer
 *                   orderId:
 *                     type: string
 *                   tenantId:
 *                     type: integer
 *                   plusPoint:
 *                     type: integer
 */
router.get("/getRevenueStats/getRevenueStats/data/", async (req, res) => {
  try {
    const orders = await orderService.getRevenueStats();
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
  }
});

/**
 * @openapi
 * /api/orders/getTop5ProductsAllTime/getTop5ProductsAllTime/data:
 *   get:
 *     tags:
 *       - orders
 *     summary: Lấy danh sách đơn hàng
 *     description: Trả về danh sách tất cả đơn hàng trong hệ thống.
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   orderStatus:
 *                     type: string
 *                   paymentStatus:
 *                     type: boolean
 *                   paymentMethod:
 *                     type: string
 *                   promotion:
 *                     type: string
 *                   listProducts:
 *                     type: string
 *                   user_info:
 *                     type: string
 *                   totalOrderPrice:
 *                     type: integer
 *                   orderId:
 *                     type: string
 *                   tenantId:
 *                     type: integer
 *                   plusPoint:
 *                     type: integer
 */
router.get(
  "/getTop5ProductsAllTime/getTop5ProductsAllTime/data",
  async (req, res) => {
    try {
      const orders = await orderService.getTop5ProductsAllTime();
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách người dùng" });
    }
  }
);

/**
 * @openapi
 * /api/orders/getRevenueStatsData/getRevenueStatsData/data:
 *   get:
 *     tags:
 *       - orders
 *     summary: Thống kê doanh thu theo khoảng thời gian
 *     description: |
 *       Trả về thống kê doanh thu theo ngày, tháng hoặc năm dựa vào khoảng thời gian truyền vào.
 *       - `groupBy` = `day` → thống kê theo từng ngày trong khoảng
 *       - `groupBy` = `month` → thống kê theo từng tháng
 *       - `groupBy` = `year` → thống kê theo từng năm
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Ngày bắt đầu (YYYY-MM-DD)
 *         example: "2025-06-20"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Ngày kết thúc (YYYY-MM-DD)
 *         example: "2025-06-25"
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, month, year]
 *         required: true
 *         description: Kiểu thống kê (day, month, year)
 *         example: "day"
 *     responses:
 *       200:
 *         description: Dữ liệu thống kê doanh thu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   example: 2500000
 *                 stats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: "2025-06-20"
 *                       total:
 *                         type: number
 *                         example: 500000
 *       500:
 *         description: Lỗi server
 */
router.get(
  "/getRevenueStatsData/getRevenueStatsData/data",
  async (req, res) => {
    try {
      const { startDate, endDate, groupBy } = req.query;
      const orders = await orderService.getRevenueStatsData(
        startDate,
        endDate,
        groupBy
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Lỗi khi lấy dữ liệu thống kê" });
    }
  }
);

module.exports = router;
