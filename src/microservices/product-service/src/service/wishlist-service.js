const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addToWishlist = async (userId, productId) => {
  try {
    // Đảm bảo userId và productId là số
    const parsedUserId = parseInt(userId);
    const parsedProductId = parseInt(productId);

    // Kiểm tra xem đã có trong wishlist chưa
    const existing = await prisma.wishlist.findFirst({
      where: {
        userId: parsedUserId,
        productId: parsedProductId,
      },
    });

    if (existing) {
      // Nếu đã có => XÓA
      await prisma.wishlist.delete({
        where: {
          id: existing.id,
        },
      });

      return {
        status: "removed",
        message: "Product removed from wishlist",
        productId: parsedProductId,
      };
    } else {
      // Nếu chưa có => TẠO MỚI
      const created = await prisma.wishlist.create({
        data: {
          userId: parsedUserId,
          productId: parsedProductId,
        },
        include: {
          product: true,
        },
      });

      return {
        status: "added",
        message: "Product added to wishlist",
        product: created.product,
      };
    }
  } catch (error) {
    throw new Error(error.message || "Failed to toggle wishlist");
  }
};

const getWishlistByUser = async (userId) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { id: "desc" },
    });

    return wishlist;
  } catch (error) {
    throw new Error(error.message || "Failed to get wishlist");
  }
};

const removeWishlistItem = async (id) => {
  try {
    const deleted = await prisma.wishlist.delete({
      where: { id },
    });

    return deleted;
  } catch (error) {
    throw new Error(error.message || "Failed to remove wishlist item");
  }
};

const clearWishlistByUser = async (userId) => {
  try {
    const result = await prisma.wishlist.deleteMany({
      where: { userId: parseInt(userId) },
    });

    return result;
  } catch (error) {
    throw new Error(error.message || "Failed to clear wishlist");
  }
};

module.exports = {
  addToWishlist,
  getWishlistByUser,
  removeWishlistItem,
  clearWishlistByUser,
};
