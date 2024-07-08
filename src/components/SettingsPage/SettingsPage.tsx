import auth from "../../firebase/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { deleteDoc } from "firebase/firestore";
import Header from "../Header/Header";

function SettingsPage() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [hasDeletedAccount, setHasDeleteAccount] = useState(false)
    // const navigate = useNavigate()
    const confirmDeleteAccount = async () => {
        if (auth.currentUser) {
            setHasDeleteAccount(true)
            const userRef = doc(db, "users", auth?.currentUser?.uid);
            const itemsRef = collection(userRef, "items");
            const vehiclesRef = collection(userRef, "vehicles");
            const shopsRef = collection(userRef, "shops");

            await deleteCollectionDocs(itemsRef);
            await deleteCollectionDocs(vehiclesRef);
            await deleteCollectionDocs(shopsRef);

            await deleteDoc(userRef);
            auth.signOut()
        }
    }
    // @todo: defined types for collectionRef
    const deleteCollectionDocs = async (collectionRef: any) => {
        const snapshot = await getDocs(collectionRef);
        snapshot.forEach((doc) => {
            deleteDoc(doc.ref);
        });
    }
    return (
        <>
            {auth.currentUser ? (
                <>
                    <Header />
                    <main className="main-wrapper">
                        {!hasDeletedAccount ? (
                            <>
                                <h1>Account Settings</h1>
                                <h2>Delete account</h2>
                                {!isDeleting ? (<button className="btn btn-danger" onClick={() => setIsDeleting(true)}>Proceed to delete</button>) : (<button className="btn btn-danger" onClick={() => confirmDeleteAccount()}>Are you sure?</button>)}
                            </>
                        ) : (
                            <>
                                <p>Your account has been deleted.</p>
                                <a href="/">Home</a>
                            </>
                        )}
                    </main>
                </>
            ) : (
                <Navigate to="/" />
            )}
        </>
    )
}

export default SettingsPage;