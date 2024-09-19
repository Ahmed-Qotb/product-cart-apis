import joi from "joi";
import { Types } from "mongoose";

// ! create product schema
const createProductSchema = joi
  .object({
    name: joi.string().min(2).max(200).required(),
    price: joi.number().required(),
    stock: joi.number().min(1).required(),
    discountPrice: joi.number().min(0).max(100),
  })
  .required();

// ! delete product schema
const deleteProductSchema = joi
  .object({
    id: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
      .required(),
  })
  .required();

// ! update prodycts schema
const updateProductSchema = joi
  .object({
    id: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
      .required(),
    name: joi.string().min(2).max(200),
    price: joi.number(),
    stock: joi.number().min(1),
    discountPrice: joi.number().min(0).max(100),
  })
  .required();

export { createProductSchema, deleteProductSchema, updateProductSchema };
