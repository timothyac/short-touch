const { app, BrowserWindow, TouchBar, ipcMain, shell } = require('electron')

const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar

const welcomeLabel = new TouchBarLabel({label: 'Welcome Tester'})
const smallSpacer = new TouchBarSpacer({ size: 'small' })
const touchItems = [ welcomeLabel, smallSpacer]

function createNewButton(newButtonObject){

    // Destructure the incoming object
    const { name, action, color } = newButtonObject

    // Create a new touch bar button
    const touchbtn = new TouchBarButton({
        label: name,
        backgroundColor: color,
        click: () => {
            // Use the shell to open links in the user browser
            shell.openExternal(action)
        }
    })

    // add to the original array
    touchItems.push(touchbtn)

    // recreate the touchbar
    const touchBar = new TouchBar({
        items: touchItems
      })

    // kill the escape bar
    touchBar.escapeItem = smallSpacer;

    // grab the current window
    const [win] = BrowserWindow.getAllWindows();

    // create the touchbar
    win.setTouchBar(touchBar)

}

// catch the event from browser.js
ipcMain.on('create-new-button', (e, newButtonObject) => {
    createNewButton(newButtonObject)
})

function createWindow() {
    let win = new BrowserWindow({
        width: 700,
        height: 500,
        darkTheme: true,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    win.loadFile('browser/index.html')
}

app.on('ready', createWindow)
