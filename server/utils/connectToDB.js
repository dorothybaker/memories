import { config } from "dotenv";
import mongoose from "mongoose";

config();

const MONGO_URI = process.env.MONGO_URI;

export const connectToDB = async () => {
  await mongoose
    .connect(MONGO_URI)
    .then(() => console.log("Connected to MONGODB!"))
    .catch((error) => console.log(error));
};
