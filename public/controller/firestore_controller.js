import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
 } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js"
import { app } from "./firebase_core.js";
import { Inventory } from "../model/Inventory.js";

const INVENTORY_COLL = 'inventory_collection';

const db = getFirestore(app);

export async function addInventory(inventory){
    console.log(inventory);
    const docRef = await addDoc(collection(db, INVENTORY_COLL), inventory.toFirestore());
    return docRef.id;
}


export async function getInventoryList(uid){
    let inventoryList = [];
    const q = query(collection(db, INVENTORY_COLL),
    where('uid', '==', uid),
    orderBy('title', 'asc'));
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const t = new Inventory(doc.data(), doc.id);
        inventoryList.push(t);
    });
    return inventoryList;
}

export async function updateInventory(docId, update){
    const docRef = doc(db, INVENTORY_COLL, docId);
    await updateDoc(docRef, update);
}

export async function deleteInventory(docId){
    const docRef = doc(db, INVENTORY_COLL, docId);
    await deleteDoc(docRef);
}