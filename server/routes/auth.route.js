import { Router } from "express";
import {
  getMe,
  signin,
  signout,
  signup,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../utils/protectRoute.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/signout", signout);

authRouter.get("/me", protectRoute, getMe);

export default authRouter;
