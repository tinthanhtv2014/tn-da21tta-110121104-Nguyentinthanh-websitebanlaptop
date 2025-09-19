const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const { OAuth2Client } = require("google-auth-library");
const BaseRepository = require("base-repository");
const _userRepository = new BaseRepository("User");
const SECRET_KEY = process.env.SECRET_KEY; // replace with a secure secret key
const { startOfMonth, endOfMonth, subMonths } = require("date-fns");
const nodemailer = require("nodemailer");
const client = new OAuth2Client(
  "314663906441-s82hmdgf6mkdt9svna8ti2d530kb6d7l.apps.googleusercontent.com"
);
const twilio = require("twilio");
const accountSid = "AC27ca440e16221fc8ccb26f5773650a37"; // Lấy trong Twilio Console
const authToken = "989c5c2431e0d70ef90e6bf334d11482";
const clientTwilio = new twilio(accountSid, authToken);
// Auto-generate privateKey based on GuildId
const { parsePhoneNumberFromString } = require("libphonenumber-js");
function generatePrivateKey(guildId) {
  return `privateKey_${guildId}`;
}
function normalizePhone(rawPhone, defaultCountry = "VN") {
  if (!rawPhone) return null;

  const sanitized = rawPhone.replace(/[^\d+]/g, "");
  const phone = parsePhoneNumberFromString(sanitized, defaultCountry);
  if (!phone || !phone.isValid()) return null;

  return phone.number; // Trả về e164 format: +84395890398
}
// Register a new user
async function register(user) {
  const {
    emailAddress,
    firstName,
    lastName,
    phoneNumber,
    address,
    password,
    guildId,
  } = user;

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);
  let phoneFormat = null;
  if (phoneNumber) {
    phoneFormat = normalizePhone(phoneNumber);
  }
  // Create the user
  const newUser = await prisma.user.create({
    data: {
      emailAddress,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      phoneNumber: phoneFormat,
      address,
      passwordHash,
      privateKey: generatePrivateKey(guildId),
    },
  });

  // Generate JWT
  const token = jwt.sign({ id: newUser.id, role: newUser.role }, SECRET_KEY, {
    expiresIn: "1h",
  });

  return { user: newUser, token };
}

// Create a new user directly
async function createUser(user) {
  const {
    emailAddress,
    firstName,
    lastName,
    phoneNumber,
    address,
    points,
    status,
    password,
    role,
    guildId,
    avatar,
  } = user;

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);
  let phoneFormat = null;
  if (phoneNumber) {
    phoneFormat = normalizePhone(phoneNumber);
  }
  // Create the user with full data
  const newUser = await prisma.user.create({
    data: {
      emailAddress,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      phoneNumber: phoneFormat,
      address,
      points: parseInt(points),
      status,
      passwordHash,
      role: parseInt(role),
      privateKey: generatePrivateKey(guildId),
      avatar,
    },
  });

  return newUser;
}

// Login a user
async function login(emailAddress, password) {
  const user = await prisma.user.findUnique({
    where: { emailAddress },
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, role: user.role, points: user.points },
    SECRET_KEY,
    {
      expiresIn: "20h",
    }
  );

  return { user, token };
}

// Get all users (excluding passwordHash)
async function getUsers(search, pageCurrent, pageSize, sortList = []) {
  const skip = (pageCurrent - 1) * pageSize;

  const where = search
    ? {
        OR: [
          { fullName: { contains: search } },
          { emailAddress: { contains: search } },
          { phoneNumber: { contains: search } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: {
      updateDate: "desc", // Sắp xếp user theo ngày tạo mới nhất
    },
    select: {
      id: true,
      emailAddress: true,
      firstName: true,
      lastName: true,
      fullName: true,
      phoneNumber: true,
      address: true,
      points: true,
      status: true,
      createDate: true,
      updateDate: true,
      isDeleted: true,
      role: true,
      avatar: true,
      passwordHash: true,
    },
  });

  const totalUsers = await prisma.user.count({ where }); // Lấy tổng số user
  return { users, totalUsers };
}

async function getUsersSortList(search, pageCurrent, pageSize, sortList = []) {
  const filter = await _userRepository.reneRateInputFilter();
  if (search) {
    filter.searchValue = normalizeSearch(search);
  }
  filter.searchKey = ["name"];
  filter.pageSize = pageSize;
  filter.pageCurrent = pageCurrent;
  filter.orderBy = [{ updateDate: "desc" }];
  filter.sortList = sortList;
  const data = await _userRepository.toListAsync(filter);
  return { users: data.listData, totalUsers: data.total };
}

// Get user by ID
async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      emailAddress: true,
      firstName: true,
      lastName: true,
      fullName: true,
      phoneNumber: true,
      address: true,
      points: true,
      status: true,
      createDate: true,
      updateDate: true,
      isDeleted: true,
      role: true,
      passwordHash: true,
      avatar: true,
    },
  });
  return user;
}

// Update user
async function updateUser(id, user) {
  const {
    emailAddress,
    firstName,
    lastName,
    phoneNumber,
    address,
    points,
    status,
    password,
    role,
    avatar,
  } = user;
  let phoneFormat = null;
  if (phoneNumber) {
    phoneFormat = normalizePhone(phoneNumber);
  }
  console.log("sadadad", phoneFormat);
  // Hash the new password if provided
  const data = {
    emailAddress,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    phoneNumber: phoneFormat,
    address,
    points: parseInt(points),
    status,
    role: parseInt(role),
    avatar,
  };

  if (password) {
    data.passwordHash = await bcrypt.hash(password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data,
  });
  return updatedUser;
}

// Soft delete user
async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id: parseInt(id) },
  });
}

const verifyAdmin = async (accessToken) => {
  try {
    // Giải mã token
    const decoded = jwt.verify(accessToken, SECRET_KEY);

    const role = decoded.role;
    const findRole = await prisma.role.findUnique({
      where: {
        id: parseInt(role),
      },
    });

    if (findRole.roleName === "admin") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error decoding token or querying database:", error);
    return res.status(401).json({
      EM: `Invalid token: ${error.message}`, // Thông báo lỗi token không hợp lệ
      EC: 401,
      DT: { isAdmin: false }, // Token không hợp lệ, trả về false
    });
  }
};

async function verifyGoogleToken(ggToken) {
  try {
    // Xác minh token với Google
    const ticket = await client.verifyIdToken({
      idToken: ggToken,
      audience:
        "314663906441-s82hmdgf6mkdt9svna8ti2d530kb6d7l.apps.googleusercontent.com", // Thay bằng client ID chính xác
    });

    const payload = ticket.getPayload();
    const emailAddress = payload.email; // Email từ Google payload
    let user = await prisma.user.findFirst({ where: { emailAddress } });
    let token;
    let statusUser = "";
    if (user) {
      // Người dùng đã tồn tại -> Tạo JWT
      token = await createToken(user);
      statusUser = "LOGIN";
    } else {
      // Người dùng chưa tồn tại -> Tạo mới
      const newUser = await prisma.user.create({
        data: {
          emailAddress: payload.email,
          firstName: payload.given_name || "",
          lastName: payload.family_name || "",
          fullName: payload.given_name + payload.family_name || "",
          phoneNumber: "",
          address: "",
          points: 0,
          status: "A",
          passwordHash: "",
          role: 0,
          privateKey: generatePrivateKey(),
        },
      });

      user = newUser;
      token = await createToken(user);
      statusUser = "REGISTER";
    }

    console.log("Google token verified successfully", user.id);
    return { user, token, statusUser };
  } catch (error) {
    console.error("Google token verification failed", error);
    throw new Error("Google token verification failed");
  }
}

async function createToken(user) {
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      emailAddress: user.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      address: user.address,
      phoneNumber: user.phoneNumber,
      privateKey: user.privateKey,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );

  return token;
}

async function updateDynamicUser(userId, data) {
  try {
    const updateFields = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != null)
    );

    if (Object.keys(updateFields).length === 0) {
      throw new Error("Không có dữ liệu hợp lệ để cập nhật.");
    }

    if (updateFields.phoneNumber) {
      updateFields.phoneNumber = normalizePhone(updateFields.phoneNumber);
    }
    return await _userRepository.updateAsync(userId, updateFields);
  } catch (err) {
    console.error("Lỗi khi cập nhật người dùng:", err);
  }
}

async function updateAvatarUser(id, user) {
  const { avatar } = user;

  // Hash the new password if provided
  const data = {
    avatar,
  };

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data,
  });
  return updatedUser;
}

async function updatePasswordUser(id, newPassword) {
  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { passwordHash: passwordHash },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
}

async function updatePointUser(id, point, key) {
  try {
    const numericPoint = Number(point);
    if (isNaN(numericPoint) || numericPoint < 0) {
      throw new Error("Điểm phải là số dương hợp lệ");
    }

    let pointValue = 0;

    if (key === "add") {
      pointValue = numericPoint;
    } else if (key === "subtract") {
      pointValue = -numericPoint;
    } else {
      throw new Error("Key không hợp lệ: phải là 'add' hoặc 'subtract'");
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        points: {
          increment: pointValue,
        },
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("❌ Error updating user point:", error);
    throw error;
  }
}

async function getUserStats() {
  const today = new Date();

  // Tháng này
  const currentMonthStart = startOfMonth(today);
  const currentMonthEnd = endOfMonth(today);

  const currentMonthUsers = await prisma.user.count({
    where: {
      createDate: {
        gte: currentMonthStart,
        lte: currentMonthEnd,
      },
    },
  });

  // Tháng trước
  const lastMonthDate = subMonths(today, 1);
  const lastMonthStart = startOfMonth(lastMonthDate);
  const lastMonthEnd = endOfMonth(lastMonthDate);

  const lastMonthUsers = await prisma.user.count({
    where: {
      createDate: {
        gte: lastMonthStart,
        lte: lastMonthEnd,
      },
    },
  });

  // Tính chênh lệch và %
  const diff = currentMonthUsers - lastMonthUsers;
  const percentChange =
    lastMonthUsers === 0 ? 100 : (diff / lastMonthUsers) * 100;

  return {
    total: currentMonthUsers,
    diff,
    percent: percentChange,
  };
}

async function getNewUsersByMonth(year) {
  const results = [];

  for (let month = 0; month < 12; month++) {
    const start = startOfMonth(new Date(year, month, 1));
    const end = endOfMonth(new Date(year, month, 1));

    const count = await prisma.user.count({
      where: {
        createDate: {
          gte: start,
          lte: end,
        },
      },
    });

    results.push({
      month: month + 1,
      count,
    });
  }

  return results;
}

async function sendMailAsync(sendTo, subject, content, htmlTemplate) {
  try {
    // Tạo transporter với cấu hình SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Thay bằng SMTP server bạn sử dụng
      port: 587, // Port SMTP
      secure: false, // true nếu sử dụng SSL/TLS
      auth: {
        user: process.env.GMAIL_APP_USER, // Email của bạn
        pass: process.env.GMAIL_APP_PASSWWORD, // Mật khẩu ứng dụng (app password) nếu dùng Gmail
      },
    });

    // Cấu hình email
    const mailOptions = {
      from: process.env.GMAIL_APP_USER, // Người gửi
      to: sendTo, // Người nhận
      subject: subject, // Tiêu đề
      text: content, // Nội dung dạng text
      html: htmlTemplate, // Nội dung dạng HTML (tùy chọn)
    };

    // Gửi email
    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Hàm gửi OTP

async function sendOtp(email) {
  try {
    // 1. Kiểm tra user trong DB
    const user = await prisma.user.findFirst({
      where: { emailAddress: email }, // đổi field nếu DB bro là "email"
    });

    if (!user) {
      return 404;
    }

    // 2. Generate OTP
    const otp = generateOtp(6);

    const subject = "Mã OTP xác thực của bạn";
    const textContent = `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height:1.5">
        <h2>🔐 Mã OTP xác thực</h2>
        <p>Xin chào ${user.fullName || ""},</p>
        <p>Mã OTP của bạn là: <b style="font-size:18px; color:#2c3e50">${otp}</b></p>
        <p>Mã sẽ hết hạn sau <b>5 phút</b>. Vui lòng không chia sẻ cho bất kỳ ai.</p>
        <hr/>
        <p style="font-size:12px; color:gray">Email được gửi từ hệ thống.</p>
      </div>
    `;

    // 3. Gửi mail
    await sendMailAsync(email, subject, textContent, htmlContent);

    return otp;
  } catch (err) {
    console.error("Send OTP error:", err);
    throw err;
  }
}

function generateOtp(length = 6) {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  ).toString();
}

async function updatePasswordUserWithEmail(identifier, newPassword) {
  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Regex đơn giản để check có phải email hay không
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    let updatedUser;

    if (isEmail) {
      // update theo email
      updatedUser = await prisma.user.updateMany({
        where: { emailAddress: identifier },
        data: { passwordHash },
      });
    } else {
      // update theo phone
      updatedUser = await prisma.user.updateMany({
        where: { phoneNumber: identifier },
        data: { passwordHash },
      });
    }

    return updatedUser; // { count: n }
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
}
async function sendOrderConfirmationEmail(order) {
  try {
    const subject = `Xác nhận đơn hàng #${order.orderId}`;
    const textContent = `
      Xin chào ${order.customerName},

      Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi!
      Mã đơn hàng của bạn: ${order.orderId}.
      Tổng giá trị: ${order.total.toLocaleString("vi-VN")} VND.

      Sản phẩm:
      ${order.items
        .map(
          (item) =>
            `- ${item.name} (x${item.quantity}): ${item.price.toLocaleString(
              "vi-VN"
            )} VND`
        )
        .join("\n")}

      Chúng tôi sẽ liên hệ bạn sớm nhất để giao hàng.
    `;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height:1.6; max-width:600px; margin:auto; color:#333">
        <h2 style="color:#2e86de">✅ Đặt hàng thành công</h2>
        <p>Xin chào <b>${order.customerName}</b>,</p>
        <p>Cảm ơn bạn đã mua hàng tại <b>Shop Laptop</b>!</p>
        <p><b>Mã đơn hàng:</b> ${order.orderId}</p>
        <p><b>Tổng giá trị:</b> <span style="color:#e74c3c; font-size:16px">${order.total.toLocaleString(
          "vi-VN"
        )} VND</span></p>

        <h3>🛒 Chi tiết đơn hàng:</h3>
        <table style="width:100%; border-collapse:collapse; margin-top:10px">
          <thead>
            <tr style="background:#f2f2f2; text-align:left">
              <th style="padding:8px; border:1px solid #ddd">Sản phẩm</th>
              <th style="padding:8px; border:1px solid #ddd">Hình ảnh</th>
              <th style="padding:8px; border:1px solid #ddd">Số lượng</th>
              <th style="padding:8px; border:1px solid #ddd">Giá</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
                <tr>
                  <td style="padding:8px; border:1px solid #ddd">${
                    item.name
                  }</td>
                  <td style="padding:8px; border:1px solid #ddd; text-align:center">
                    <img src="${item.imageUrl}" alt="${
                  item.name
                }" style="max-width:60px; max-height:60px; border-radius:4px"/>
                  </td>
                  <td style="padding:8px; border:1px solid #ddd; text-align:center">${
                    item.quantity
                  }</td>
                  <td style="padding:8px; border:1px solid #ddd; color:#e67e22; font-weight:bold">
                    ${item.price.toLocaleString("vi-VN")} VND
                  </td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>

        <p style="margin-top:20px">📦 Chúng tôi sẽ liên hệ bạn sớm để giao hàng.</p>
        <hr/>
        <p style="font-size:12px; color:gray">Đây là email tự động, vui lòng không trả lời.</p>
      </div>
    `;

    return await sendMailAsync(order.email, subject, textContent, htmlContent);
  } catch (err) {
    console.error("Send order email error:", err);
    throw err;
  }
}

async function sendSms(phone) {
  try {
    if (phone) {
      phone = normalizePhone(phone);
    }
    const otp = generateOtp(6);
    const message = await clientTwilio.messages.create({
      body: `Hello, đây là tin nhắn test từ Twilio 🚀, đây là OTP: ${otp}`,
      from: "+18324004087", // số Twilio cấp
      to: phone, // số thật của bro (có +84)
    });
    return otp;
  } catch (err) {
    console.error("Error:", err);
  }
}

module.exports = {
  register,
  login,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  verifyAdmin,
  verifyGoogleToken,
  updateDynamicUser,
  updateAvatarUser,
  updatePasswordUser,
  getUsersSortList,
  updatePointUser,
  getUserStats,
  getNewUsersByMonth,
  sendMailAsync,
  sendOtp,
  updatePasswordUserWithEmail,
  sendOrderConfirmationEmail,
  sendSms,
};
