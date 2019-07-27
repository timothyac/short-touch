const { app, BrowserWindow, TouchBar, ipcMain, shell } = require('electron')

const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar

const welcomeLabel = new TouchBarLabel({label: 'Welcome Tester'})
const smallSpacer = new TouchBarSpacer({ size: 'small' })
const touchItems = [ welcomeLabel, smallSpacer]

function createTheTouchbar(listOfButtons) {
    // map out each button
    const touchBarButtons = listOfButtons.map(({name, color, action}) => {
		return new TouchBarButton({
			label: name,
			backgroundColor: color,
			click: () => {
				// Use the shell to open links in the user browser
                shell.openExternal(action)
			}
		});
	});

    // create the touchbar
    const touchBar = new TouchBar({ items:touchBarButtons});

    // kill the escape bar
    touchBar.escapeItem = smallSpacer;
    
	// grab the current window
    const [win] = BrowserWindow.getAllWindows();

    // create the touchbar
	win.setTouchBar(touchBar);
}

// catch event from browser.js
ipcMain.on('create-new-button-array', (e, list) => {
    createTheTouchbar(list)
})

function createWindow() {
    let win = new BrowserWindow({
        width: 700,
        height: 485,
        darkTheme: true,
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            nodeIntegration: true,
        },
    })

    win.loadFile('browser/index.html')
}

app.on('ready', createWindow)
