const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Baserepository = require("base-repository");
const roleRepository = new Baserepository("Role");
// Create a new product
async function createRole(data) {
  try {
    let input = roleRepository.getModels("Role");
    input = roleRepository.autoMapWithModel(data);
    return await roleRepository.createAsync(input);
  } catch (error) {
    console.error(error);
    throw new Error("Error creating product");
  }
}

// Get all products
async function getAllRole() {
  try {
    //   const products = await prisma.product.findMany({
    //     include: {
    //       category: true, // Optional: include category info
    //     },
    //   });
    //   return products;
    const filter = await roleRepository.reneRateInputFilter();
    return await roleRepository.toListAsync(filter);
  } catch (error) {
    throw new Error("Error fetching products");
  }
}

// Get product by ID
async function getRoleById(id) {
  try {
    return roleRepository.firstOrDefautAsync({ id: parseInt(id) });
  } catch (error) {
    throw new Error("Error fetching product");
  }
}

// Update product by ID
async function updateRole(id, data) {
  try {
    // const updatedProduct = await prisma.product.update({
    //   where: { id: Number(id) },
    //   data,
    // });
    // return updatedProduct;
    const dataInput = await roleRepository.autoMapWithModel(data);
    return roleRepository.updateAsync(id, dataInput);
  } catch (error) {
    throw new Error("Error updating product");
  }
}

// Delete product by ID
async function deleteRole(id) {
  try {
    const data = await prisma.role.delete({
      where: { id: Number(id) },
    });
    return data;
  } catch (error) {
    throw new Error("Error deleting product");
  }
}

module.exports = {
  createRole,
  getAllRole,
  getRoleById,
  updateRole,
  deleteRole,
};
