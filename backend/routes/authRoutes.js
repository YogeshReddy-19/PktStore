import express from "express";
import { registeruser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registeruser);
router.post("/login", loginUser, (req, res) => {
  res.json({ success: true, message: "Login successfully", user: req.user });
});

export default router;
