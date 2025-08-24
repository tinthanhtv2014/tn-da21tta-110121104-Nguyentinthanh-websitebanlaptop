const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const BaseRepository = require("base-repository");
const voucherRepository = new BaseRepository("Voucher");

// Tạo mới cài đặt

const normalizeSearch = (str) =>
  str
    .trim() // xoá khoảng trắng đầu/cuối
    .replace(/\s+/g, " "); // thay nhiều dấu cách liên tiếp bằng 1 dấu cách
async function createVoucher(voucher) {
  try {
    const existingVoucher = await voucherRepository.firstOrDefautAsync({
      code: voucher.code,
    });

    if (existingVoucher) {
      return {
        statusCode: 409, // Mã lỗi HTTP cho "Conflict"
        message:
          "Voucher code này đã tồn tại, vui lòng chọn Voucher code khác.",
        code: "P2002", // Mã lỗi Prisma cho vi phạm ràng buộc duy nhất
      };
    }

    voucher.startDate = new Date(voucher.startDate);
    voucher.expiryDate = new Date(voucher.expiryDate);
    voucher.addedValue = voucher.addedValue || 0;
    voucher.totalDenomination = voucher.totalDenomination || 0;
    let input = voucherRepository.getModels("Voucher");
    input = voucherRepository.autoMapWithModel(voucher);
    return await voucherRepository.createAsync(input);
  } catch (error) {
    console.error("Error creating Notification:", error);
    throw error;
  }
}

async function getVoucher(
  search,
  pageCurrent,
  pageSize,
  sortList = [],
  optionExtend = []
) {
  try {
    const filter = voucherRepository.reneRateInputFilter();
    if (search) {
      filter.searchValue = normalizeSearch(search);
    }
    filter.searchKey = ["name"];
    filter.pageCurrent = pageCurrent;
    filter.pageSize = pageSize;
    filter.sortList = sortList;
    filter.orderBy = [{ id: "desc" }];

    if (optionExtend.find((x) => x.key === "userId")) {
      const userIdFind = optionExtend.find((x) => x.key == "userId").value;
      if (userIdFind > 0) {
        filter.where = [
          {
            userVoucher: {
              none: {
                userId: userIdFind,
              },
            },
          },
        ];
      }
    }

    const voucherDto = voucherRepository.getModels("UserVoucher", [
      "id",
      "userId",
      "voucherId",
    ]);
    const queryDb = voucherRepository.joinQuery("userVoucher", voucherDto);

    if (optionExtend.find((x) => x.key == "tenantId")) {
      const tenantId = optionExtend.find((x) => x.key == "tenantId").value;
      if (tenantId > 0) {
        queryDb.whereQuery(["tenantId"], [tenantId]);
      }
    }

    const responsive = await queryDb.toListAsync(filter);
    return {
      listData: responsive.listData,
      total: responsive.total,
    };
  } catch (error) {
    console.error("Error fetching notify:", error);
    return {
      statusCode: 500,
      message: "Service error",
    };
  }
}

async function getVoucherById(id) {
  try {
    const voucher = await voucherRepository.firstOrDefautAsync({
      id: parseInt(id),
    });

    return voucher;
  } catch (error) {
    console.error("Error fetching voucher:", error);
    return {
      statusCode: 500,
      message: "Service error",
    };
  }
}

async function updateVoucher(id, voucher) {
  try {
    const existingVoucher = await voucherRepository.firstOrDefautAsync({
      code: voucher.code,
    });

    if (existingVoucher && existingVoucher.id !== parseInt(id)) {
      return {
        statusCode: 409,
        message: "voucher code này đã tồn tại",
      };
    }

    voucher.startDate = new Date(voucher.startDate);
    voucher.expiryDate = new Date(voucher.expiryDate);
    voucher.addedValue = voucher.addedValue || 0;
    voucher.totalDenomination = voucher.totalDenomination || 0;
    const updateInput = await voucherRepository.autoMapWithModel(voucher);

    const voucherUpdate = await voucherRepository.updateAsync(
      parseInt(id),
      updateInput
    );

    return voucherUpdate;
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return {
      statusCode: 500,
      message: "Service error",
    };
  }
}

async function deleteVoucher(id) {
  await prisma.voucher.delete({
    where: { id: parseInt(id) },
  });
}

async function deleteVoucherTemperary(id) {
  try {
    await prisma.voucher.update({
      where: { id: parseInt(id) },
      data: {
        isDeleted: true,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình lấy danh sách sản phẩm.",
      error: error.message,
    });
  }
}

/////tính tiền cho frontend
async function caculateOrder(priceListCart, VAT, SHIP, vouchers) {
  let totalDiscount = 0;
  let isFreeShip = false;

  // Nếu có voucher, duyệt qua các voucher để tính giảm giá
  if (Array.isArray(vouchers) && vouchers.length > 0) {
    vouchers.forEach((voucher) => {
      if (voucher.type === "gift") {
        totalDiscount +=
          (parseInt(priceListCart) * parseInt(voucher.discountPercent)) / 100; // Giảm giá tiền mặt
      } else if (voucher.type === "discount") {
        totalDiscount +=
          (parseInt(priceListCart) * parseInt(voucher.discountPercent)) / 100; // Giảm giá theo phần trăm
      } else if (voucher.type === "ship") {
        if (voucher.isFreeShipping) {
          isFreeShip = true;
        } else {
          // if (voucher.discountAmount) {
          //   totalDiscount += parseInt(voucher.discountAmount);
          // }
          if (voucher.discountPercent) {
            totalDiscount +=
              (parseInt(priceListCart) * parseInt(voucher.discountPercent)) /
              100;
          }
        }
      }
    });
  }

  let discountedTotal = parseInt(priceListCart) - totalDiscount;

  // Áp dụng VAT
  const vatAmount = (discountedTotal * VAT.valuephantram) / 100;
  discountedTotal += vatAmount;

  // Thêm phí vận chuyển nếu không có voucher miễn phí vận chuyển
  if (!isFreeShip) {
    discountedTotal += parseInt(SHIP.valuechinh);
  }

  return discountedTotal;
}

async function getListPointVoucher(
  search,
  pageCurrent,
  pageSize,
  sortList = [],
  optionExtend = []
) {
  try {
    const filter = voucherRepository.reneRateInputFilter();
    filter.search = search;
    filter.searchKey = ["id", "name"];
    filter.pageCurrent = pageCurrent;
    filter.pageSize = pageSize;
    filter.sortList = sortList;
    filter.orderBy = [{ id: "desc" }];

    const responsive = await queryDb.toListAsync(filter);
    return {
      listData: responsive.listData,
      total: responsive.total,
    };
  } catch (error) {
    console.error("Error fetching notify:", error);
    return {
      statusCode: 500,
      message: "Service error",
    };
  }
}

async function getVoucherUser(
  search,
  pageCurrent,
  pageSize,
  sortList = [],
  optionExtend = []
) {
  try {
    const filter = voucherRepository.reneRateInputFilter();
    if (search) {
      filter.searchValue = normalizeSearch(search);
    }
    filter.searchKey = ["name"];
    filter.pageCurrent = pageCurrent;
    filter.pageSize = pageSize;
    filter.sortList = sortList;
    filter.orderBy = [{ id: "desc" }];

    if (optionExtend.find((x) => x.key === "userId")) {
      const userIdFind = optionExtend.find((x) => x.key == "userId").value;
      if (userIdFind > 0) {
        filter.where = [
          {
            userVoucher: {
              some: {
                userId: userIdFind,
              },
            },
          },
        ];
      }
    }

    const voucherDto = voucherRepository.getModels("UserVoucher", [
      "id",
      "userId",
      "voucherId",
    ]);
    const queryDb = voucherRepository.joinQuery("userVoucher", voucherDto);

    if (optionExtend.find((x) => x.key == "tenantId")) {
      const tenantId = optionExtend.find((x) => x.key == "tenantId").value;
      if (tenantId > 0) {
        queryDb.whereQuery(["tenantId"], [tenantId]);
      }
    }

    const responsive = await queryDb.toListAsync(filter);
    return {
      listData: responsive.listData,
      total: responsive.total,
    };
  } catch (error) {
    console.error("Error fetching notify:", error);
    return {
      statusCode: 500,
      message: "Service error",
    };
  }
}

module.exports = {
  createVoucher,
  getVoucher,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  deleteVoucherTemperary,
  caculateOrder,
  getVoucherUser,
};
