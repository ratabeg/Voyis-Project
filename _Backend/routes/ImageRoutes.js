import express from "express";
import  ImageController from "../controller/ImageController.js";
import upload from "../middleware/upload.js";
import fileTypeError from "../middleware/invalideFileType.js";


const router = express.Router();


// Get list of all images
/**
 * 
 */

router.get("/images", ImageController.getAllImages);
router.post("/image/upload", upload.single("file"),ImageController.uploadImage);
router.use(fileTypeError)

router.use(fileTypeError)
export default router;