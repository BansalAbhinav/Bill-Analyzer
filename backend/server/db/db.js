import mongoose from "mongoose";
import { configDotenv } from "dotenv";
// import { APIError } from "../middlewares/errorHandler.js";
configDotenv();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  //   throw new APIError("MONGO_URI is not set in environment variables");
  console.log("MONGO_URI is not set in environment variables");
}
export async function connectDB() {
  try {
    const options = {
      dbname: "Bill-Analysis",
    };
    await mongoose.connect(MONGO_URI, options);
    console.log("Database connected Successfully");
  } catch (error) {
    console.error("Error while connecting to Database", error);
  }
}
