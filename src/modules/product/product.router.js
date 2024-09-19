import { Router } from "express";
import { validation } from "../../middleware/valedation.middleware.js";
import * as productController from "./product.controller.js";
import * as productSchema from "./product.schema.js";
import { asyncHandeler } from "../../utils/asyncHandeler.js";
import { fileUpload } from "../../utils/multerCloud.js";

const router = Router();

// ! create product
router.post(
  "/",
  fileUpload().fields([{ name: "productImages", maxCount: 4 }]),
  validation(productSchema.createProductSchema),
  asyncHandeler(productController.createProduct)
);

// ! update or edit product
router.patch(
  "/",
  fileUpload().fields([{ name: "productImages", maxCount: 4 }]),
  validation(productSchema.updateProductSchema),
  asyncHandeler(productController.updateProduct)
);

// ! delete product
router.delete(
  "/",
  validation(productSchema.deleteProductSchema),
  asyncHandeler(productController.deleteProduct)
);

export default router;
