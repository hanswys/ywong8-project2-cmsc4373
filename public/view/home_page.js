import { currentUser } from "../controller/firebase_auth.js";
import { root } from "./element.js";
import { protectedView } from "./protected_view.js";
import { onSubmitCreateForm, onClickAddButton, onClickCancelButton, onClickMinusButton, onClickUpdateButton } from "../controller/home_controller.js";
import { DEV } from "../model/constants.js";
import { getInventoryList } from "../controller/firestore_controller.js";


export async function homePageView() {
    if (!currentUser) {
        root.innerHTML = await protectedView();
        return;
    }

    const response = await fetch('/view/templates/home_page_template.html',
        { cache: 'no-store' });
    const divWrapper = document.createElement('div');
    divWrapper.innerHTML = await response.text();
    divWrapper.classList.add('m-4', 'p-4');
    const container = divWrapper.querySelector('#inventory-container');
    const form = divWrapper.querySelector('form');
    form.onsubmit = onSubmitCreateForm;


    root.innerHTML = '';
    root.appendChild(divWrapper);
    let inventoryList;
    if(inventoryList == null){
        try {
            inventoryList = await getInventoryList(currentUser.uid);
            console.log(inventoryList);
        } catch (e) {
            if (DEV) console.log('Failed to get title list', e);
            alert('Failed to get title list: ' + JSON.stringify(e));
            return;
        }
    }
   

    if (inventoryList.length == 0) {
        container.innerHTML = '<h2>No inventory has been added!</h2>'
        return;
    }

    container.innerHTML = '';
    // const container = divWrapper.querySelector('#inventory-container');
    inventoryList.forEach(title => {
        container.appendChild(buildCard(title));
    });

}

export function buildCard(inventory) {
    const div = document.createElement('div');
    div.classList.add('card', 'd-inline-block');
    div.style = "width: 25rem;";
    div.innerHTML = `
        <div id="${inventory.docId}" class="card-body" data-original-quantity="${inventory.quantity}">
            <span class="fs-3 card-title">${inventory.title}</span>
            <button id="minus" class="btn btn-outline-danger">-</button>
            <span class="fs-3 card-title">${inventory.quantity}</span>
            <button id="add" class="btn btn-outline-primary">+</button>
            <button id="update" class="btn btn-outline-primary">Update</button>
            <button id="cancel" class="btn btn-outline-secondary">Cancel</button>
        </div>
    `;
    const minusButton = div.querySelector('#minus');
    const addButton = div.querySelector('#add');
    const updateButton = div.querySelector('#update');
    const cancelButton = div.querySelector('#cancel');

    minusButton.onclick = onClickMinusButton;
    addButton.onclick = onClickAddButton;
    updateButton.onclick = onClickUpdateButton;
    cancelButton.onclick = onClickCancelButton;


    return div;
}