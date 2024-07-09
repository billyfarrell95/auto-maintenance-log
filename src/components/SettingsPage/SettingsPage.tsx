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
            
            auth.currentUser.delete();

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
                        <a href="/app"><i className="bi bi-arrow-left"></i> Back</a>
                        <section>
                            <h2>Account Settings</h2>
                            {!hasDeletedAccount ? (
                                <>
                                    <h3>Delete account</h3>
                                    {!isDeleting ? (
                                        <button className="btn btn-primary" onClick={() => setIsDeleting(true)}>Delete account</button>
                                    ) : (
                                        <>
                                            <div className="d-flex gap-1">
                                                <button className="btn btn-danger" onClick={() => confirmDeleteAccount()}>Are you sure?</button>
                                                <button className="btn btn-secondary" onClick={() => setIsDeleting(false)}>Cancel</button>
                                            </div>
                                        </>
                                    )}
                                    <p className="fs-small my-1"><i className="bi bi-info-circle"></i> Deleting your account will remove your user account data, including login info and any data you have created.</p>
                                </>
                            ) : (
                                <>
                                    <p>Your account has been deleted.</p>
                                    <a href="/">Home</a>
                                </>
                            )}
                        </section>
                    </main>
                </>
            ) : (
                <Navigate to="/" />
            )}
        </>
    )
}

export default SettingsPage;