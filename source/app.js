const { app, BrowserWindow } = require("electron");
require("./touchbar");
require("./createButton");

function createWindow() {
  let win = new BrowserWindow({
    width: 700,
    height: 485,
    backgroundColor: "#474747",
    darkTheme: true,
    titleBarStyle: "hiddenInset",
    resizable: app.isPackaged,
    webPreferences: {
      nodeIntegration: true,
      devTools: app.isPackaged
    }
  });

  win.loadFile(`${__dirname}/browser/index.html`);
}

app.setAboutPanelOptions({
  applicationName: app.getName(),
  applicationVersion: app.getVersion(),
  version: "beta",
  copyright: "Copyright © 2019 Sunstrous"
});

app.on("ready", createWindow);
