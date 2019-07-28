const { BrowserWindow, TouchBar, ipcMain, shell } = require("electron");

const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;

const smallSpacer = new TouchBarSpacer({ size: "small" });
const largeSpacer = new TouchBarSpacer({ size: "large" });

function createTheTouchbar(listOfButtons) {
  // map out each button

  const filteredButtons = listOfButtons.filter(item => item.type === "button");
  const filteredLabel = listOfButtons.filter(item => item.type === "label");

  const touchBarButtons = filteredButtons.map(
    ({ name, color, action, type }) => {
      return new TouchBarButton({
        label: name,
        backgroundColor: color,
        click: () => {
          // Use the shell to open links in the user browser
          shell.openExternal(action);
        }
      });
    }
  );

  // map out welcome label
  const touchBarWelcomeLabel = filteredLabel.map(({ name, type }) => {
    return new TouchBarLabel({ label: `Welcome ${name}` });
  });

  const items = [smallSpacer, ...touchBarButtons];
  const escapeItem = touchBarWelcomeLabel[0];

  // create the touchbar
  const touchBar = new TouchBar({ items, escapeItem });

  // grab the current window
  const [win] = BrowserWindow.getAllWindows();

  // create the touchbar
  win.setTouchBar(touchBar);
}

// catch event from browser.js
ipcMain.on("create-new-button-array", (e, list) => {
  createTheTouchbar(list);
});
