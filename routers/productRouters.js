import express from "express";
const router = express.Router();

import {
  getProducts,
  getOneProduct,
  createProduct,
  updateProduct,
} from "../controllers/productController.js";

// მომხმარებლების როუტები
router.get("/", getProducts);
router.get("/:id", getOneProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);

export default router;
