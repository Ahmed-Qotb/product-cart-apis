import mongoose from "mongoose";
// ? function used to connect to database
export const connectDB = async () => {
  return await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(console.log("db connected"))
    .catch((error) => {
      console.log("db connection failed", error);
    });
};
