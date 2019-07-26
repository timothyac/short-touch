const { ipcRenderer } = require('electron')

const createButton = document.getElementById('create')
const nameInput = document.getElementById('btn-name')
const actionInput = document.getElementById('btn-action')

createButton.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('clicked')
    const newTouchButton = {
        name: nameInput.value,
        action: actionInput.value
    }
ipcRenderer.send('create-new-button', (e, newTouchButton))
})