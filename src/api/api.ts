import auth from "../firebase/firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { QuerySnapshot, DocumentData } from "firebase/firestore";
import { Vehicle } from "../types";

export const deleteItemFromDb = async (id: string) => {
    if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth?.currentUser?.uid);
        const itemsCollectionRef = collection(userDocRef, "items");
        const itemsDocRef = doc(itemsCollectionRef, id)
        await deleteDoc(itemsDocRef);
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

