const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onServerUpdate: (callback) => ipcRenderer.on("server-update", callback),
  removeServerUpdate: () => ipcRenderer.removeAllListeners("server-update"),
  batchExport: (images) => ipcRenderer.invoke("batch-export", images),
});

