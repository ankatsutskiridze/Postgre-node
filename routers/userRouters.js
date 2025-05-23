import express from "express";
const router = express.Router();

import {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  searchUsers,
  signup,
  signin,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

// იუზერების როუტები
router.get("/search-users", searchUsers);
router.get("/", getUsers); // ყველა იუზერის წამოღება
router.get("/stats", getUserStats); // იუზერების სტატისტიკა
router.get("/:id", getOneUser); // კონკრეტული იუზერის წამოღება
router.post("/", createUser); // იუზერის შექმნა
router.put("/:id", updateUser); // იუზერის განახლება (სრული)
router.delete("/:id", deleteUser); // იუზერის წაშლა
router.patch("/:id", updateUser); // იუზერის განახლება (ნაწილობრივი)
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forget-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
