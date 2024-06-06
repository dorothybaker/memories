import { config } from "dotenv";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

config();

export const protectRoute = async (req, res, next) => {
  try {
    const { memories: token } = req.cookies;
    if (!token) {
      return res.status(401).json("Unauthorized: No Token Provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json("Unauthorized: Invalid Token");
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json(error.message || "Internal Server Error");
  }
};
