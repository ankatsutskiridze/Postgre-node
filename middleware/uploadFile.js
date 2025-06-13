import multer from "multer";
import fs from "fs";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
