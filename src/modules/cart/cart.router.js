import { Router } from "express";
import { asyncHandeler } from "../../utils/asyncHandeler.js";
import * as cartController from "./cart.controller.js";
import * as cartSchema from "./cart.schema.js";
import { validation } from "../../middleware/valedation.middleware.js";

const router = Router();
// ! create cart
router.post(
    "/",
    validation(cartSchema.createCartSchema),
    asyncHandeler(cartController.createCart)
)
// ! add to cart 
router.patch(
    "/",
    validation(cartSchema.addToCartSchema),
    asyncHandeler(cartController.addToCart)
);

// ! delete product from cart
router.patch(
    "/deletePrduct",
    validation(cartSchema.addToCartSchema),
    asyncHandeler(cartController.deleteProduct)
)

export default router;
