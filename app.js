const { app, BrowserWindow, TouchBar, ipcMain, shell } = require('electron')

const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar

const welcomeLabel = new TouchBarLabel({label: 'Welcome Tester'})
const touchItems = [welcomeLabel]

function createNewButton(newButtonObject){

    // Destructure the incoming object
    const { name, action } = newButtonObject

    // Create a new touch bar button
    const touchbtn = new TouchBarButton({
        label: name,
        backgroundColor: '#7851a9',
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
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    win.loadFile('browser/index.html')
}

app.on('ready', createWindow)
