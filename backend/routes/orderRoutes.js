import express from "express";
import { placeOrder, getUserOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/place", placeOrder);     
router.get("/:userId", getUserOrders); 

export default router;