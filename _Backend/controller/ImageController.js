/**
 
✅ CONTROLLER = Handles the HTTP request/response

The controller’s job is:
1.read the request (req.params, req.body, req.query)
2.validate inputs
3.call the service layer
3.return a response (res.json, res.status)
4.Controllers DO NOT contain business logic.
 */

import ImageService from "../service/ImageService.js";

const ImageController = {
  async getAllImages(req, res) {
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

      if (!file) throw new Error ("No file uploaded");
      
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
};

export default ImageController;
