import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";


// ----- Fix for __dirname in ES modules -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----- Storage Setup -----
// Storage folder
export const storageDir = path.join(__dirname, "../storage/uploads");
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });

// Thumbnail folder
export const thumbnailDir = path.join(__dirname, "../storage/thumbnails");
if (!fs.existsSync(thumbnailDir)) fs.mkdirSync(thumbnailDir, { recursive: true });


// Allowed image types
const allowedTypes = ["image/jpeg", "image/png", "image/tiff",];

// Ensure upload directory exists
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: storageDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});


// Multer instance with file filter
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // accept file
    } else {
      cb(new Error(`Invalid file type: ${file.originalname}`), false); // reject file
    }
  }
});

export default upload;
