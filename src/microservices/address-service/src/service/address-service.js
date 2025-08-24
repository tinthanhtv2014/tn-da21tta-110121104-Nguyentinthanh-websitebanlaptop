const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const BaseRepository = require("base-repository");
const ProvinceRepository = new BaseRepository("provinces");
const DistrictRepository = new BaseRepository("districts");
const WardsRepository = new BaseRepository("wards");
const Province = require("../models/mongo-models/mgo-province");
const Ward = require("../models/mongo-models/mgo-wards");
// async function getAllProvince() {
//   const querydb = await ProvinceRepository.toListAsync();
//   return querydb;
// }

// async function getDistrictId(id) {
//   const querydb = await DistrictRepository.whereQuery(
//     ["province_code"],
//     [id]
//   ).toListAsync();
//   return querydb;
// }

// async function getWardId(id) {
//   const querydb = await WardsRepository.whereQuery(
//     ["district_code"],
//     [id]
//   ).toListAsync();
//   return querydb;
// }

async function getAllProvince() {
  try {
    // const response = await axios.get(`${GOBER_URL}/api/v1/provinces`);

    const provinces = await Province.find().lean(); // lấy toàn bộ, không include metadata mongoose

    if (!Array.isArray(provinces) || provinces.length === 0) {
      throw new Error("Không có dữ liệu tỉnh/thành trong database");
    }

    return {
      data: provinces,
    };
    // return response.data; // hoặc response.data.listData nếu API trả về theo format đó
  } catch (error) {
    console.error("Error fetching provinces:", error.message);
    throw error;
  }
}

async function getWardId(provinceId) {
  try {
    // const provinces = await Province.find().lean();
    // const data = provinces;
    // const dataWard = wards();
    // const mappedWards = dataWard.map((ward) => {
    //   const fullName = ward.fullName;
    //   const provinceNameFromWard = fullName
    //     .split(",")
    //     .pop()
    //     .trim()
    //     .toLowerCase(); // lấy phần sau dấu phẩy

    //   // Tìm trong danh sách tỉnh
    //   const matchedProvince = provinces.find(
    //     (p) => p.fullName.trim().toLowerCase() === provinceNameFromWard
    //   );

    //   // Nếu tìm được → gán thêm provinceId vào ward
    //   return {
    //     ...ward,
    //     provinceId: matchedProvince ? matchedProvince.id : null,
    //   };
    // });

    const ward = await Ward.find({ provinceId })
    .lean();
    return {
      listData: ward,
      message: "Success",
      statusCode: 200,
    }; // hoặc response.data.listData nếu API trả về vậy
  } catch (error) {
    console.error("Error fetching wards:", error.message);
    throw error;
  }
}

module.exports = { getAllProvince, getWardId };
