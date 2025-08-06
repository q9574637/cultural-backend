import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

   

  } catch (err) {
    console.error("❌ Error connecting DB ", err);
  }
};

export default ConnectDb;
