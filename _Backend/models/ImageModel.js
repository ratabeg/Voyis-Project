import { json } from "express";
import pool from "../db/db.js";

export const ImageModel = {
  async findAll() {
    try {
      const result = await pool.query(`
        SELECT *, (SELECT SUM(size_bytes) FROM image_editor.images) AS total_size
        FROM image_editor.images
        ORDER BY id
    `);

      return result;
    } catch (err) {
      console.error("Error fetching images:", err);
      throw new Error("Failed to fetch images from database");
    }
  },
  async insert(fileInfo) {
    const result = await pool.query(
      `INSERT INTO image_editor.images 
     (filename, original_name, mime_type, size_bytes, original_path, thumbnail_path)
   VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING *`,
      [
        fileInfo.filename,
        fileInfo.originalName,
        fileInfo.fileType,
        fileInfo.fileSize,
        fileInfo.original_path,
        fileInfo.thumbnail_path,
      ]
    );
  },
};

export default ImageModel;
