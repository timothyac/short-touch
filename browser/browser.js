const { ipcRenderer } = require('electron');

const createButton = document.getElementById('create');
const nameInput = document.getElementById('btn-name');
const actionInput = document.getElementById('btn-action');
const colorPicker = document.getElementById('color-picker');
const existingContainer = document.getElementById('existing');

// return the local storage array
const returnLocalStorage = () => {
    const list = localStorage.getItem("buttons");
    const parsedList = JSON.parse(list);

    // check if the list contains anything
    if(parsedList === null) {
        return []
    } else {
        return parsedList;
    }
}

// fill the existing container
function setList() {
    const currentList = returnLocalStorage();

    // if empty then skip setting the list
    if(currentList === []) return;

    // run a loop through the arry
    currentList.forEach(button => {
        let circle = `<div class="circle" style="background: ${button.color}"></div>`;
        let title = `<p>${button.name}</p>`;

        let buttonItem = `<div class="button-item">${circle} ${title}</div>`;
        existingContainer.innerHTML += buttonItem;
    });

    ipcRenderer.send('create-new-button-array', (currentList));
}

// when the page first loads, set the list
window.onload = setList;

// listen for a click to create a new button
createButton.addEventListener('click', (e) => {
    e.preventDefault();

    // create a new object
    const newTouchButton = {
        name: nameInput.value,
        action: actionInput.value,
        color: colorPicker.value
    };

    // store it in an array combined with what's currently stored
    const buttons = [ ...returnLocalStorage(), newTouchButton ];

    // add it to an array
    localStorage.setItem("buttons", JSON.stringify(buttons));

    // send an event to the main
    // ipcRenderer.send('create-new-button', (e, newTouchButton));

    // reset values
    nameInput.value = '';
    actionInput.value = '';

    // remove existing dom elements
    while (existingContainer.firstChild) existingContainer.removeChild(existingContainer.firstChild);

    // refresh existing container
    setList();
});