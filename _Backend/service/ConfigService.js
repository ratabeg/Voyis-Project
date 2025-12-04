import fs from "fs";
import path from "path";
const ConfigService = {
  /**
   * Reads JSON config uploaded via Multer (memoryStorage)
   * @param {Object} file - req.file from Multer
   * @returns {Object} parsed JSON object
   */
  async configService(file) {
   if (!file) throw new Error("No file provided");

    try {
      // Read JSON from file path
      const jsonText = fs.readFileSync(file.path, "utf8");

      // Parse JSON into object
      const data = JSON.parse(jsonText);

      const uploadedImages = [];

      // Loop through folders from JSON
      for (const folderObj of data.folders) {
        const folderPath = folderObj.path;
        const allowedFileTypes = folderObj.fileTypes.map((ext) =>
          ext.toLowerCase()
        );

        if (!fs.existsSync(folderPath)) {
          console.warn("Folder does not exist:", folderPath);
          continue;
        }

        const files = fs.readdirSync(folderPath);

        for (const fileName of files) {
          const ext = path.extname(fileName).replace(".", "").toLowerCase();
          if (!allowedFileTypes.includes(ext)) continue;

          const fullPath = path.join(folderPath, fileName);

          uploadedImages.push({
            path: fullPath, // full local path
            originalname: fileName,
            mimetype: "image/" + ext,
            size: fs.statSync(fullPath).size,
            filename: fileName,
          });
        }
      }

      return uploadedImages; // ✅ return the array of images

    } catch (err) {
      console.error("Error parsing config JSON:", err);
      throw new Error("Failed to parse config or read folder files");
    }
  }
};

export default ConfigService;
