import auth from "../firebase/firebase";
import { collection, doc, deleteDoc, setDoc, QuerySnapshot, DocumentData, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Vehicle } from "../types";
import { Item } from "../types";

export const deleteItemFromDb = async (id: string) => {
    if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth?.currentUser?.uid);
        const itemsCollectionRef = collection(userDocRef, "items");
        const itemsDocRef = doc(itemsCollectionRef, id)
        await deleteDoc(itemsDocRef);
    }
}

export const deleteVehicleFromDb = async (vehicleId: string) => {
    if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth?.currentUser?.uid);
        const vehiclesCollectionRef = collection(userDocRef, "vehicles");
        const vehicleDocRef = doc(vehiclesCollectionRef, vehicleId)
        await deleteDoc(vehicleDocRef);
    }
}

export const deleteArchivedVehicleFromDb = async (vehicleId: string) => {
    if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth?.currentUser?.uid);
        const vehiclesCollectionRef = collection(userDocRef, "archivedVehicles");
        const vehicleDocRef = doc(vehiclesCollectionRef, vehicleId)
        await deleteDoc(vehicleDocRef);
    }
}

export const deleteArchivedItemsFromDb = async (id: string) => {
    try {
        if (auth.currentUser) {
            const userDocRef = doc(db, "users", auth?.currentUser?.uid);
            const itemsCollectionRef = collection(userDocRef, "archivedItems");
            const itemsDocRef = doc(itemsCollectionRef, id)
            await deleteDoc(itemsDocRef);
        }
    } catch (error) {
        console.error("error deleting archived item from DB")
    }
    
}

export const updateVehiclesFromDb = async (snapshot: QuerySnapshot<DocumentData, DocumentData>) => {
    let vehiclesData: Vehicle[] = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        const vehicle: Vehicle = {
            id: data.id,
            name: data.name,
            archived: data.archived
        };
        vehiclesData.push(vehicle);
    });

    return vehiclesData
}

export const addNewItemToDb = async (trimmedItem: Item) => {
    if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth?.currentUser?.uid);
        const itemsCollectionRef = collection(userDocRef, 'items');
        // Create doc with custom ID (for reference when editing or deleting)
        await setDoc(doc(itemsCollectionRef, trimmedItem.id), trimmedItem);
    }
}

export const updateItemInDb = async (itemToUpload: Item, itemId: string) => {
    if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth?.currentUser?.uid);
        const itemsCollectionRef = collection(userDocRef, "items");
        const itemsDocRef = doc(itemsCollectionRef, itemId)             
        await updateDoc(itemsDocRef, itemToUpload as Partial<Item>);
    }
}