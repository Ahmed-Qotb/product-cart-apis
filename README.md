# 🛒 Product & Cart API with Express

A simple API for managing products and carts using Express and MongoDB. This project focuses on product management and cart operations, including automatic price calculation and stock handling.

## 🚀 Features

- Auto-calculating total price with or without discount.
- Handling product stock and ensuring availability before adding to the cart.
- Cart management with quantity adjustments and product removal.
- Image upload support using **Cloudinary** and **Multer**.
- MongoDB for database operations, Mongoose for schemas and validations.

## 📚 Technologies Used

- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ORM
- **NanoID** - Unique ID generation
- **Cloudinary** - Image hosting and manipulation
- **Multer** - Handling file uploads
- **Joi** - Data validation
- **Slugify** - Slug generation for product names
- **Dotenv** - Environment variables

## ⚙️ Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
2. **Install dependencies:**
npm install

3. **Create a .env file in the root directory (next to index.js):**
PORT=3000
CONNECTION_URL="mongodb://localhost:27017/productCart"
CLOUD_FOLDER_NAME=<enter yours here>
CLOUD_NAME=<enter yours here>
API_KEY=<enter yours here>
API_SECRET=<enter yours here>

🛠️ API Features
1. 🧮 Auto Total Price Calculation
Cart API uses a virtual field to auto-calculate the total price for all products.

Virtual Field Example:
cartSchema.virtual("total").get(function () {
  if (this.products.length > 0) {
    return this.products.reduce((sum, product) => {
      const price = product.productId.finalPrice;
      return sum + price * product.quantity;
    }, 0);
  }
  return 0;
});

Final Price with Discount:
productSchema.virtual("finalPrice").get(function () {
  if (this.discountPrice > 0) {
    return this.price - (this.price * this.discountPrice) / 100;
  }
  return this.price;
});

2. 📦 Product Stock Management
productSchema.methods.inStock = function (requiredStock) {
  return this.stock >= requiredStock;

3. 🛒 Add to Cart Logic
Automatic handling of quantities and existing products in the cart.
Stock is reduced when products are added to the cart (though ideally done during checkout).

4. ❌ Remove Products from Cart
Remove products by specifying the quantity to reduce.
If the specified quantity matches the current amount in the cart, the product is completely removed.

📝 Notes & Future Enhancements
This project could have included user authentication, authorization, and order management, but it focuses solely on products and cart APIs.
All requests are handled via request body, using MongoDB IDs for simplicity.
Updates and deletions for products are handled via a single API to streamline operations.
Image file types are restricted to .png or .jpeg.
