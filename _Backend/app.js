// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import imageRoute from "./routes/ImageRoutes.js";
import createTables from "./db/setupDB.js";
dotenv.config();

const app = express();
const PORT = 3000 || process.env.PORT;

// Middleware to parse JSON (optional but usually needed)
app.use(express.json());
app.use(cors());
app.use("/api",imageRoute)


app.get("/", (req, res) => {
  res.send("Welcome to the Backend!!!");
});

const startServer = async () => {
  try {
    // 1️⃣ Ensure tables exist
    await createTables();
    console.log("✅ Database tables are ready.");

    // 2️⃣ Start Express server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("🛑 Failed to initialize database tables:", err);
    process.exit(1); // stop server if table creation fails
  }
}

// Start everything
startServer();
