const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Baserepository = require("base-repository");
const productRepository = new Baserepository("Product");
const laptopRepository = new Baserepository("Laptop");
const accessoryRepository = new Baserepository("Accessory");
// Create a new product
const normalizeSearch = (str) =>
  str
    .normalize("NFD") // tách các ký tự có dấu thành base + dấu
    .replace(/[\u0300-\u036f]/g, "") // xoá các dấu (accents)
    .replace(/\s+/g, " ") // thay nhiều dấu cách bằng 1 dấu cách
    .trim() // xoá khoảng trắng đầu/cuối
    .toLowerCase(); // chuyển về chữ thường cho tiện so sánh

async function createProduct(data) {
  try {
    if (data.importquantity) {
      data.importquantity = parseInt(data.importquantity);
    }
    if (data.importPrice) {
      data.importPrice = parseInt(data.importPrice);
    }
    if (data.manufactureYear) {
      data.manufactureYear = parseInt(data.manufactureYear);
    }
    if (!data.salePrice) {
      data.salePrice = parseFloat(data.price);
    }
    if (data.salePrice) {
      data.salePrice = parseFloat(data.salePrice);
    }
    let input = productRepository.getModels("Product");
    input = productRepository.autoMapWithModel(data);
    const checkValid = ["name"];
    const productdata = await productRepository.createAsync(input, checkValid);

    if (data.type === "LAPTOP") {
      let input = laptopRepository.getModels("Laptop");
      data.productId = parseInt(productdata.id);
      input = laptopRepository.autoMapWithModel(data);
      const laptopdata = await laptopRepository.createAsync(input);
    }
    if (data.type === "ACCESSORY") {
      let input = accessoryRepository.getModels("Accessory");
      data.productId = parseInt(productdata.id);
      input = accessoryRepository.autoMapWithModel(data);
      const accessorydata = await accessoryRepository.createAsync(input);
    }
    return productdata;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating product");
  }
}

// Get all products
async function getAllProducts(
  search,
  pageCurrent,
  pageSize,
  sortList = [],
  optionExtend = []
) {
  try {
    //   const products = await prisma.product.findMany({
    //     include: {
    //       category: true, // Optional: include category info
    //     },
    //   });
    //   return products;
    const filter = await productRepository.reneRateInputFilter();
    if (search) {
      filter.searchValue = normalizeSearch(search);
    }
    filter.searchKey = ["name"];

    filter.pageSize = pageSize;
    filter.sortList = sortList;
    filter.pageCurrent = pageCurrent;
    filter.orderBy = [{ updatedAt: "desc" }];
    let laptopDTo = productRepository.getModels("Laptop");
    let accessoryDto = productRepository.getModels("Accessory");
    return await productRepository
      .joinQuery("laptop", laptopDTo)
      .joinQuery("accessory", accessoryDto)
      .toListAsync(filter);
  } catch (error) {
    throw new Error("Error fetching products");
  }
}

// Get product by ID
async function getProductById(id) {
  try {
    let laptopDTo = productRepository.getModels("Laptop");
    let accessoryDto = productRepository.getModels("Accessory");
    return productRepository
      .joinQuery("laptop", laptopDTo)
      .joinQuery("accessory", accessoryDto)
      .firstOrDefautAsync({ id: parseInt(id) });
  } catch (error) {
    throw new Error("Error fetching product");
  }
}

// Update product by ID
async function updateProduct(id, data) {
  try {
    if (data.importquantity) {
      data.importquantity = parseInt(data.importquantity);
    }
    if (data.importPrice) {
      data.importPrice = parseInt(data.importPrice);
    }
    if (data.manufactureYear) {
      data.manufactureYear = parseInt(data.manufactureYear);
    }
    if (!data.salePrice) {
      data.salePrice = parseFloat(data.price);
    }
    if (data.salePrice) {
      data.salePrice = parseFloat(data.salePrice);
    }
    // Loại bỏ `createdAt` nếu có trong payload
    const { createdAt, ...dataWithoutCreatedAt } = data;

    dataWithoutCreatedAt.categoryId = parseInt(dataWithoutCreatedAt.categoryId);
    dataWithoutCreatedAt.price = dataWithoutCreatedAt.price
      ? parseInt(dataWithoutCreatedAt.price)
      : 0;

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: dataWithoutCreatedAt.name,
        description: dataWithoutCreatedAt.description,
        price: dataWithoutCreatedAt.price,
        salePrice: dataWithoutCreatedAt.salePrice,
        type: dataWithoutCreatedAt.type,
        categoryId: dataWithoutCreatedAt.categoryId,
        image: dataWithoutCreatedAt.image,
        importquantity: dataWithoutCreatedAt.importquantity,
        importPrice: dataWithoutCreatedAt.importPrice,
        manufactureYear: dataWithoutCreatedAt.manufactureYear,
        updatedAt: new Date(), // optional nếu Prisma không tự động
      },
    });

    if (dataWithoutCreatedAt.type === "LAPTOP") {
      const updatedLaptop = await prisma.laptop.update({
        where: { productId: Number(id) },
        data: {
          // productId: parseInt(dataWithoutCreatedAt.productId),
          cpu: dataWithoutCreatedAt.cpu,
          ram: dataWithoutCreatedAt.ram,
          storage: dataWithoutCreatedAt.storage,
          screen: dataWithoutCreatedAt.screen,
          graphics: dataWithoutCreatedAt.graphics,
          os: dataWithoutCreatedAt.os,
          ports: dataWithoutCreatedAt.ports,
          battery: dataWithoutCreatedAt.battery,
          weight: dataWithoutCreatedAt.weight,
          warranty: dataWithoutCreatedAt.warranty,
          brand: dataWithoutCreatedAt.brand,
        },
      });
    }

    if (dataWithoutCreatedAt.type === "ACCESSORY") {
      const updatedLaptop = await prisma.accessory.update({
        where: { productId: Number(id) },
        data: {
          brand: dataWithoutCreatedAt.brand,
          accessoryType: dataWithoutCreatedAt.accessoryType,
          connection: dataWithoutCreatedAt.connection,
          compatibleWith: dataWithoutCreatedAt.compatibleWith,
          warranty: dataWithoutCreatedAt.warranty,
        },
      });
    }
    return updatedProduct;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating product");
  }
}

// Delete product by ID
async function deleteProduct(id) {
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: Number(id) },
    });
    return deletedProduct;
  } catch (error) {
    throw new Error("Error deleting product");
  }
}

async function getProductByCategoryId(categoryId) {
  try {
    const fillter = productRepository.reneRateInputFilter();
    if (categoryId && parseInt(categoryId) !== 0) {
      fillter.where = [{ categoryId: parseInt(categoryId) }];
    }
    let laptopDTo = productRepository.getModels("Laptop");
    let accessoryDto = productRepository.getModels("Accessory");
    let categoryDto = productRepository.getModels("Category");
    const data = await productRepository
      .joinQuery("laptop", laptopDTo)
      .joinQuery("accessory", accessoryDto)
      .joinQuery("category", categoryDto);

    return await data.toListAsync(fillter);
  } catch (error) {
    throw new Error("Error fetching product");
  }
}

async function TruSoluong(listProduct) {
  try {
    await Promise.all(
      listProduct.map((item) =>
        prisma.product.update({
          where: { id: item.id },
          data: { importquantity: { decrement: item.quantity } },
        })
      )
    );
  } catch (error) {
    console.error("Error updating importquantity:", error);
    throw error;
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByCategoryId,
  TruSoluong,
};
