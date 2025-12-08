/**
 
✅ CONTROLLER = Handles the HTTP request/response

The controller’s job is:
1.read the request (req.params, req.body, req.query)
2.validate inputs
3.call the service layer
3.return a response (res.json, res.status)
4.Controllers DO NOT contain business logic.
 */
import ConfigService from "../service/ConfigService.js";
import ImageService from "../service/ImageService.js";

const ImageController = {
  async getAllImages(req, res) {
    console.log("FILE:", req.file);

    try {
      const response = await ImageService.getAllImages();
      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching images:", error);

      // Standardized error response
      return res.status(500).json({
        success: false,
        message: "Failed to fetch images",
        error: error.message || "Internal Server Error",
      });
    }
  },
  async uploadImage(req, res) {
    try {
      const file = req.file;

      if (!file) throw new Error("No file uploaded");

      const response = await ImageService.uploadImage(file);

      res.status(200).json(response);

      // const response = await ImageService.createImage(null);
    } catch (error) {
      console.error("Error uploading images:", error);

      // Standardized error response
      return res.status(500).json({
        success: false,
        message: "Failed to upload image",
        error: error.message || "Internal Server Error",
      });
    }
  },
  async uploadConfig(req, res) {
    try {
      if (!req.file)
        return res.status(400).json({ error: "No JSON config uploaded" });

      // 1️⃣ Parse JSON config into real file list
      // const files = await ConfigService.configService(req.file);
      const images = await ConfigService.configService(req.file);
      // images must be an ARRAY
      const insertedImages = await ImageService.processBatch(images);

      // 2️⃣ Process all images: copy + thumbnail + DB insert
      // const insertedImages = await ImageService.processBatch({ folders: files });

      return res.status(200).json({
        success: true,
        message: "All images uploaded successfully",
        count: insertedImages.length,
        images: insertedImages,
      });
    } catch (err) {
      console.error("Error in uploadConfig:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while uploading config",
        error: err.message || "Internal Server Error",
      });
    }
  },
};

export default ImageController;
