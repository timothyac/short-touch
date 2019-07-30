const {
  BrowserWindow,
  TouchBar,
  ipcMain,
  shell,
  nativeImage
} = require("electron");

const {
  TouchBarLabel,
  TouchBarButton,
  TouchBarSpacer,
  TouchBarPopover
} = TouchBar;

const smallSpacer = new TouchBarSpacer({ size: "small" });
const largeSpacer = new TouchBarSpacer({ size: "large" });

function createTheTouchbar(listOfButtons) {
  // map out each button
  const filteredButtons = listOfButtons.filter(item => item.type === "button");
  const filteredLabel = listOfButtons.filter(item => item.type === "label");

  const touchBarButtons = filteredButtons.map(({ name, color, action }) => {
    return new TouchBarButton({
      label: name,
      backgroundColor: color,
      click: () => {
        // Use the shell to open links in the user browser
        if (action.type == "url") shell.openExternal(action.value);
        // Or an application
        if (action.type == "app") shell.openItem(action.value);
      }
    });
  });

  // map out welcome label
  const touchBarWelcomeLabel = filteredLabel.map(({ name }) => {
    return new TouchBarLabel({ label: `Welcome ${name}` });
  });

  const items = [smallSpacer, ...touchBarButtons];
  const escapeItem = touchBarWelcomeLabel[0];

  // Might add functionality for this in future
  // const popover = new TouchBarPopover({ label: "Popover", items });

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
