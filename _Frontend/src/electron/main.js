import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let lastImages = []; // cache of previous images

// ----------------------------
// Create the Electron window
// ----------------------------
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(app.getAppPath(), "/build/index.html"));
  mainWindow.show();
  // mainWindow.webContents.openDevTools();

  startServerPolling(); // start polling AFTER window is ready

  mainWindow.on("closed", () => {
    mainWindow = null;
    app.quit();
  });

});

const BACKEND_URL = "http://localhost:3000";

ipcMain.handle("batch-export", async (event, images) => {
  try {
    // Ask where to save
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "Select folder to export images",
      properties: ["openDirectory"],
    });

    if (canceled || filePaths.length === 0) {
      return { success: false, message: "Export canceled" };
    }

    const exportFolder = filePaths[0];

    for (const img of images) {
      // your object includes original_path like: "/uploads/xxx.png"
      const relativePath = img.original_path;
      const downloadUrl = `${BACKEND_URL}${relativePath}`;

      // filename from DB object
      const filename = img.filename;

      const savePath = path.join(exportFolder, filename);

      console.log("Downloading:", downloadUrl);
      console.log("Saving as:", savePath);

      // download file as binary using fetch
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${downloadUrl}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fs.writeFileSync(savePath, buffer);
    }

    return { success: true, message: "Images exported successfully!" };

  } catch (err) {
    console.error(err);
    return { success: false, message: `Failed to export images: ${err.message}` };
  }
});

function startServerPolling() {
  const fetchAndUpdate = async () => {
    if (!mainWindow) return;
    try {
      const res = await fetch("http://localhost:3000/api/images");
      const packet = await res.json();
      const serverImages = Array.isArray(packet.data) ? packet.data : [];

      const added = [];
      const removed = [];
      const updated = [];

      serverImages.forEach(serverImg => {
        const localImg = lastImages.find(i => i.id === serverImg.id);
        if (!localImg) added.push(serverImg);
        else if (JSON.stringify(localImg) !== JSON.stringify(serverImg)) updated.push(serverImg);
      });

      lastImages.forEach(localImg => {
        if (!serverImages.find(i => i.id === localImg.id)) removed.push(localImg);
      });

      if (added.length || removed.length || updated.length) {
        mainWindow.webContents.send("server-update", { added, removed, updated });
      }

      lastImages = serverImages;
    } catch (err) {
      console.log("Error fetching images:", err);
      mainWindow.webContents.send("server-update", { added: [], removed: lastImages, updated: [] });
      lastImages = [];
    }
  };

  // Run once immediately
  fetchAndUpdate();

  // Then start interval polling
  setInterval(fetchAndUpdate, 2000);
}
