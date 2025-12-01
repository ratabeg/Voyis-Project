// // import { app, BrowserWindow } from "electron";
// // import path from "path";
// // import { fileURLToPath } from "url";

// // // This replaces __dirname in ESM
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // // --------------------------------------
// // // 1. Create Window
// // // --------------------------------------
// // app.on("ready", () => {
// //   const mainWindow = new BrowserWindow({
// //     width: 1200,
// //     height: 800,
// //     // webPreferences: {
// //     //   nodeIntegration: true,
// //     //   contextIsolation: false,
// //     // },
// //     webPreferences: {
// //       preload: path.join(__dirname, "preload.js"), // <-- preload must exist
// //       nodeIntegration: false,
// //       contextIsolation: true,
// //     },
// //   });

// //   mainWindow.loadFile(path.join(app.getAppPath(), "/build/index.html"));

// //   mainWindow.show();
// //   // mainWindow.loadURL('http://localhost:3001'); // Load your frontend URL here

// //   mainWindow.on("closed", () => {
// //     app.quit();
// //   });


// //   mainWindow.webContents.openDevTools();

// // });



// import { app, BrowserWindow } from "electron";
// import path from "path";
// import { fileURLToPath } from "url";
// // import fetch from "node-fetch"; // if using Node ESM

// // Fix __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ----------------------------
// // Global variables
// // ----------------------------
// let mainWindow;
// let lastImages = []; // stores previously fetched images

// // ----------------------------
// // Create Electron window
// // ----------------------------
// app.on("ready", () => {
//   mainWindow = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"), // see step 2
//       nodeIntegration: false,
//       contextIsolation: true,
//     },
//   });

//   mainWindow.loadFile(path.join(app.getAppPath(), "/build/index.html"));
//   mainWindow.show();
//   mainWindow.webContents.openDevTools();

//   mainWindow.on("closed", () => {
//     mainWindow = null;
//     app.quit();
//   });

//   // Start polling the server for new images
//   startServerPolling();
// });

// // ----------------------------
// // Polling function
// // ----------------------------
// function startServerPolling() {
//   setInterval(async () => {
//     if (!mainWindow) return; // safety check

//     try {
//       const res = await fetch("http://localhost:3000/api/images");
//       const packet = await res.json();
//       const serverImages = packet.data;

//       // Find new images that are not in lastImages
//       const newImages = serverImages.filter(
//         (img) => !lastImages.some((i) => i.id === img.id)
//       );

//       if (newImages.length > 0) {
//         console.log("New images detected:", newImages.map((i) => i.fileName));
//         mainWindow.webContents.send("server-update", newImages);
//       }

//       lastImages = serverImages; // update cache
//     } catch (err) {
//       console.error("Error fetching images from server:", err);
//     }
//   }, 5000); // check every 5 seconds
// }

// // it only adds new images


import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
// import fetch from "node-fetch"; // only needed in ESM

// Fix __dirname for ESM
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
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
    app.quit();
  });

  startServerPolling(); // start polling AFTER window is ready
});

// // ----------------------------
// // Polling function
// // ----------------------------
function startServerPolling() {
  setInterval(async () => {
    if (!mainWindow) return; // safety check

    try {
      const res = await fetch("http://localhost:3000/api/images");
      const packet = await res.json();
      const serverImages = Array.isArray(packet.data) ? packet.data : [];

      // Arrays to hold changes
      const added = [];
      const removed = [];
      const updated = [];

      // Detect added or updated images
      serverImages.forEach(serverImg => {
        const localImg = lastImages.find(i => i.id === serverImg.id);
        if (!localImg) {
          added.push(serverImg); // new image
        } else if (JSON.stringify(localImg) !== JSON.stringify(serverImg)) {
          updated.push(serverImg); // changed image
        }
      });

      // Detect removed images
      lastImages.forEach(localImg => {
        if (!serverImages.find(i => i.id === localImg.id)) {
          removed.push(localImg);
        }
      });

      // Send changes to renderer
      if (added.length || removed.length || updated.length) {
        mainWindow.webContents.send("server-update", { added, removed, updated });
        console.log("Added:", added.map(i => i.fileName));
        console.log("Removed:", removed.map(i => i.fileName));
        console.log("Updated:", updated.map(i => i.fileName));
      }

      // Update cache
      lastImages = serverImages;

    } catch (err) {
      console.error("Error fetching images from server:", err);
      // Optional: clear cache and notify renderer if backend is down
      mainWindow.webContents.send("server-update", { added: [], removed: lastImages, updated: [] });
      lastImages = [];
    }
  }, 2000); // poll every 5 seconds
}

