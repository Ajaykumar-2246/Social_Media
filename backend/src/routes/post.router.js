import express from "express";
import {
  commentPost,
  createPost,
  getAllPosts,
  likeUnlikePost,
  SavePosts,
} from "../controllers/post.controllers.js";
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = express.Router();

router.post("/createPost", protectRoutes, createPost);
router.get("/getAllPosts", protectRoutes, getAllPosts);
router.put("/likeUnlike/:postId", protectRoutes, likeUnlikePost);
router.put("/commentPost/:postId", protectRoutes, commentPost);
router.post("/savePosts/:postId", protectRoutes, SavePosts);

export default router;
