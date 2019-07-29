const { ipcRenderer, shell } = require("electron");

// form buttons and inputs
const createButton = document.getElementById("create");
const updateButton = document.getElementById("update");
const deleteButton = document.getElementById("delete");
const updateLabelButton = document.getElementById("update-label");
const nameInput = document.getElementById("btn-name");
const actionInput = document.getElementById("btn-action");
const colorPicker = document.getElementById("color-picker");
const nameEditInput = document.getElementById("btn-name-edit");
const actionEditInput = document.getElementById("btn-action-edit");
const colorPickerEdit = document.getElementById("color-picker-edit");
const labelNameInput = document.getElementById("btn-name-edit-label");
const actionTypeInputUrl = document.getElementById("btn-action-type-url");
const actionTypeInputApp = document.getElementById("btn-action-type-app");
const actionTypeEditInputApp = document.getElementById(
  "btn-action-type-app-edit"
);
const actionTypeEditInputUrl = document.getElementById(
  "btn-action-type-url-edit"
);

// existing container
const existingContainer = document.getElementById("existing");
const labelContainer = document.getElementById("label-container");
const buttonsContainer = document.getElementById("buttons-container");
const existingButtons = document.getElementsByClassName("button-item");

// tabs
const createTab = document.getElementById("tab-create");
const editTab = document.getElementById("tab-edit");

// form pages
const createForm = document.getElementById("create-form");
const editForm = document.getElementById("edit-form");
const labelForm = document.getElementById("label-form");

// return the local storage array
const returnLocalStorage = () => {
  const list = localStorage.getItem("buttons");
  const parsedList = JSON.parse(list);

  // check if the list contains anything
  if (parsedList === null) {
    return [];
  } else {
    return parsedList;
  }
};

// fill the existing container
function setList() {
  const currentList = returnLocalStorage();

  // if empty then skip setting the list
  if (currentList === []) return;

  // run a loop through the array
  currentList.forEach(button => {
    let { name, color, action, type } = button;

    if (type == "button") {
      let circle = `<div class="circle" style="background: ${color}"></div>`;
      let title = `<p>${name.length > 8 ? name.slice(0, 8) + "..." : name}</p>`;

      let buttonItem = `<div name="${name}" action="${
        action.value
      }" action-type=${
        action.type
      } color="${color}" class="button-item">${circle} ${title}</div>`;
      buttonsContainer.innerHTML += buttonItem;
    } else if (type == "label") {
      let circle = `<div class="circle" style="background: ${color}"></div>`;
      let title = `<p>${name}</p>`;

      let buttonItem = `<div type="label" name="${name}" action="//" color="#353535" class="button-item name-label">${circle} ${title}</div>`;
      labelContainer.innerHTML += buttonItem;
    }
  });

  ipcRenderer.send("create-new-button-array", currentList);

  // for loop that will add event listeners to each div
  for (let i = 0; i < existingButtons.length; i++) {
    existingButtons[i].addEventListener("click", e => {
      // define the element
      let element = e.target;

      // make sure we can't click on inner elements
      if (element.className == "button-item name-label") {
        removeActiveClass();
        element.classList.add("active");
        switchToLabelPage(element);
      }

      // make sure we can't click on inner elements
      if (element.className == "button-item") {
        removeActiveClass();
        element.classList.add("active");
        switchToEditPage(element);
      }
    });
  }
}

// remove an existing active class when switching elements
function removeActiveClass() {
  for (let i = 0; i < existingButtons.length; i++) {
    let button = existingButtons[i];

    // check to see if it has the active class
    if (button.classList[1] == "active") {
      button.classList.remove("active");
    } else if (button.classList[2] == "active") {
      button.classList.remove("active");
    }
  }
}

function switchToEditPage(button) {
  editTab.classList.add("active");
  createTab.classList.remove("active");
  labelForm.classList.add("hidden");
  createForm.classList.add("hidden");
  editForm.classList.remove("hidden");

  // load the values into the inputs
  nameEditInput.value = button.getAttribute("name");
  actionEditInput.value = button.getAttribute("action");
  colorPickerEdit.value = button.getAttribute("color");

  if (button.getAttribute("action-type") == "url") {
    actionTypeEditInputUrl.checked = true;
  } else {
    actionTypeEditInputApp.checked = true;
  }
}

function switchToLabelPage(button) {
  editTab.classList.add("active");
  createTab.classList.remove("active");
  createForm.classList.add("hidden");
  editForm.classList.add("hidden");
  labelForm.classList.remove("hidden");

  // load the values into the inputs
  labelNameInput.value = button.getAttribute("name");
}

function switchToCreatePage() {
  editTab.classList.remove("active");
  createTab.classList.add("active");
  createForm.classList.remove("hidden");
  editForm.classList.add("hidden");
  labelForm.classList.add("hidden");
  removeActiveClass();
}

function isStorageFull() {
  const currentList = returnLocalStorage();

  // touch bar length can't be more than 6
  if (currentList.length < 7) {
    return true;
  } else {
    return false;
  }
}

function cleanExistingContainer() {
  // remove existing dom elements
  while (labelContainer.firstChild)
    labelContainer.removeChild(labelContainer.firstChild);
  while (buttonsContainer.firstChild)
    buttonsContainer.removeChild(buttonsContainer.firstChild);

  const userText = `<p class="container-text">user</p>`;
  const buttonText = `<p class="container-text">button</p>`;
  labelContainer.innerHTML += userText;
  buttonsContainer.innerHTML += buttonText;
}

// when the page first loads, set the list
window.onload = setList;

// listen for a click to create a new button
createButton.addEventListener("click", e => {
  e.preventDefault();

  const notFull = isStorageFull();

  if (!notFull) {
    shell.beep();
    return alert("Can't have more than 6 buttons!");
  }

  if (nameInput.value == "") return alert("Name can't be empty");
  if (actionInput.value == "") return alert("Action can't be empty");

  // create a new object
  const newTouchButton = {
    name: nameInput.value,
    action: {
      type: actionTypeInputApp.checked ? "app" : "url",
      value: actionInput.value
    },
    color: colorPicker.value,
    type: "button"
  };

  // store it in an array combined with what's currently stored
  const buttons = [...returnLocalStorage(), newTouchButton];

  // add it to an array
  localStorage.setItem("buttons", JSON.stringify(buttons));

  // reset values
  nameInput.value = "";
  actionInput.value = "";
  colorPicker.value = "#f4f4f4";

  cleanExistingContainer();

  // refresh existing container
  setList();
});

// switch to create tab
createTab.addEventListener("click", switchToCreatePage);

// switch to edit tab
editTab.addEventListener("click", () => {
  const element = existingButtons[1];
  if (element) {
    switchToEditPage(element);
    element.classList.add("active");
  } else {
    shell.beep();
  }
});

// listen for a click on the update button
updateButton.addEventListener("click", e => {
  e.preventDefault();

  const currentList = returnLocalStorage();

  // create a new object
  const updateTouchButton = {
    name: nameEditInput.value,
    action: {
      type: actionTypeEditInputApp ? "app" : "url",
      value: actionEditInput.value
    },
    color: colorPickerEdit.value,
    type: "button"
  };

  // update the list with the edited values
  const updatedList = currentList.map(button => {
    if (button.name == nameEditInput.value) {
      return updateTouchButton;
    } else {
      return button;
    }
  });

  // update the localStorage
  localStorage.setItem("buttons", JSON.stringify(updatedList));

  // reset values
  nameEditInput.value = "";
  actionEditInput.value = "";
  colorPickerEdit.value = "#f4f4f4";

  cleanExistingContainer();

  // refresh existing container and switch to create;
  setList();
  switchToCreatePage();
});

// listen for a click on the update-label button
updateLabelButton.addEventListener("click", e => {
  e.preventDefault();

  const currentList = returnLocalStorage();

  // create a new object
  const updateNameLabel = {
    name: labelNameInput.value,
    type: "label"
  };

  // update the list with the edited values
  const updatedList = currentList.map(button => {
    if (button.type == "label") {
      return updateNameLabel;
    } else {
      return button;
    }
  });

  // update the localStorage
  localStorage.setItem("buttons", JSON.stringify(updatedList));

  // reset values
  labelNameInput.value = "";

  cleanExistingContainer();

  // refresh existing container and switch to create;
  setList();
  switchToCreatePage();
});

// listen for a click on the delete button
deleteButton.addEventListener("click", e => {
  e.preventDefault();

  const currentList = returnLocalStorage();

  // update the list with the edited values
  const updatedList = currentList.filter(
    button => button.name != nameEditInput.value
  );

  // update the localStorage
  localStorage.setItem("buttons", JSON.stringify(updatedList));

  // reset values
  nameEditInput.value = "";
  actionEditInput.value = "";
  colorPickerEdit.value = "#f4f4f4";

  cleanExistingContainer();

  // refresh existing container and switch to create;
  setList();
  switchToCreatePage();
});
