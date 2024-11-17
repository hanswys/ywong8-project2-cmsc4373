import { Inventory } from "../model/Inventory.js";
import { homePageView, buildCard } from "../view/home_page.js";
import { currentUser } from "./firebase_auth.js";
import { addInventory, updateInventory, deleteInventory, checkForDuplicate } from "./firestore_controller.js";
import { DEV } from "../model/constants.js";

export async function onSubmitCreateForm(e){
    e.preventDefault();
    const title = e.target.title.value.toLowerCase().trim();
    const uid = currentUser.uid;
    const quantity = 1;
    const timestamp = Date.now();
    const createdBy = currentUser.email;
    const duplicateResult = await checkForDuplicate(uid, title);
    
    if (duplicateResult.isDuplicate) {
        alert(`${title} already exists. Update quantity instead.`);
        return;
    }

    const inventory = new Inventory({title, uid, quantity, createdBy, timestamp});

    let docId;
    try{
        docId = await addInventory(inventory);
        inventory.set_docId(docId);
        console.log("success");
    } catch (e){
        if(DEV) console.log('failed to create: ', e);
        alert('Failed to create:' + JSON.stringify(e));
        return;
    }

    const container = document.getElementById('inventory-container');
    container.prepend(buildCard(inventory));
    e.target.title.value = '';
    homePageView();
}

export async function onClickAddButton(e){
    const button = e.target;
    const cardBody = button.parentElement;

    const docId = cardBody.id; // Assuming `docId` is the unique identifier for the inventory
    const quantityElement = cardBody.querySelector('.fs-3.card-title:nth-child(3)'); // Adjust selector if needed
    let currentQuantity = parseInt(quantityElement.textContent);

    const newQuantity = currentQuantity + 1;
    quantityElement.textContent = newQuantity; 
}

export async function onClickMinusButton(e){
    const button = e.target;
    const cardBody = button.parentElement;

    const docId = cardBody.id; // Assuming `docId` is the unique identifier for the inventory
    const quantityElement = cardBody.querySelector('.fs-3.card-title:nth-child(3)'); // Adjust selector if needed
    let currentQuantity = parseInt(quantityElement.textContent);
    if(currentQuantity <= 0){
        alert('Cannot reduce item below zero');
        onClickCancelButton(e);
        return;
    }   
    const newQuantity = currentQuantity - 1;
    quantityElement.textContent = newQuantity; 
}

export async function onClickUpdateButton(e){
    const button = e.target;
    const cardBody = button.parentElement;
    const li = e.target.parentElement;
    const docId = cardBody.id; 
    const quantityElement = cardBody.querySelector('.fs-3.card-title:nth-child(3)'); // Adjust selector if needed
    const newQuantity = parseInt(quantityElement.textContent);


    if(newQuantity == 0) {
        try {
            const r = confirm('Are you sure to delete permanently');
            if(!r) {
                onClickCancelButton(e);
                return;
            }
            await deleteInventory(docId);
            li.remove();
        } catch (e){
            if (DEV) console.log('failed to delete', e);
            alert('Failed to delete: ' + JSON.stringify(e));
        }
    }  else {
        const update = { quantity: newQuantity };
    try {
        await updateInventory(docId, update);
          cardBody.setAttribute('data-original-quantity', newQuantity);
        console.log(`Inventory ${docId} updated successfully to quantity: ${newQuantity}`);
        alert('Inventory updated successfully!');
    } catch (error) {
        console.error('Failed to update inventory:', error);
        alert('Failed to update inventory: ' + JSON.stringify(error));
    }
    }


}

export async function onClickCancelButton(e){
    const button = e.target;
    const cardBody = button.parentElement;

    const originalQuantity = parseInt(cardBody.getAttribute('data-original-quantity'));

    const quantityElement = cardBody.querySelector('.fs-3.card-title:nth-child(3)'); // Adjust selector if needed
    quantityElement.textContent = originalQuantity;

    console.log(`Quantity reset to original value: ${originalQuantity}`);
}
