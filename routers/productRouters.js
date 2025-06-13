import express from "express";
import { uploadProductImage } from "../middleware/uploadFile.js";
const router = express.Router();

import {
  getProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategoryStats,
  buyProduct,
  updateProductImages,
} from "../controllers/productController.js";
import { auth, isAdmin } from "../middleware/auth.js";

// მომხმარებლების როუტები
router.get("/", getProducts);
router.get("/category-stats", auth, getCategoryStats); // კატეგორიის სტატისტიკა
router.get("/:id", auth, getOneProduct);
router.post("/", auth, createProduct);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, isAdmin, deleteProduct);
router.patch("/:id", auth, updateProduct);
router.post("/buyProduct/:id", auth, buyProduct);
router.post(
  "/update-images/:id",
  uploadProductImage.array("images", 10),
  updateProductImages
);

export default router;
