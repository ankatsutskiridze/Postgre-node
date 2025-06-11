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
import { auth } from "../middleware/auth.js";

// მომხმარებლების როუტები
router.get("/", getProducts);
router.get("/category-stats", getCategoryStats); // კატეგორიის სტატისტიკა
router.get("/:id", getOneProduct);
router.post("/", auth, createProduct);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);
router.patch("/:id", auth, updateProduct);
router.post("/buyProduct/:id", auth, buyProduct);

export default router;
