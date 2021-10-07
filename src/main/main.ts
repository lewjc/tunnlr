import { app, BrowserWindow, ipcMain } from "electron";
import { GlobalShare } from "../global";

import services from "./service";
import { ensureTunnelsAreStopped } from "./service/tunnel/service";

let globalShare: GlobalShare = {
  services,
};

global.share = globalShare;

global.share = { ...global.share };

ipcMain.on("global", (evt) => {
  evt.returnValue = JSON.stringify(globalShare);
});

let window: BrowserWindow | null = null;

export const getWindow = () => {
  return window;
};

function createWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    width: 1200,
    height: 600,
    minWidth: 650,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  window.loadFile("index.html");

  if (process.env.NODE_ENV === "development") {
    window.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    console.log("Ensure stopped");
    app.quit();
  }
});

app.on("before-quit", () => {
  ensureTunnelsAreStopped();
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
