# Electron Image Editor – Project Documentation

## 1. Overview

This document outlines the full architecture, setup instructions, workflow, and design decisions for the Electron-based Image Editor application. The project includes:

* A server-side environment (Docker, PostgreSQL, API server, mounted storage)
* An Electron-based desktop application (React frontend)
* Image upload, storage, gallery viewing, single-image editing, metadata handling, and synchronization

The goal is to demonstrate a complete, maintainable full-stack desktop application with clean UI/UX and smooth performance.

## 2. Step-by-Step Setup (for README)

### **Start Server Environment**

```
docker-compose up --build
```

Server runs at: `http://localhost:3000`

### **Start Electron App**

```
npm run build && npm run dev:electron
```

### **Development Workflow**

* Upload images
* View thumbnails
* Double-click for single view
* Crop and export selected areas
* Test sync by adding new images directly to server

---

## Conflict Resolution Strategy

**Strategy Chosen:** Server Always Wins ✅

- **Reasoning:** The server is considered the single source of truth. This ensures all local Electron apps remain consistent with the central database and mounted storage.
- **Potential Data-Loss Risks:** Any local changes to images that haven't been synced to the server will be overwritten during synchronization. Users should ensure they upload important local edits before syncing.

