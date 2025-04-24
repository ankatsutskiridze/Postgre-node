import dotenv from "dotenv";
dotenv.config();
import express from "express";
import productRoutes from "./routers/productRouters.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "მოგესალმებით Express PostgreSQL API-ში" });
});

app.use("/api/products", productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("შეცდომა:", err.stack);
  res.status(500).json({ error: "რაღაც შეცდომა მოხდა!" });
});

// Start server
app.listen(port, () => {
  console.log(`server is running  ${port} port`);
});
