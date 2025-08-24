const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Baserepository = require("base-repository");
const orderRepository = new Baserepository("Order");
const { v4: uuidv4 } = require("uuid");
const {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  subYears,
} = require("date-fns");
// Create a new Order
async function createOrder(order) {
  const {
    cartItems,
    paymentMethod,
    userInfo,
    promotion,
    orderId,
    userId,
    plusPoint,
    totalAmount,
    note,
  } = order;

  console.log("order", order);
  const quantityOrder = cartItems ? cartItems.length : 0;

  // Tính tổng giá trị đơn hàng trước & sau khi áp dụng voucher
  let totalOrderPrice = parseFloat(totalAmount);

  // Áp dụng giảm giá nếu có
  if (promotion) {
    priceAfterVoucher =
      (priceAfterVoucher * (100 - promotion.discountRate)) / 100 || 0;
  }

  // Tạo đơn hàng
  const input = {
    quantity: quantityOrder,
    userId: userId != 0 ? userId : null,
    orderStatus: "pending",
    paymentStatus: paymentMethod !== "home",
    paymentMethod,
    promotion: promotion || "",
    listProducts: JSON.stringify(cartItems),
    user_info: JSON.stringify(userInfo),
    totalOrderPrice,
    orderId: orderId || uuidv4(),
    userUpdate: userId,
    plusPoint,
    note: note || "không có ghi chú",
  };
  return await orderRepository.createAsync(input);
}

// Get all products
async function getAllOrder(search, pageCurrent, pageSize) {
  try {
    //   const products = await prisma.product.findMany({
    //     include: {
    //       category: true, // Optional: include category info
    //     },
    //   });
    //   return products;
    const filter = await orderRepository.reneRateInputFilter();
    filter.pageCurrent = pageCurrent;
    filter.search = search;
    filter.pageSize = pageSize;
    filter.orderBy = [{ updateDate: "desc" }];
    return await orderRepository.toListAsync(filter);
  } catch (error) {
    throw new Error("Error fetching products");
  }
}

// Get product by ID
async function getOrderById(id) {
  try {
    return orderRepository.firstOrDefautAsync({ id: parseInt(id) });
  } catch (error) {
    throw new Error("Error fetching product");
  }
}

// Update product by ID
async function updateOrder(id, data) {
  try {
    // const updatedProduct = await prisma.product.update({
    //   where: { id: Number(id) },
    //   data,
    // });
    // return updatedProduct;
    const dataInput = await orderRepository.autoMapWithModel(data);
    return orderRepository.updateAsync(id, dataInput);
  } catch (error) {
    throw new Error("Error updating product");
  }
}

// Delete product by ID
async function deleteOrder(id) {
  try {
    const deletedProduct = await prisma.order.delete({
      where: { id: Number(id) },
    });
    return deletedProduct;
  } catch (error) {
    throw new Error("Error deleting product");
  }
}

async function getAllOrderbyUserId(
  search,
  pageCurrent,
  pageSize,
  userId,
  sortList = []
) {
  try {
    //   const products = await prisma.product.findMany({
    //     include: {
    //       category: true, // Optional: include category info
    //     },
    //   });
    //   return products;

    const filter = await orderRepository.reneRateInputFilter();
    filter.where = [{ userId: parseInt(userId) }];
    filter.search = search;
    filter.pageCurrent = pageCurrent;
    filter.pageSize = pageSize;
    filter.sortList = sortList;
    return await orderRepository.toListAsync(filter);
  } catch (error) {
    throw new Error("Error fetching products");
  }
}

async function updateOrderCanceled(id) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        orderStatus: "cancelled", // hoặc "Đã huỷ" nếu dùng chuỗi tiếng Việt
      },
    });
    return updatedOrder;
  } catch (error) {
    throw new Error("Error updating order");
  }
}

async function getOrderStatusStats() {
  try {
    const stats = await prisma.order.groupBy({
      by: ["orderStatus"], // group theo field
      _count: {
        orderStatus: true, // đếm số lượng theo trạng thái
      },
      _sum: {
        totalOrderPrice: true, // tổng tiền theo trạng thái
      },
    });

    // Đổi _count.orderStatus thành count để gọn hơn
    return stats.map((item) => ({
      orderStatus: item.orderStatus,
      count: item._count.orderStatus,
      totalOrderPrice: item._sum.totalOrderPrice || 0,
    }));
  } catch (err) {
    console.error("Lỗi lấy thống kê trạng thái đơn hàng:", err);
    throw err;
  }
}

async function getTop5Products() {
  // Lấy toàn bộ order có listProducts
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );
  const orders = await prisma.order.findMany({
    where: {
      createDate: {
        gte: firstDayOfMonth,
        lt: firstDayOfNextMonth,
      },
    },
    select: {
      listProducts: true,
    },
  });

  const productCountMap = new Map();

  orders.forEach((order) => {
    let products = [];
    try {
      products =
        typeof order.listProducts === "string"
          ? JSON.parse(order.listProducts)
          : order.listProducts;
    } catch (err) {
      console.error("Lỗi parse listProducts:", err);
      return;
    }

    products.forEach((product) => {
      const key = product.id;
      const quantity = product.quantity || 0;

      if (!productCountMap.has(key)) {
        productCountMap.set(key, {
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          totalQuantity: 0,
        });
      }

      const current = productCountMap.get(key);
      current.totalQuantity += quantity;
    });
  });

  // Convert map -> array
  const resultArray = Array.from(productCountMap.values());

  // Sắp xếp giảm dần theo totalQuantity
  resultArray.sort((a, b) => b.totalQuantity - a.totalQuantity);

  // Lấy top 5
  return resultArray.slice(0, 5);
}

async function getMonthlyRevenueStats(year) {
  // Lấy dữ liệu đã group theo tháng
  console.log("sdadasdad", year);
  const stats = await prisma.order.groupBy({
    by: ["createDate"],
    where: {
      orderStatus: "success",
      createDate: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
    _sum: {
      totalOrderPrice: true,
    },
  });

  // Map dữ liệu theo key "YYYY-MM"
  const monthlyMap = {};
  stats.forEach((item) => {
    const month = item.createDate.getMonth(); // 0-11
    if (!monthlyMap[month]) {
      monthlyMap[month] = 0;
    }
    monthlyMap[month] += Number(item._sum.totalOrderPrice || 0);
  });

  // Tạo đủ 12 tháng
  const result = Array.from({ length: 12 }, (_, i) => {
    return {
      month: `${i + 1}`, // Hoặc format thành 'Jan', 'Feb' cho chart
      totalRevenue: monthlyMap[i] || 0,
    };
  });

  return result;
}

async function getRevenueStats() {
  const today = new Date();

  // === Doanh thu hiện tại ===
  const daily = await prisma.order.aggregate({
    _sum: { totalOrderPrice: true },
    where: {
      createDate: { gte: startOfDay(today), lte: endOfDay(today) },
      orderStatus: "success",
    },
  });

  const monthly = await prisma.order.aggregate({
    _sum: { totalOrderPrice: true },
    where: {
      createDate: { gte: startOfMonth(today), lte: endOfMonth(today) },
      orderStatus: "success",
    },
  });

  const yearly = await prisma.order.aggregate({
    _sum: { totalOrderPrice: true },
    where: {
      createDate: { gte: startOfYear(today), lte: endOfYear(today) },
      orderStatus: "success",
    },
  });

  // === Doanh thu kỳ trước ===
  const yesterday = subDays(today, 1);
  const prevDay = await prisma.order.aggregate({
    _sum: { totalOrderPrice: true },
    where: {
      createDate: { gte: startOfDay(yesterday), lte: endOfDay(yesterday) },
      orderStatus: "success",
    },
  });

  const lastMonthDate = subMonths(today, 1);
  const prevMonth = await prisma.order.aggregate({
    _sum: { totalOrderPrice: true },
    where: {
      createDate: {
        gte: startOfMonth(lastMonthDate),
        lte: endOfMonth(lastMonthDate),
      },
      orderStatus: "success",
    },
  });

  const lastYearDate = subYears(today, 1);
  const prevYear = await prisma.order.aggregate({
    _sum: { totalOrderPrice: true },
    where: {
      createDate: {
        gte: startOfYear(lastYearDate),
        lte: endOfYear(lastYearDate),
      },
      orderStatus: "success",
    },
  });

  // === Helper tính % ===
  function calcChange(current, previous) {
    const diff = current - previous;
    let percent = 0;
    if (previous === 0) {
      percent = current > 0 ? 100 : 0;
    } else {
      percent = (diff / previous) * 100;
    }
    return {
      value: current,
      diff,
      percent: Number(percent.toFixed(2)), // làm tròn 2 số
    };
  }

  return {
    daily: calcChange(
      daily._sum.totalOrderPrice || 0,
      prevDay._sum.totalOrderPrice || 0
    ),
    monthly: calcChange(
      monthly._sum.totalOrderPrice || 0,
      prevMonth._sum.totalOrderPrice || 0
    ),
    yearly: calcChange(
      yearly._sum.totalOrderPrice || 0,
      prevYear._sum.totalOrderPrice || 0
    ),
  };
}

async function getTop5ProductsAllTime() {
  // Lấy toàn bộ order có listProducts
  const orders = await prisma.order.findMany({
    select: {
      listProducts: true,
    },
  });

  const productCountMap = new Map();

  orders.forEach((order) => {
    let products = [];
    try {
      products =
        typeof order.listProducts === "string"
          ? JSON.parse(order.listProducts)
          : order.listProducts;
    } catch (err) {
      console.error("Lỗi parse listProducts:", err);
      return;
    }

    products.forEach((product) => {
      const key = product.id;
      const quantity = product.quantity || 0;

      if (!productCountMap.has(key)) {
        productCountMap.set(key, {
          id: product.id,
          name: product.name,
          totalQuantity: 0,
        });
      }

      const current = productCountMap.get(key);
      current.totalQuantity += quantity;
    });
  });

  // Convert map -> array
  const resultArray = Array.from(productCountMap.values());

  // Sắp xếp giảm dần theo totalQuantity
  resultArray.sort((a, b) => b.totalQuantity - a.totalQuantity);

  // Lấy top 5
  const top5 = resultArray.slice(0, 5);

  // Format dữ liệu cho biểu đồ tròn
  const pieChartData = top5.map((product) => ({
    name: product.name,
    value: product.totalQuantity,
  }));

  return pieChartData;
}

async function getRevenueStatsData(startDate, endDate, groupBy) {
  // Lấy toàn bộ order trong khoảng thời gian
  const { start, end } = adjustDateRange(startDate, endDate, groupBy);
  const orders = await prisma.order.findMany({
    where: {
      createDate: {
        gte: start,
        lte: end,
      },
      isDeleted: false,
      orderStatus: "success", // Chỉ tính đơn đã thanh toán
    },
    select: {
      totalOrderPrice: true,
      createDate: true,
    },
  });

  const fillter = orderRepository.reneRateInputFilter();
  fillter.where = [
    {
      createDate: {
        gte: start,
        lte: end,
      },
      orderStatus: "success",
    },
  ];
  fillter.pageSize = 1000;

  const data = await orderRepository.toListAsync(fillter);

  // Format key group
  const formatKey = (date) => {
    const d = new Date(date);
    if (groupBy === "day") {
      return d.toISOString().slice(0, 10); // YYYY-MM-DD
    }
    if (groupBy === "month") {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
    }
    if (groupBy === "year") {
      return `${d.getFullYear()}`;
    }
  };

  // Gom nhóm & cộng doanh thu
  const resultMap = {};
  data.listData.forEach((order) => {
    const key = formatKey(order.createDate);
    if (!resultMap[key]) {
      resultMap[key] = 0;
    }
    resultMap[key] += order.totalOrderPrice;
  });

  // Chuyển sang dạng mảng để render chart
  const resultArray = Object.keys(resultMap).map((key) => ({
    ...resultMap,
    time: key,
    revenue: resultMap[key],
  }));

  return data;
}

const adjustDateRange = (startDate, endDate, groupBy) => {
  const start = startDate ? new Date(startDate) : new Date();
  const end = endDate ? new Date(endDate) : new Date();

  // Nếu bị Invalid Date thì fallback về ngày hiện tại
  if (isNaN(start.getTime())) start.setTime(Date.now());
  if (isNaN(end.getTime())) end.setTime(Date.now());

  if (groupBy === "month") {
    // Bắt đầu từ ngày 1 của tháng startDate
    start.setDate(1);
    // Kết thúc vào ngày cuối của tháng endDate
    end.setMonth(end.getMonth() + 1, 0);
  }

  if (groupBy === "year") {
    // Bắt đầu từ 1/1 của năm startDate
    start.setMonth(0, 1);
    // Kết thúc vào 31/12 của năm endDate
    end.setMonth(11, 31);
  }

  return { start, end };
};
module.exports = {
  createOrder,
  getAllOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getAllOrderbyUserId,
  updateOrderCanceled,
  getOrderStatusStats,
  getTop5Products,
  getMonthlyRevenueStats,
  getRevenueStats,
  getTop5ProductsAllTime,
  getRevenueStatsData,
};
