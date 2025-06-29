import multer from "multer";
import fs from "fs";
import path from "path";
import xlsx from "xlsx";

const uploadDir = "uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const filterFile = (req, file, cb) => {
  const allowedTypes = [".jpg", ".jpeg", ".png"];
  const extname = path.extname(file.originalname);
  if (allowedTypes.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filterFile,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/////////////////////////////////////////////////////////////////
const filterProductImage = (req, file, cb) => {
  const allowedTypes = [".jpg", ".jpeg", ".png"];
  const extname = path.extname(file.originalname);
  if (allowedTypes.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const uploadProductImage = multer({
  storage: storage,
  fileFilter: filterProductImage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export { upload, uploadProductImage };
