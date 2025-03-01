import expressAsyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import cloudinary from "../config/cloudinary.js";

// Get logged-in user details
export const getLoggedInUser = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password");
  res
    .status(200)
    .json({ user, message: "Logged-in user details fetched successfully" });
});

// Get posts of a specific user
export const getPostOfUser = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const posts = await Post.find({ userId }).sort({ createdAt: -1 });
  res
    .status(200)
    .json({ posts, message: "Posts of user fetched successfully" });
});

// Follow or unfollow a user
export const followUnfollowUser = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const followUserId = req.params.id;

  if (userId === followUserId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  const [user, followingUser] = await Promise.all([
    User.findById(userId).select("-password"),
    User.findById(followUserId).select("-password"),
  ]);

  if (!user || !followingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const isFollowing = user.followings.includes(followUserId);

  if (isFollowing) {
    await User.findByIdAndUpdate(userId, {
      $pull: { followings: followUserId },
    });
    await User.findByIdAndUpdate(followUserId, {
      $pull: { followers: userId },
    });
    res.status(200).json({ message: "User unfollowed successfully" });
  } else {
    await User.findByIdAndUpdate(userId, {
      $push: { followings: followUserId },
    });
    await User.findByIdAndUpdate(followUserId, {
      $push: { followers: userId },
    });
    res.status(200).json({ message: "User followed successfully" });
  }
});

export const getAllSavedPostsOfUser = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch user with saved posts & populate their userId, sorting by createdAt
  const user = await User.findById(userId)
    .populate({
      path: "savedPosts",
      populate: { path: "userId", select: "-password" }, // Exclude password from userId
      options: { sort: { createdAt: -1 } },
    })
    .select("-password") // Exclude password from the main User model
    .lean(); // Optimize query performance

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Ensure `savedPosts` is always an array
  res.status(200).json({
    savedPosts: user.savedPosts || [],
    message: "Saved posts fetched successfully",
  });
});

export const updateLoggedInUser = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { username, fullName, email, bio } = req.body;
  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.username = username || user.username;
  user.fullName = fullName || user.fullName;
  user.email = email || user.email;
  user.bio = bio || user.bio;

  await user.save();

  res.status(200).json({ user, message: "User updated successfully" });
});

export const deletePost = expressAsyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  await Post.findByIdAndDelete(postId);
  res.status(200).json({ message: "Post deleted successfully" });
});

export const updateUserProfileImage = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { profileImg } = req.body;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (profileImg) {
      try {
        const result = await cloudinary.uploader.upload(profileImg, {
          folder: "user_profiles", // Optional: Organizing images in a folder
          transformation: [{ width: 300, height: 300, crop: "limit" }], // Optional: Resizing the image
        });
        user.profileImg = result.secure_url;
      } catch (error) {
        return res.status(500).json({ message: "Image upload failed", error });
      }
    }

    await user.save();

    res
      .status(200)
      .json({ user, message: "Profile image updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


export const suggestedUsers = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const suggestedUsers = await User.find({
    _id: { $ne: userId },
    $and: [
      { followings: { $nin: [userId] } },
      { followers: { $nin: [userId] } },
    ],
  });

  res
    .status(200)
    .json({ suggestedUsers, message: "Suggested users fetched successfully" });
});

export const searchUserByUserName = expressAsyncHandler(async (req, res) => {
  const username = req.params.username;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  const user = await User.findOne({
    _id: { $ne: req.user._id }, // Corrected $ne usage
    username: { $regex: `^${username}$`, $options: "i" },
  }).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ user, message: "User found successfully" });
});

export const fetchUserDetailsById = expressAsyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId).select("-password");
  const posts = await Post.find({ userId })
    .sort({ createdAt: -1 })
    .populate("userId", "-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res
    .status(200)
    .json({ user, posts, message: "User details fetched successfully" });
});
