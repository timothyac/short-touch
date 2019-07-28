const {
  app,
  BrowserWindow,
  TouchBar,
  ipcMain,
  shell,
  Menu
} = require("electron");
const applicationInfo = require("../package.json");
require("./touchbar");

function createWindow() {
  let win = new BrowserWindow({
    width: 700,
    height: 485,
    backgroundColor: "#474747",
    darkTheme: true,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile(`${__dirname}/browser/index.html`);
}

app.setAboutPanelOptions({
  applicationName: "Short Touch",
  applicationVersion: applicationInfo.version,
  version: "beta",
  copyright: "Copyright © 2019 Sunstrous"
});

app.on("ready", createWindow);
