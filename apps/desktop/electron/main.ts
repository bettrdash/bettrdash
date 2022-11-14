import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as isDev from 'electron-is-dev'
const url = require('url');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 610,
    titleBarStyle: "hidden",
    webPreferences: {
      // contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  if (app.isPackaged) {
    // win.loadURL(`file://${path.join(__dirname, "../index.html")}`);
    win.loadURL('file://' + path.join(__dirname, "../index.html"));
  } else {
    // win.loadURL(url.format({
    //   pathname: path.join(__dirname, "../index.html"),
    //   protocol: 'file:',
    //   slashes: true
    // }))
    win.loadURL("http://localhost:3000");
    // Hot Reloading on 'node_modules/.bin/electronPath'
    require("electron-reload")(__dirname, {
      electron: path.join(
        __dirname,
        "..",
        "..",
        "node_modules",
        ".bin",
        "electron" + (process.platform === "win32" ? ".cmd" : "")
      ),
      forceHardReset: true,
      hardResetMethod: "exit",
    });
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});
