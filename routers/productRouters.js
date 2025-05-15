import express from "express";
const router = express.Router();

import {
  getProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategoryStats,
  buyProduct,
} from "../controllers/productController.js";
import { auth } from "../middlewares/auth.js";

// მომხმარებლების როუტები
router.get("/", getProducts);
router.get("/category-stats", getCategoryStats); // კატეგორიის სტატისტიკა
router.get("/:id", getOneProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id", updateProduct);
router.post("/buyProduct/:id", auth, buyProduct);

export default router;
