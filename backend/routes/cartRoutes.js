import express from "express";
import { addToCart, getCart, updateCartItem } from "../controllers/cartController.js";

const router = express.Router();

router.post("/cart/add", addToCart);
router.get("/cart/:userId", getCart);
router.put("/cart/update", updateCartItem); 

export default router;