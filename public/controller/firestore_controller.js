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

export async function getInventoryList(uid){
    let inventoryList = [];
    const coll = collection(db, INVENTORY_COLL);
    const q = query(coll, 
        where('uid', '==', uid), 
        orderBy('timestamp', 'desc'),);
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const p = new Inventory(doc.data());
        p.set_docId(doc.id);
        inventoryList.push(p);
    });
    return inventoryList;
}