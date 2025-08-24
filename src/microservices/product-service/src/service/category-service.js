const prisma = require("@prisma/client").PrismaClient;
const prismaClient = new prisma();

// Create a new category
async function createCategory(name) {
  try {
    const newCategory = await prismaClient.category.create({
      data: { name },
    });
    return newCategory;
  } catch (error) {
    throw new Error("Error creating category");
  }
}

// Get all categories
async function getAllCategories() {
  try {
    const categories = await prismaClient.category.findMany({
      orderBy: {
        updatedAt: "desc", // hoặc 'asc' nếu bạn muốn sắp xếp tăng dần
      },
    });
    return categories;
  } catch (error) {
    throw new Error("Error fetching categories");
  }
}

// Get category by ID
async function getCategoryById(id) {
  try {
    const category = await prismaClient.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  } catch (error) {
    throw new Error("Error fetching category");
  }
}

// Update category by ID
async function updateCategory(id, name) {
  try {
    const updatedCategory = await prismaClient.category.update({
      where: { id: Number(id) },
      data: { name },
    });
    return updatedCategory;
  } catch (error) {
    throw new Error("Error updating category");
  }
}

// Delete category by ID
async function deleteCategory(id) {
  try {
    const deletedCategory = await prismaClient.category.delete({
      where: { id: Number(id) },
    });
    return deletedCategory;
  } catch (error) {
    throw new Error("Error deleting category");
  }
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  updateCategory,
};
