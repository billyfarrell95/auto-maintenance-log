import auth from "../firebase/firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const deleteItemFromDb = async (id: string) => {
    if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth?.currentUser?.uid);
        const itemsCollectionRef = collection(userDocRef, "items");
        const itemsDocRef = doc(itemsCollectionRef, id)
        await deleteDoc(itemsDocRef);
    }
}