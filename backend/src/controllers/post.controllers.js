import expressAsyncHandler from "express-async-handler";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

// Create a new post
export const createPost = expressAsyncHandler(async (req, res) => {
  const { image, description } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!image && !description) {
    return res
      .status(400)
      .json({ message: "Image or description is required" });
  }

  let imageUrl = null;
  if (image) {
    try {
      const result = await cloudinary.uploader.upload(image, {
        resource_type: "image",
      });
      imageUrl = result.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return res
        .status(500)
        .json({ message: "Error uploading image", error: error.message });
    }
  }

  const post = await Post.create({
    userId,
    image: imageUrl,
    description,
  });

  res.status(201).json({
    id: post._id,
    image: post.image,
    description: post.description,
    user: {
      _id: user._id,
      name: user.username,
      fullName: user.fullName,
      email: user.email,
      profileImg: user.profileImg,
    },
    message: "Post created successfully",
  });
});

// Get all posts
export const getAllPosts = expressAsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "-password"); // This will fetch user details instead of just userId

    res.status(200).json({
      posts,
      message: "All posts fetched successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch posts", error: error.message });
  }
});

// Like or unlike a post
export const likeUnlikePost = expressAsyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.likes.includes(userId)) {
    await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
    return res.status(200).json({ message: "Post unliked successfully" });
  } else {
    await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
    return res.status(200).json({ message: "Post liked successfully" });
  }
});

// Add a comment to a post
export const commentPost = expressAsyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: "Comment description is required" });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comment = { user: userId, description, createdAt: new Date() };
  post.comments.push(comment);
  await post.save();

  const updatedPost = await Post.findById(postId).populate("comments.user", "name email");

  res.status(200).json({ message: "Comment added", comment: updatedPost.comments.pop() });
});


// Save or unsave a post
export const SavePosts = expressAsyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  const user = await User.findById(userId).select("-password");
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.savedPosts.includes(postId)) {
    await User.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } });
    res.status(200).json({ message: "Post unsaved successfully" });
  } else {
    await User.findByIdAndUpdate(userId, { $addToSet: { savedPosts: postId } });
    res.status(200).json({ message: "Post saved successfully" });
  }
});
