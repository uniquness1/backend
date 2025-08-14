import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error(
    `Please define the mongoDB_URI environment variable inside ${NODE_ENV} mode`
  );
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`connected to database in ${NODE_ENV} mode`);
  } catch (err) {
    console.log(err);
    console.error("Error connecting to MongoDB:"), process.exit(1);
  }
};

export default connectToDatabase;
