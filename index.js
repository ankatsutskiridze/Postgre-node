import dotenv from "dotenv";
dotenv.config();
import express from "express";
import productRoutes from "./routers/productRouters.js";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./middlewares/swagger.js";
import userRouter from "./routers/userRouters.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
// Routes
app.get("/", (req, res) => {
  res.json({ message: "მოგესალმებით Express PostgreSQL API-ში" });
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("შეცდომა:", err.stack);
  res.status(500).json({ error: "რაღაც შეცდომა მოხდა!" });
});

// Start server
app.listen(port, () => {
  console.log(`server is running  ${port} port`);
});
