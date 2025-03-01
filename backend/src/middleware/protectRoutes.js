import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; 
import expressAsyncHandler from "express-async-handler";


export const protectRoutes = expressAsyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.jwtToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, no token" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    req.user = user;
    next(); // Allow the request to continue
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
});
