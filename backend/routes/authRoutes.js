import express from "express";
import {
  signupUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

export default router;
