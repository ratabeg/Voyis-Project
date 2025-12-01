import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// --------------------------
// 1️⃣ Setup __dirname for ES modules
// --------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------
// 2️⃣ Create router
// --------------------------
const router = express.Router();

// --------------------------
// 3️⃣ Serve static folders
// --------------------------
router.use(
  "/thumbnails",
  express.static(path.join(__dirname, "../storage/thumbnails"))
);

router.use(
  "/uploads",
  express.static(path.join(__dirname, "../storage/uploads"))
);

// --------------------------
// 4️⃣ Helper to generate URLs
// --------------------------
router.generateImageURL = (fileName, type = "thumbnail") => {
  if (type === "thumbnail") {
    return `http://localhost:3000/thumbnails/${fileName}`;
  }
  return `http://localhost:3000/uploads/${fileName}`;
};

const pathMiddleware = router;

export default pathMiddleware;
