import pool from "../config/db.config.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// პროდუქტების წამოღება
async function getProducts(req, res) {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// კონკრეტული პროდუქტით
async function getOneProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await prisma.products.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error fetching product", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// პროდუქტის შექმნა
async function createProduct(req, res) {
  try {
    console.log(req.body);

    const { name, price } = req.body;
    const newProduct = await prisma.products.create({
      data: { name, price },
    });
    res.json(newProduct);
  } catch (err) {
    console.error("Error creating product", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// პროდუქტის განახლება
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, price, stock, description, slug, category } = req.body;
    const updatedProduct = await prisma.products.update({
      where: { id: parseInt(id) },
      data: { name, price, stock, description, slug, category },
    });
    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// პროდუქტის წაშლა

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const deletedProduct = await prisma.products.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// კატეგორიების სტატისტიკა
async function getCategoryStats(req, res) {
  try {
    const categoryStats = await prisma.products.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
    });
    res.json(categoryStats);
  } catch (err) {
    console.error("Error fetching category stats", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function buyProduct(req, res) {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const product = await prisma.products.findUnique({
      where: { id: parseInt(productId) },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ error: "Product out of stock" });
    }

    await prisma.products.update({
      where: { id: parseInt(productId) },
      data: { stock: product.stock - 1 },
    });

    const userProduct = await prisma.usersProducts.create({
      data: {
        userId,
        productId: parseInt(productId),
      },
    });

    res.status(201).json({ message: "Porduct successfuly" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export {
  getProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategoryStats,
  buyProduct,
};
