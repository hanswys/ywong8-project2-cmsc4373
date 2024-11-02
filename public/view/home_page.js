import { currentUser } from "../controller/firebase_auth.js";
import { root } from "./element.js";
import { protectedView } from "./protected_view.js";
import { onClickCreateButton } from "../controller/home_controller.js";
import { getInventoryList } from "../controller/firestore_controller.js";
import { Inventory } from "../model/Inventory.js";

let inventoryList = null;

export async function homePageView() {
    if (!currentUser) {
        root.innerHTML = await protectedView();
        return;
    }

    const response = await fetch('/view/templates/home_page_template.html',
        { cache: 'no-store' });
    const divWrapper = document.createElement('div');
    divWrapper.innerHTML = await response.text();
    divWrapper.classList.add('m-4', 'p-4')
    divWrapper.querySelector('#form-create').onsubmit = onClickCreateButton;
    let homeRoot = divWrapper.querySelector('#home-root');


    root.innerHTML = '';
    root.appendChild(divWrapper);


    if (inventoryList == null) {
        homeRoot.innerHTML = '<h2>Loading ...</h2>'
        try {
            inventoryList = await getInventoryList(currentUser.uid);
        } catch (e) {
            homeRoot.innerHTML = '';
            console.log('failed to read: ', e);
            alert('Failed to get photomemo list: ' + JSON.stringify(e));
            return;
        }
    }

    if (inventoryList.length == 0) {
        homeRoot.innerHTML = '<h2>No photomemo has been added!</h2>'
        return;

    }

    homeRoot.innerHTML = '';
    inventoryList.forEach(p => {
        const cardView = createInventoryView(p);
        homeRoot.appendChild(cardView);
    });
}


export function createInventoryView(inventory) {
    const cardView = document.createElement('div');
    cardView.classList.add('card');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardView.appendChild(cardBody);

    const h5 = document.createElement('h5');
    h5.classList.add('card-title');
    h5.innerText = inventory.name;
    cardBody.appendChild(h5);

    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('button-group');

    const minusButton = document.createElement('button');
    minusButton.classList.add('minus');
    minusButton.innerText = '-';
    buttonGroup.appendChild(minusButton);

    const quantityDisplay = document.createElement('span');
    quantityDisplay.innerText = inventory.quantity;
    buttonGroup.appendChild(quantityDisplay);

    const plusButton = document.createElement('button');
    plusButton.classList.add('plus');
    plusButton.innerText = '+';
    buttonGroup.appendChild(plusButton);

    const updateButton = document.createElement('button');
    updateButton.classList.add('update');
    updateButton.innerText = 'Update';
    buttonGroup.appendChild(updateButton);

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel');
    cancelButton.innerText = 'Cancel';
    buttonGroup.appendChild(cancelButton);

    cardBody.appendChild(buttonGroup);

    minusButton.addEventListener('click', () => {
        quantityDisplay.innerText = --inventory.quantity;
        console.log(inventory.quantity);
    });

    plusButton.addEventListener('click', () => {
        quantityDisplay.innerText = ++inventory.quantity;
        console.log(inventory.quantity);
    });

    updateButton.addEventListener('click', () => {
        console.log('current inventory:' + inventory.quantity);
    });

    cancelButton.addEventListener('click', () => {
        
    });

    return cardView;
}
