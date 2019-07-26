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

    const buttons = [newTouchButton]

    localStorage.setItem("buttons", JSON.stringify(buttons))

    

    ipcRenderer.send('create-new-button', (e, newTouchButton))
})