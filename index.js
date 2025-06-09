import dotenv from "dotenv";
dotenv.config();
import express from "express";
import productRoutes from "./routers/productRouters.js";
import userRouter from "./routers/userRouters.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRouter);

// Start server
app.listen(port, () => {
  console.log(`server is running  ${port} port`);
});
