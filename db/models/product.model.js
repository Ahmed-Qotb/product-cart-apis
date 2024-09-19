import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [2, "product name must be bigger than 2 charachters"],
      maxLength: [200, "product name too long"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "number is required"],
    },
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    cloudFolder: { type: String, unique: true, required: true },
   
    stock: {
      type: Number,
      min: 0,
      required: [true, "Stock is required"],
      default: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ? virtuals
productSchema.virtual("finalPrice").get(function () {
  if (this.discountPrice > 0) {
    return this.price - (this.price * this.discountPrice) / 100;
  }

  return this.price;
});

// ? methods
productSchema.methods.inStock = function (requiredStock) {
  return this.stock >= requiredStock ? true : false;
};


export const productModel = mongoose.model("product", productSchema);
