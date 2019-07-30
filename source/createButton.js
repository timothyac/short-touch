const { BrowserWindow, TouchBar, ipcMain, shell } = require("electron");

const {
  TouchBarLabel,
  TouchBarButton,
  TouchBarSpacer,
  TouchBarColorPicker,
  TouchBarSegmentedControl
} = TouchBar;

const smallSpacer = new TouchBarSpacer({ size: "small" });

function createTheTouchbar() {
  console.log("LOADED CREATE BAR");
  const segement = new TouchBarSegmentedControl({
    segments: [
      {
        label: "URL"
      },
      {
        label: "App"
      }
    ],
    change: selectedIndex => {
      console.log("Changed", selectedIndex);
    }
  });

  const colorPicker = new TouchBarColorPicker({
    availableColors: ["#121217", "#17171d", "#51515a", "#0070c9"]
  });

  // create the touchbar
  const touchBar = new TouchBar({ items: [segement, colorPicker] });

  // grab the current window
  const [win] = BrowserWindow.getAllWindows();

  // create the touchbar
  win.setTouchBar(touchBar);
}

// catch event from browser.js
ipcMain.on("create-new-button-mode", () => {
  createTheTouchbar();
});
