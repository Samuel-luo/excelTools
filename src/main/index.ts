import { app, BrowserWindow, ipcMain } from "electron";
import executeCopyByKeywords from "&/functions/CopyByKeywords";

declare const EXCEL_TOOLS_WEBPACK_ENTRY: string;
declare const EXCEL_TOOLS_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    // frame: false,
    webPreferences: {
      preload: EXCEL_TOOLS_PRELOAD_WEBPACK_ENTRY
    }
  });

  ipcMain.handle("executeCopyByKeywords", (e, taskList) => {
    executeCopyByKeywords(taskList)
      .then(() =>
        mainWindow.webContents.send("executeCopyByKeywordsCallback", true)
      )
      .catch(() =>
        mainWindow.webContents.send("executeCopyByKeywordsCallback", false)
      );
  });

  mainWindow.setMenu(null);
  mainWindow.loadURL(EXCEL_TOOLS_WEBPACK_ENTRY);

  if (!app.isPackaged) mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
