import joi from "joi";
import { Types } from "mongoose";

// ! create cart schema
const createCartSchema = joi
  .object({
    userName: joi.string().min(2).max(200).required(),
  })
  .required();

// ! add to cart schema
const addToCartSchema = joi
  .object({
    userName: joi.string().min(2).max(200).required(),
    productId: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
      .required(),
    quantity: joi.number().integer().min(1).required(),
  })
  .required();

export { addToCartSchema, createCartSchema };
