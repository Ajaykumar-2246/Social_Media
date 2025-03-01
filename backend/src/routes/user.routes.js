import express from "express";
import {
  followUnfollowUser,
  getPostOfUser,
  getLoggedInUser,
  getAllSavedPostsOfUser,
  updateLoggedInUser,
  updateUserProfileImage,
  deletePost,
  suggestedUsers,
  searchUserByUserName,
  fetchUserDetailsById,
} from "../controllers/user.controllers.js";
import { protectRoutes } from "../middleware/protectRoutes.js";

const router = express.Router();

router.get("/LoggedInUserDetail", protectRoutes, getLoggedInUser);
router.get("/getOtherUserProfile/:id", protectRoutes, fetchUserDetailsById);
router.put("/updateProfile", protectRoutes, updateLoggedInUser);
router.put("/updateProfilePic", protectRoutes, updateUserProfileImage);
router.get("/getPostOfUser", protectRoutes, getPostOfUser);
router.delete("/deletePost/:id", protectRoutes, deletePost);
router.put("/followUnfollow/:id", protectRoutes, followUnfollowUser);
router.get("/getAllSavedPostsOfUser", protectRoutes, getAllSavedPostsOfUser);
router.get("/suggestedUsers", protectRoutes, suggestedUsers);
router.get("/searchUser/:username", protectRoutes, searchUserByUserName);

export default router;
