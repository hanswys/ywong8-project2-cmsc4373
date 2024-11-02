import { 
    getFirestore, collection, addDoc, query,
    where, orderBy, getDocs,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js"
import { app } from "./firebase_core.js";
import { Inventory } from "../model/Inventory.js";

const INVENTORY_COLL = 'inventory_collection';

const db = getFirestore(app);

export async function addInventory(inventory){
    const collRef = collection(db, INVENTORY_COLL);
    const docRef = await addDoc(collRef, inventory.toFirestore());
    return docRef.id; 
}