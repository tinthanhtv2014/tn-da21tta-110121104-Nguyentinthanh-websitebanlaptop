const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Baserepository = require("base-repository");
const cartRepository = new Baserepository("Cart");
const productRepository = new Baserepository("Product");
// Create a cart item
async function addToCart(userId, productId) {
  try {
    const find = await cartRepository.firstOrDefautAsync({
      userId: userId,
      productId: productId,
    });

    if (find) {
      let cartItem = await prisma.cart.update({
        where: { id: find.id },
        data: {
          quantity: find.quantity + 1,
        },
      });
      if (cartItem) {
        return {
          status: 200,
        };
      }
    }
    const cartItem = await prisma.cart.create({
      data: {
        userId: parseInt(userId),
        productId: parseInt(productId),
        quantity: 1,
      },
    });
    if (cartItem) {
      return { status: 200 };
    }
    return cartItem;
  } catch (error) {
    console.log(error);
  }
}

// Get all cart items by user
async function getCartByUser(userId, listCart) {
  try {
    if (userId) {
      const cartItems = await prisma.cart.findMany({
        where: { userId: parseInt(userId) },
        include: {
          product: true, // include product details
        },
      });

      const productIds = [...new Set(cartItems.map((item) => item.productId))];

      const filter = await productRepository.reneRateInputFilter();
      filter.sortList = [{ key: "id", value: productIds }];

      const query = await productRepository.toListAsync(filter);

      // Tạo map để lưu quantity và cartId
      const cartMap = {};
      cartItems.forEach((item) => {
        cartMap[item.productId] = {
          quantity: item.quantity,
          cartId: item.id,
        };
      });

      // Gắn quantity + cartId tương ứng vào từng product
      const enrichedProducts = query.listData.map((product) => ({
        ...product,
        quantity: cartMap[product.id]?.quantity || 0,
        cartId: cartMap[product.id]?.cartId || null,
      }));

      return {
        products: enrichedProducts,
      };
    } else {
      if (listCart) {
        const listProductIds = listCart.map((item) => parseInt(item.productId));

        const cartItems = await prisma.product.findMany({
          where: {
            id: {
              in: listProductIds,
            },
          },
        });
        console.log("listCart:", listCart);

        const cartWithQuantities = cartItems.map((product) => {
          const matchingItem = listCart.find(
            (item) => parseInt(item.productId) === product.id
          );
          return {
            ...product,
            quantity: parseInt(matchingItem?.quantity || 0),
          };
        });
        return cartWithQuantities;
      } else {
        return {
          status: 200,
          message: "không có sản phẩm trong giỏ hàng",
        };
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// Remove item from cart by ID
async function removeCartItem(id) {
  try {
    const deletedItem = await prisma.cart.delete({
      where: { id: parseInt(id) },
    });
    return deletedItem;
  } catch (error) {
    console.log(error);
  }
}

// Clear entire cart for a user
async function clearCartByUser(userId) {
  try {
    const deletedItems = await prisma.cart.deleteMany({
      where: { userId: parseInt(userId) },
    });
    return deletedItems;
  } catch (error) {
    throw new Error("Error clearing cart");
  }
}

async function updateCart(id, quantity) {
  try {
    let cartItem = await prisma.cart.update({
      where: { id: parseInt(id) },
      data: {
        quantity: parseInt(quantity),
      },
    });

    if (cartItem) {
      return cartItem;
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  addToCart,
  getCartByUser,
  removeCartItem,
  clearCartByUser,
  updateCart,
};
