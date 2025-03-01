import express from "express";
import {
  checkAuth,
  login,
  logout,
  signUp,
} from "../controllers/auth.controllers.js";
import { protectRoutes } from "../middleware/protectRoutes.js";


const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/checkAuth", protectRoutes, checkAuth);


export default router;
