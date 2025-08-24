const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const BaseRepository = require("base-repository");
const uservoucherRepository = new BaseRepository("UserVoucher");

// Tạo mới cài đặt

const normalizeSearch = (str) =>
  str
    .trim() // xoá khoảng trắng đầu/cuối
    .replace(/\s+/g, " "); // thay nhiều dấu cách liên tiếp bằng 1 dấu cách
async function createUserVoucher(voucher) {
  try {
    let input = uservoucherRepository.getModels("UserVoucher");
    input = uservoucherRepository.autoMapWithModel(voucher);
    return await uservoucherRepository.createAsync(input);
  } catch (error) {
    console.error("Error creating Notification:", error);
    throw error;
  }
}

async function getuserVoucher(
  search,
  pageCurrent,
  pageSize,
  sortList = [],
  optionExtend = []
) {
  try {
    const filter = uservoucherRepository.reneRateInputFilter();
    if (search) {
      filter.searchValue = normalizeSearch(search);
    }
    filter.searchKey = ["name"];
    filter.pageCurrent = pageCurrent;
    filter.pageSize = pageSize;
    filter.sortList = sortList;
    filter.orderBy = [{ id: "desc" }];

    const queryDb = uservoucherRepository.joinQuery("Voucher", voucherDto);

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

async function getVoucherByuserId(id) {
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

async function deleteVoucher(userId, voucherId) {
  const voucher = await prisma.userVoucher.findFirst({
    where: {
      voucherId: parseInt(voucherId),
      userId: parseInt(userId),
    },
  });

  if (!voucher) {
    throw new Error("Không tìm thấy voucher tương ứng với user.");
  }

  await prisma.userVoucher.delete({
    where: {
      id: voucher.id,
    },
  });
}
module.exports = {
  createUserVoucher,
  getuserVoucher,
  deleteVoucher,
};
