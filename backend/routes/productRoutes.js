import express from "express";
import getProducts ,{searchProducts, addReview, getSingleProduct} from "../controllers/productController.js";

const router = express.Router();

router.get("/allP", getProducts);
router.get("/product/search", searchProducts);
router.get("/product/:id", getSingleProduct);
router.post("/product/:id/addReview",addReview)
export default router;
