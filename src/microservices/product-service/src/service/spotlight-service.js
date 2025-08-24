const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createSpotlight = async ({ title, description }) => {
  try {
    const spotlight = await prisma.spotlight.create({
      data: { title, description },
    });
    return spotlight;
  } catch (error) {
    throw new Error(error.message || "Failed to create spotlight");
  }
};

const getAllSpotlights = async () => {
  try {
    const spotlights = await prisma.spotlight.findMany({
      include: {
        products: {
          include: { product: true },
        },
      },
      orderBy: { id: "desc" },
    });
    return spotlights;
  } catch (error) {
    throw new Error(error.message || "Failed to get spotlights");
  }
};

const getSpotlightById = async (id) => {
  try {
    const spotlight = await prisma.spotlight.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: {
          include: { product: true },
        },
      },
    });
    if (!spotlight) throw new Error("Spotlight not found");
    return spotlight;
  } catch (error) {
    throw new Error(error.message || "Failed to get spotlight by id");
  }
};

const updateSpotlight = async (id, data) => {
  try {
    const spotlight = await prisma.spotlight.update({
      where: { id: parseInt(id) },
      data,
    });
    return spotlight;
  } catch (error) {
    throw new Error(error.message || "Failed to update spotlight");
  }
};

const deleteSpotlight = async (id) => {
  try {
    // Xóa products khỏi spotlight-product trước
    await prisma.spotlightProduct.deleteMany({
      where: { id: parseInt(id) },
    });

    const deleted = await prisma.spotlight.delete({
      where: { id },
    });
    return deleted;
  } catch (error) {
    throw new Error(error.message || "Failed to delete spotlight");
  }
};

module.exports = {
  createSpotlight,
  getAllSpotlights,
  getSpotlightById,
  updateSpotlight,
  deleteSpotlight,
};
