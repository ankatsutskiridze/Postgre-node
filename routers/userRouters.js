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
  updateProfilePicture,
} from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";

// იუზერების როუტები
router.get("/search-users", auth, searchUsers);
router.get("/", auth, getUsers); // ყველა იუზერის წამოღება
router.get("/stats", auth, getUserStats); // იუზერების სტატისტიკა
router.get("/:id", auth, getOneUser); // კონკრეტული იუზერის წამოღება
router.post("/", auth, createUser); // იუზერის შექმნა
router.put("/:id", auth, updateUser); // იუზერის განახლება (სრული)
router.delete("/:id", auth, deleteUser); // იუზერის წაშლა
router.patch("/:id", auth, updateUser); // იუზერის განახლება (ნაწილობრივი)
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forget-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/users/update-picture/:id", updateProfilePicture);

export default router;
