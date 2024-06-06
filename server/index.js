import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { connectToDB } from "./utils/connectToDB.js";
import postRouter from "./routes/post.route.js";
import authRouter from "./routes/auth.route.js";

import path from "path";

config();

const APP = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

APP.use(express.json());
APP.use(cookieParser());
APP.use(cors({ credentials: true }));

APP.use("/api/posts", postRouter);
APP.use("/api/auth", authRouter);

APP.use(express.static(path.join(__dirname, "/client/dist")));

APP.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

APP.listen(PORT, () => {
  connectToDB();
  console.log(`Server running on port ${PORT}`);
});
