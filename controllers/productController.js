// import pool from "../config/db.config.js";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
const prisma = new PrismaClient();

async function getProducts(req, res) {
  try {
    const result = await prisma.products.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json(result);
  } catch (err) {
    console.error("Error fetching products", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

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

async function createProduct(req, res) {
  try {
    const { name, price, stock, description, slug, category } = req.body;
    const result = await prisma.products.create({
      data: {
        name,
        price,
        stock,
        description,
        slug,
        category,
      },
    });
    res.json(result);
  } catch (err) {
    console.error("Error creating product", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

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

async function getCategoryStats(req, res) {
  try {
    const categoryStats = await prisma.products.groupBy({
      by: ["category"],
      _count: true,
      avg: { price: true },
      _sum: { stock: true },
      _max: { price: true },
      _min: { price: true },
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

    const user = await prisma.users.findUnique({
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
    res.json({
      message: "Product purchased successfully",
      userProduct,
    });
    res.status(201).json({ message: "Product purchased successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateProductImages(req, res) {
  try {
    const { id } = req.params;
    const product = await prisma.products.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) {
      if (req.file.length > 0) {
        req.file.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
    }
  } catch (err) {
    console.error("Error updating product images", err);
    res.status(500).json({ error: "Internal server error" });
  }
  if (!req.file || req.file.length === 0) {
    return res.status(400).json({ error: "No images uploaded" });
  }
  const productImages = await prisma.productImage.createMany({
    data: req.file.map((file) => ({
      productId: parseInt(id),
      url: file.path,
    })),
  });
  res.json({ message: "Product images updated successfully" });
}

export {
  getProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategoryStats,
  buyProduct,
  updateProductImages,
};
