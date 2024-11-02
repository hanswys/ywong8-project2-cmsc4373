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
}