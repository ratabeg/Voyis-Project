import express from "express";
import  ImageController from "../controller/ImageController.js";
import upload from "../middleware/upload.js";
import fileTypeError from "../middleware/invalideFileType.js";
import jsonUpload from "../middleware/jsonUpload.js";


const router = express.Router();

router.get("/images", ImageController.getAllImages);
router.post("/image/upload", upload.single("file"),ImageController.uploadImage);
router.post("/image/upload-config",jsonUpload.single("config"),ImageController.uploadConfig);
router.use(fileTypeError)

router.use(fileTypeError)
export default router;