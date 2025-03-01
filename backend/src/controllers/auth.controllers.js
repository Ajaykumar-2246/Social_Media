import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import expressAsyncHandler from "express-async-handler";

const isProduction = process.env.NODE_ENV === "production";

// Generate JWT token and set it in a cookie
const generateJwtToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  res.cookie("jwtToken", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "strict",
    secure: isProduction, // Only secure in production
  });
};

// Sign up a new user
export const signUp = expressAsyncHandler(async (req, res) => {
  const {username, fullName, email, password} = req.body;

  if (!username || !fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const Username= await User.findOne({ username });
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  if(Username){
    return res.status(400).json({ message: "Username already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    fullName,
    email,
    password: hashedPassword,
  });

  generateJwtToken(user._id, res);

  res.status(201).json({
    _id: user._id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    bio: user.bio,
    profileImg: user.profileImg,
    followers: user.followers,
    followings: user.followings,
    message: "User registered successfully",
  });
});

// Log in a user
export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  generateJwtToken(user._id, res);

  res.status(200).json({
    _id: user._id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    bio: user.bio,
    profileImg: user.profileImg,
    followers: user.followers,
    followings: user.followings,
    message: "User logged in successfully",
  });
});

// Log out a user
export const logout = expressAsyncHandler(async (req, res) => {
  res.cookie("jwtToken", "", {
    maxAge: 0,
  });
  res.status(200).json({ message: "User logged out successfully" });
});

// Check if the user is authenticated
export const checkAuth = expressAsyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  res.status(200).json({ message: "User authenticated successfully", user});
});
