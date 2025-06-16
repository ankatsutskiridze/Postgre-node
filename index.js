import dotenv from "dotenv";
dotenv.config();
import express from "express";
import productRoutes from "./routers/productRouters.js";
import userRouter from "./routers/userRouters.js";
import { handleError } from "./utils/errorhandler.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/products", productRoutes);
app.use("/api/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(handleError);
// Start server
app.listen(port, () => {
  console.log(`server is running  ${port} port`);
});
