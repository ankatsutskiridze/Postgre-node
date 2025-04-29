import express from "express";
const router = express.Router();

import {
  getProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategoryStats,
} from "../controllers/productController.js";

// მომხმარებლების როუტები
router.get("/", getProducts);
router.get("/category-stats", getCategoryStats); // კატეგორიის სტატისტიკა
router.get("/:id", getOneProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
