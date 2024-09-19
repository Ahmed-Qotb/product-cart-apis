import mongoose, { Schema } from "mongoose";
const cartSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      minLength: [2, "cart userName must be bigger than 2 charachters"],
      maxLength: [200, "cart userName too long"],
      unique: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "product",
        },
        quantity: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ? virtuals (total with discount or without discount)
cartSchema.virtual("total").get(function () {
  if (this.products.length > 0) {
    return this.products.reduce((prdPriceSum, currentProduct) => {
      if (currentProduct.productId) {
        const price = currentProduct.productId.finalPrice;
        console.log("Product ID:", currentProduct);
        console.log("Price:", price);
        console.log("Quantity:", currentProduct.quantity);
        return prdPriceSum + price * currentProduct.quantity;
      }
      return prdPriceSum;
    }, 0);
  }
  return 0; // Return 0 if there are no products
});

export const cartModel = mongoose.model("cart", cartSchema);
