import pool from "./db.js";

// Create tables if they don't exist
const createTables = async () => {
  console.log("Setting up database tables...");

  await pool.query(`CREATE SCHEMA IF NOT EXISTS image_editor;`);

  // 2️⃣ Create users table inside schema
  await pool.query(`
  CREATE TABLE IF NOT EXISTS image_editor.images (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,       -- saved filename on server
    original_name TEXT NOT NULL,  -- original uploaded filename
    mime_type TEXT,
    size_bytes BIGINT,
    original_path TEXT,
    thumbnail_path TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )
`);
};

export default createTables;
