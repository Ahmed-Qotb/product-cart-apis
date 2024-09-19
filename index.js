import express from "express";
import { connectDB } from "./db/connection.js";
import dotenv from "dotenv"
import productRouter from "./src/modules/product/product.router.js"
import cartRouter from "./src/modules/cart/cart.router.js"

dotenv.config()
const app = express();
const port = process.env.PORT;
// ? parse
app.use(express.json());

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:3000`)
);

// ? db connection
await connectDB()

// ? apis
// ? products api
app.use("/product",productRouter)

// ? cart api
app.use("/cart",cartRouter)


// ! global error handler
app.use((error, req, res, next) => {
  return res.json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
});

// ! not found page handler
app.all("*", (req, res, next) => {
  return res.json({ success: false, message: "page not found" });
});
