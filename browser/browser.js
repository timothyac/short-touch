const { ipcRenderer } = require('electron');

const createButton = document.getElementById('create');
const updateButton = document.getElementById('update');
const deleteButton = document.getElementById('delete');
const nameInput = document.getElementById('btn-name');
const actionInput = document.getElementById('btn-action');
const colorPicker = document.getElementById('color-picker');
const nameEditInput = document.getElementById('btn-name-edit');
const actionEditInput = document.getElementById('btn-action-edit');
const colorPickerEdit = document.getElementById('color-picker-edit');
const existingContainer = document.getElementById('existing');
const existingButtons = document.getElementsByClassName('button-item');
const createTab = document.getElementById('tab-create');
const editTab = document.getElementById('tab-edit');
const createForm = document.getElementById('create-form');
const editForm = document.getElementById('edit-form');

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
        let {name, color, action} = button;

        let circle = `<div class="circle" style="background: ${color}"></div>`;
        let title = `<p>${name}</p>`;

        let buttonItem = `<div name="${name}" action="${action}" color="${color}" class="button-item">${circle} ${title}</div>`;
        existingContainer.innerHTML += buttonItem;
    });

    ipcRenderer.send('create-new-button-array', (currentList));

    // for loop that will add event listeners to each div
    for (let i = 0; i < existingButtons.length; i++) {
        existingButtons[i].addEventListener('click', (e) => {
            // define the element
            let element = e.target

            // make sure we can't click on inner elements
            if(element.className == "button-item") {
                removeActiveClass()
                element.classList.add('active');
                switchToEditPage(element)
            }
        });
    }
}

// remove an existing active class when switching elements
function removeActiveClass() {
    for (let i = 0; i < existingButtons.length; i++) {
        let button = existingButtons[i]

        // check to see if it has the active class
        if(button.classList[1] == 'active') {
            button.classList.remove('active')
        }
    }
}

function switchToEditPage(button) {
    editTab.classList.add('active')
    createTab.classList.remove('active')
    createForm.classList.add('hidden')
    editForm.classList.remove('hidden')

    // load the values into the inputs
    nameEditInput.value = button.getAttribute('name')
    actionEditInput.value = button.getAttribute('action')
    colorPickerEdit.value = button.getAttribute('color')
}

function switchToCreatePage() {
    editTab.classList.remove('active')
    createTab.classList.add('active')
    createForm.classList.remove('hidden')
    editForm.classList.add('hidden')
    removeActiveClass()
}

function isStorageFull() {
    const currentList = returnLocalStorage();

    // touch bar length can't be more than 6
    if(currentList.length < 6 ) {
        return true
    } else {
        return false
    }
}

// when the page first loads, set the list
window.onload = setList;

// listen for a click to create a new button
createButton.addEventListener('click', (e) => {
    e.preventDefault();

    const notFull = isStorageFull()

    if(!notFull) {
        return alert("Can't have more than 6 buttons!")
    }

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

    // reset values
    nameInput.value = '';
    actionInput.value = '';
    colorPicker.value = '#f4f4f4';


    // remove existing dom elements
    while (existingContainer.firstChild) existingContainer.removeChild(existingContainer.firstChild);

    // refresh existing container
    setList();
});

// switch to create tab
createTab.addEventListener('click', switchToCreatePage);

// sswitch to edit tab
editTab.addEventListener('click', () => {
    const element = existingButtons[0];
    if(element) {
        switchToEditPage(element);
        element.classList.add('active');
    };
})

// listen for a click on the update button
updateButton.addEventListener('click', (e) => {
    e.preventDefault();

    const currentList = returnLocalStorage();

    // create a new object
    const updateTouchButton = {
        name: nameEditInput.value,
        action: actionEditInput.value,
        color: colorPickerEdit.value
    };

    // update the list with the edited values
    const updatedList = currentList.map((button) => {
        if(button.name == nameEditInput.value) {
            return updateTouchButton
        } else {
            return button
        }
    })

    // update the localStorage
    localStorage.setItem("buttons", JSON.stringify(updatedList));

    // reset values
    nameEditInput.value = '';
    actionEditInput.value = '';
    colorPickerEdit.value = '#f4f4f4';

    // remove existing dom elements
    while (existingContainer.firstChild) existingContainer.removeChild(existingContainer.firstChild);

    // refresh existing container and switch to create;
    setList();
    switchToCreatePage();
})

// listen for a click on the delete button
deleteButton.addEventListener('click', (e) => {
    e.preventDefault()

    const currentList = returnLocalStorage();

    // update the list with the edited values
    const updatedList = currentList.filter((button) => button.name != nameEditInput.value)

    // update the localStorage
    localStorage.setItem("buttons", JSON.stringify(updatedList));

    // reset values
    nameEditInput.value = '';
    actionEditInput.value = '';
    colorPickerEdit.value = '#f4f4f4';

    // remove existing dom elements
    while (existingContainer.firstChild) existingContainer.removeChild(existingContainer.firstChild);

    // refresh existing container and switch to create;
    setList();
    switchToCreatePage();
})