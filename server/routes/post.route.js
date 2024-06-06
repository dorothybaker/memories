import { Router } from "express";
import {
  createPost,
  deleteMemory,
  getMemory,
  getPosts,
  getRecommendedPosts,
  likeAndDislike,
} from "../controllers/post.controller.js";
import { protectRoute } from "../utils/protectRoute.js";

const postRouter = Router();

postRouter.get("/", getPosts);
postRouter.post("/create", protectRoute, createPost);
postRouter.get("/recommended", getRecommendedPosts);
postRouter.get("/:id", getMemory);
postRouter.post("/like/:id", protectRoute, likeAndDislike);
postRouter.delete("/:id", protectRoute, deleteMemory);

export default postRouter;
