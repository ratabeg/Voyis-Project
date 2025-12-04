import multer from "multer";
import fs from "fs";
import path from "path";

// ---- Make sure directory exists ----
const jsonConfigDir = path.join(process.cwd(), "storage/json-config");

if (!fs.existsSync(jsonConfigDir)) {
  fs.mkdirSync(jsonConfigDir, { recursive: true });
}

// ---- Multer config ----
const jsonUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, jsonConfigDir),
    filename: (req, file, cb) =>
      cb(null, Date.now() + "_" + file.originalname)
  }),

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/json") {
      cb(null, true);
    } else {
      cb(new Error("Only JSON config files allowed"), false);
    }
  }
});

export default jsonUpload;
