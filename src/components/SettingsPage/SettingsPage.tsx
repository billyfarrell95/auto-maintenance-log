import auth from "../../firebase/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { deleteDoc, } from "firebase/firestore";
import Header from "../Header/Header";
import { CollectionReference } from "firebase/firestore";
import { Item } from "../../types";
import { datePickerCurrentDate } from "../../utils/formatters";

function SettingsPage() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [hasDeletedAccount, setHasDeletedAccount] = useState(false);
    const [dataObjectUrl, setDataObjectUrl] = useState("");
    const [generateLinkLoading, setGenerateLinkLoading] = useState(false);
    const [userHasLogData, setUserHasLogData] = useState(false);

    useEffect(() => {
        if (auth?.currentUser) {
          const userDocRef = doc(db, 'users', auth?.currentUser?.uid);
          const itemsCollectionRef = collection(userDocRef, 'items');
          const archivedItemsCollectionRef = collection(userDocRef, 'archivedItems');
    
          const fetchUserData = async () => {
            try {
              const itemsSnapshot = await getDocs(itemsCollectionRef);
              const archivedItemsSnapshot = await getDocs(archivedItemsCollectionRef);
              let itemsData: Item[] = [];
              let archivedItemsData: Item[] = [];
          
              itemsSnapshot.forEach(doc => {
                const data = doc.data();
                const item: Item = {
                  id: data.id,
                  date: data.date,
                  vehicle: data.vehicle,
                  cost: data.cost,
                  description: data.description,
                  shop: data.shop,
                  mileage: data.mileage,
                  memo: data.memo,
                };
                itemsData.push(item);
              });
              
              archivedItemsSnapshot.forEach(doc => {
                const data = doc.data();
                const item: Item = {
                  id: data.id,
                  date: data.date,
                  vehicle: data.vehicle,
                  cost: data.cost,
                  description: data.description,
                  shop: data.shop,
                  mileage: data.mileage,
                  memo: data.memo,
                };
                archivedItemsData.push(item);
              });
    
              if (itemsData.length || archivedItemsData.length) {
                setUserHasLogData(true)
              } else {
                setUserHasLogData(false)
              }
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
    
          fetchUserData()
        }
      }, []);  
    const navigate = useNavigate();
    const confirmDeleteAccount = async () => {
        if (auth.currentUser) {
            
            setHasDeletedAccount(true)
            const userRef = doc(db, "users", auth?.currentUser?.uid);
            const itemsRef = collection(userRef, "items");
            const vehiclesRef = collection(userRef, "vehicles");
            const shopsRef = collection(userRef, "shops");

            await deleteCollectionDocs(itemsRef);
            await deleteCollectionDocs(vehiclesRef);
            await deleteCollectionDocs(shopsRef);
            
            auth.currentUser.delete();

            await deleteDoc(userRef);
            auth.signOut();
            setTimeout(() => {
                navigate('/');
            }, 3000);
            
        }
    }

    const generateDownloadLink = async () => {
        try {
            if (auth.currentUser?.uid) {
                setGenerateLinkLoading(true)
                setDataObjectUrl("")
                const userDocRef = doc(db, 'users', auth?.currentUser?.uid);
                const itemsCollectionRef = collection(userDocRef, 'items');
                const archivedItemsCollectionRef = collection(userDocRef, 'archivedItems');
                const itemsSnapshot = await getDocs(itemsCollectionRef);
                const archivedItemsSnapshot = await getDocs(archivedItemsCollectionRef);
                let itemsData: Item[] = [];
                let archivedItemsData: Item[] = [];
    
                itemsSnapshot.forEach(doc => {
                    const data = doc.data();
                    const item: Item = {
                    id: data.id,
                    date: data.date,
                    vehicle: data.vehicle,
                    cost: data.cost,
                    description: data.description,
                    shop: data.shop,
                    mileage: `"${data.mileage}"`,
                    memo: data.memo,
                    };
                    itemsData.push(item);
                });
                
                archivedItemsSnapshot.forEach(doc => {
                    const data = doc.data();
                    const item: Item = {
                        id: data.id,
                        date: data.date,
                        vehicle: data.vehicle,
                        cost: data.cost,
                        description: data.description,
                        shop: data.shop,
                        mileage: `"${data.mileage}"`,
                        memo: data.memo,
                    };
                    archivedItemsData.push(item);
                });
    
                const allData = [
                    ...itemsData,
                    ...archivedItemsData
                ]
    
                const titleKeys = Object.keys(allData[0])
    
                const refinedData = []
                refinedData.push(titleKeys)
    
                allData.forEach(item => {
                    refinedData.push(Object.values(item))  
                })
    
                let csvContent = ''
    
                refinedData.forEach(row => {
                    csvContent += row.join(',') + '\n'
                })
    
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
                const objUrl = URL.createObjectURL(blob)
                        
                if (objUrl) {
                    setDataObjectUrl(objUrl)
                }

                setGenerateLinkLoading(false)
            }
        } catch(error) {
            console.error("Error generating using data download")
        }
    }

    const deleteCollectionDocs = async (collectionRef: CollectionReference ) => {
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
                                    <p>Your account has been deleted. Redirecting to home...</p>
                                    <a href="/">Home</a>
                                </>
                            )}
                        </section>
                        <hr />
                        <section>
                            <h3>Download your data (CSV)</h3>
                            <p className="pb-1">Download all of your maintenance log items. This includes current items and archived items.</p>
                            <button className="btn btn-primary mb-1" onClick={generateDownloadLink} disabled={!userHasLogData}>Generate download link</button>
                            {dataObjectUrl !== "" ? (
                                <div>
                                    <a href={dataObjectUrl} download={datePickerCurrentDate()+"-auto-maintenance-log"+"-"+auth.currentUser.uid}><i className="bi bi-cloud-download"></i> Download (CSV)</a>
                                </div>
                            ) : (
                                <>
                                    {generateLinkLoading === true && (
                                        <div>Loading...</div>
                                    )}
                                </>
                            )}
                        </section>
                    </main>
                </>
            ) : (
                <Navigate to="/app" />
            )}
        </>
    )
}

export default SettingsPage;