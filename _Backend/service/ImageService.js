/**
 Services contain:

data processing

validation logic

calling the database models

file operations (read/write)

interactions between multiple models

uploading, resizing, generating thumbnails

anything “logical” the application does

Services DO NOT know anything about HTTP.
(No req, no res, no status codes)
 */

import ImageModel from "../models/ImageModel.js";
import upload, { storageDir, thumbnailDir} from "../middleware/upload.js";
import path from "path";
import sharp from "sharp";
import fs from "fs";

export const ImageService = {
  async getAllImages() {
    // Utility to format bytes
    const formatBytes = (bytes) => {
      if (!bytes) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
    };

    const data = await ImageModel.findAll();
    const totalSizeBytes = data.rows[0]?.total_size || 0;

    const response = {
      success: true,
      message: `Fetched ${
        data.rows.length
      } images. Total size of everything is ${formatBytes(totalSizeBytes)}`,
      data: data.rows,
    };

    return response;
  },

  async uploadImage(file) {
    const thumbnailPath = path.join(thumbnailDir, "thumb_" + file.filename);

    // Generate the thumbnail
    await sharp(file.path)
      .resize(300) // width 300px
      .toFile(thumbnailPath);

    const fileInfo = {
      originalName: file.originalname,
      filename: file.filename,
      filePath: file.path,
      fileType: file.mimetype,
      fileSize: file.size,
      original_path: path.join("/uploads/", file.filename),
      thumbnail_path: path.join("/thumbnails/", "thumb_" + file.filename),
    };

    const data = await ImageModel.insert(fileInfo);

    const response = {
      success: true,
      message: `Uploaded new image`,
    };
    return response;
  },
  // async processBatch(images) {
  //    const insertedImages = [];

  //   for (const img of images) {
  //     // Copy image to storageDir
  //     this.uploadImage(img)
  //     insertedImages.push(img.filename);
  //   }

  //   return insertedImages;

  // },
  
  async processBatch(images) {
  const insertedImages = [];

  for (const img of images) {
    const sourcePath = img.original_path;   // original full file path
    const destPath = path.join(storageDir, img.filename);
    const thumbnailPath = path.join(thumbnailDir, "thumb_" + img.filename);

    // 1️⃣ Copy file into /uploads
    fs.copyFileSync(sourcePath, destPath);

    // 2️⃣ Generate thumbnail
    await sharp(destPath).resize(300).toFile(thumbnailPath);

    // 3️⃣ Insert DB record
    await ImageModel.insert({
      originalName: img.filename,
      filename: img.filename,
      filePath: destPath,
      fileType: img.mimetype || "image",
      fileSize: img.size || 0,
      original_path: "/uploads/" + img.filename,
      thumbnail_path: "/thumbnails/" + "thumb_" + img.filename,
    });

    insertedImages.push(img.filename);
  }

  return insertedImages;
}
  // async deleteImage(id) {
  //   return await ImageModel.remove(id);
  // },
};

export default ImageService;
