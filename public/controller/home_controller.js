import { Inventory } from "../model/Inventory.js";
import { homePageView } from "../view/home_page.js";
import { currentUser } from "./firebase_auth.js";
import { addInventory } from "./firestore_controller.js";

export async function onClickCreateButton(e){
e.preventDefault();
let name = e.target.createKey.value.toLowerCase();
console.log('ay' + name);
const uid = currentUser.uid;
const createdBy = currentUser.email;
const timestamp = Date.now();
const quantity = 1;

const inventory = new Inventory({
    name, uid, quantity, createdBy, timestamp,
});

try {
    const docId = await addInventory(inventory);
    inventory.set_docId(docId);
} catch (error) {
    console.log('Failed to save inventory', error);
    alert('Failed to save inventory: ' + JSON.stringify(error));
    return;
}
homePageView();
}

export async function onClickUpdateButton(quantity){
    const content = quantity;
    const li = e.target.parentElement;
    if(quantity == 0){
        // delete the item if empty 
        try {
            await deleteToDoItem(li.id);
            // li.remove();
        } catch (e){
            if (DEV) console.log('failed to delete', e);
            alert('Failed to delete: ' + JSON.stringify(e));
        }
    } 
    // else {
    //     // update the trim
    //     const update = {content};
    //     try {
    //         await updateToDoItem(li.id, update);
    //         const span = li.children[0];
    //         span.textContent = content;
    //         const input = li.children[1];
    //         input.value = content;
    //     }catch (e){
    //         if (DEV) console.log('failed to update', e);
    //         alert('Failed to update: ' + JSON.stringify(e));
    //     }
    // }
}