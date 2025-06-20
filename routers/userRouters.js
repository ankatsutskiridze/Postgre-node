import express from "express";
import { upload } from "../middleware/uploadFile.js";
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

router.get("/search-users", auth, searchUsers);
router.get("/", auth, getUsers);
router.get("/stats", auth, getUserStats);
router.get("/:id", auth, getOneUser);
router.post("/", auth, createUser);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);
router.patch("/:id", auth, updateUser);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forget-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post(
  "/update-picture/:id",
  upload.single("profilePicture"),
  updateProfilePicture
);

export default router;
