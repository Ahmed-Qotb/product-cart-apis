import { cartModel } from "../../../db/models/cat.model.js";
import { productModel } from "../../../db/models/product.model.js";

// ! create cart
const createCart = async (req, res, next) => {
  // ? creating cart
  const cart = await cartModel.create({
    ...req.body,
  });

  if (!cart) {
    return next(new Error("some thing wnt wrong cart not created !"));
  }

  return res.json({
    success: true,
    message: "cart created successfully",
    results: {
      cart,
    },
  });
};

// ! add to cart
const addToCart = async (req, res, next) => {
  //   ? check product existance
  const product = await productModel.findById(req.body.productId);
  if (!product) {
    return next(new Error("product not found"));
  }

  //   ? check stock
  if (!product.inStock(req.body.quantity)) {
    return next(new Error(`out of stock only ${product.stock} avilable`));
  }
  console.log("Product stock:", product.stock);

  // ? check product existance in the cart
  const isProductInCart = await cartModel
    .findOne({
      userName: req.body.userName,
      "products.productId": req.body.productId,
    })
    .populate("products.productId");

  if (isProductInCart) {
    const theProduct = isProductInCart.products.find((prd) => {
      console.log("prd.productId", prd.productId._id.toString());

      return prd.productId._id.toString() === req.body.productId.toString();
    });
    console.log("theProduct", theProduct);

    // ? check stock
    if (product.inStock(req.body.quantity)) {
      theProduct.quantity = theProduct.quantity + req.body.quantity;
      await isProductInCart.save();
      // ? updating stock
      product.stock = product.stock - req.body.quantity;
      await product.save();
      //   ? sending response
      return res.json({
        success: true,
        message: "added to cart successfully",
        results: { isProductInCart },
      });
    } else {
      return next(new Error(`sorry , only ${product.stock} avilable`));
    }
  }

  //   ? checking for cart and adding product in product array
  const cart = await cartModel.findOneAndUpdate(
    { userName: req.body.userName },
    {
      $push: {
        products: {
          productId: req.body.productId,
          quantity: req.body.quantity,
        },
      },
    },
    { new: true }
  );

  await cart.save();

  if (!cart) {
    return next(new Error("something went wrong while adding to cart"));
  }

  // ? updating stock
  product.stock = product.stock - req.body.quantity;
  await product.save();

  //   ? sending response
  return res.json({
    success: true,
    message: "added to cart successfully",
    results: { cart },
  });
};

// ! delete product from cart
const deleteProduct = async (req, res, next) => {
  //   ? check product existance in cart
  const cart = await cartModel
  .findOne({
    userName: req.body.userName,
    "products.productId": req.body.productId,
  })
  .populate("products.productId"); 


  if (!cart) {
    next(new Error("cart with this product notfound"));
  }

  const productInCart = cart.products.find(
    (prd) => {
      // console.log(prd);
      return prd.productId._id.toString() === req.body.productId.toString()
    }
  );
  
  if (req.body.quantity) {
    // ? Subtract the quantity from the product in the cart
    productInCart.quantity -= req.body.quantity;

    // ? If quantity becomes 0 or less remove the product from the cart
    if (productInCart.quantity <= 0) {
      cart.products = cart.products.filter(
        (prd) => prd.productId._id.toString() !== req.body.productId.toString()
      );
    }

    await cart.save();

    return res.json({
      success: true,
      message:
        productInCart.quantity <= 0
          ? "Product removed from cart"
          : "Quantity updated in cart",
      results: { cart },
    });
  }

  return next(new Error("please enter a valid quantity"))
};

export { createCart, addToCart, deleteProduct };
