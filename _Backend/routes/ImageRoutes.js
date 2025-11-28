import express from "express";
import { getAllImages } from "../controller/ImageController.js";

const router = express.Router();


// Get list of all images
/**
 * 
 */
router.get("/images", getAllImages);

export default router;