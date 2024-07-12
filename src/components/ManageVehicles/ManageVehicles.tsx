import { useState, FormEvent } from "react";
import { Vehicle, Item } from "../../types";
import "./ManageVehicles.css";
import { Dispatch, SetStateAction } from "react";
import auth from "../../firebase/firebase";
import { doc, collection, query, where, deleteDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { deleteItemFromDb } from "../../api/api";
import { updateVehiclesFromDb } from "../../api/api";

interface ManageVehiclesProps {
    vehicles: Vehicle[];
    setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
    items: Item[],
    setItems: Dispatch<SetStateAction<Item[]>>;
    archivedItems: Item[],
    setArchivedItems: Dispatch<SetStateAction<Item[]>>;
}

const initialValues: Vehicle = {
    id: "",
    name: "",
    archived: false,
};

function ManageVehicles({ vehicles, setVehicles, items, setItems, archivedItems, setArchivedItems }: ManageVehiclesProps) {
    const [newVehicle, setNewVehicle] = useState<Vehicle>({ ...initialValues });
    const [loading, setLoading] = useState(false);
    const [confirmedDelete, setConfirmedDelete] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const vehicle = {
            ...newVehicle,
            name: value,
        }
        setNewVehicle(vehicle)
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newVehicleTrimmed = {
            ...newVehicle,
            name: newVehicle.name.trim(),
            id: crypto.randomUUID(),
            archived: false
        }
        if (newVehicleTrimmed.name && !vehicles.some(e => e.name.toLowerCase() === newVehicleTrimmed.name.toLowerCase())) {
            try {
                if (auth.currentUser) {
                    const userDocRef = doc(db, "users", auth?.currentUser?.uid);
                    const vehiclesCollectionRef = collection(userDocRef, 'vehicles');
                    // setDoc rather than addDoc so that Doc can have custom ID (vehicle ID)
                    await setDoc(doc(vehiclesCollectionRef, newVehicleTrimmed.id), newVehicleTrimmed);
                }
            } catch (error) {
                console.error("Error adding new vehicle to db", error)
            }
            setVehicles([...vehicles, newVehicleTrimmed]);
        } else {
            alert('Vehicle name already used.');
        }
        setNewVehicle({...initialValues});
    }

    const handleDeleteVehicle = async (id: string) => {
        const updatedVehicles = vehicles.filter((vehicle, _) => vehicle.id !== id);
        setVehicles(updatedVehicles)
        try {
            if (auth.currentUser) {
                const userDocRef = doc(db, "users", auth?.currentUser?.uid);
                const vehiclesCollectionRef = collection(userDocRef, 'vehicles');
                const q = query(vehiclesCollectionRef, where("id", "==", id));

                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    deleteDoc(doc.ref);
                });
                handleDeleteAssociatedItems(id);
            }
        } catch (error) {
            console.error("Error deleting vehicle from db", error)
        }
    }

    const handleDeleteAssociatedItems = async (vehicleId: string) => {
        const currentVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);
        const itemsToDelete = items.filter((item) => item.vehicle == currentVehicle?.name);
        const newArr = items.filter(item => item.vehicle !== currentVehicle?.name);
        setItems(newArr);
        setArchivedItems(itemsToDelete);
        try {
            if (auth.currentUser) {

                itemsToDelete.forEach(item => {
                    deleteItemFromDb(item.id)
                })
            }
        } catch (error) {
            console.error("Error deleting items that were assigned to deleted vehicle", error)
        }
    };
    
    const handleArchiveItems = async (vehicleId: string) => {
        setLoading(true)
        const currentVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);
        const itemsToArchive = items.filter((item) => item.vehicle == currentVehicle?.name);
        const newArr = items.filter(item => item.vehicle !== currentVehicle?.name);
        setItems(newArr);
        setArchivedItems(itemsToArchive);
        try {
            if (auth.currentUser) {
                // Delete items from items collection
                itemsToArchive.forEach(item => {
                    deleteItemFromDb(item.id)
                })

                // Save items to archivedItems collection
                const userDocRef = doc(db, "users", auth?.currentUser?.uid);
                const archivedCollectionRef = collection(userDocRef, 'archivedItems');
                itemsToArchive.forEach(item => {
                    setDoc(doc(archivedCollectionRef, item.id), item);
                })

                const vehiclesCollectionRef = collection(userDocRef, "vehicles");
                const vehicleDocRef = doc(vehiclesCollectionRef, vehicleId)             
                await updateDoc(vehicleDocRef, {archived: true});
                const vehiclesSnapshot = await getDocs(vehiclesCollectionRef);
                const vehiclesData = await updateVehiclesFromDb(vehiclesSnapshot)
                setVehicles(vehiclesData);
                setLoading(false)
            }
        } catch (error) {
            console.error("Error archiving", error)
        }
    };

    const viewDeletionPreview = async (vehicleId: string) => {
        if (auth.currentUser) {
            const userDocRef = doc(db, "users", auth?.currentUser?.uid);
            const currentVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);
            const archivedItemsCollectionRef = collection(userDocRef, 'archivedItems');
            const q = query(archivedItemsCollectionRef, where("vehicle", "==", currentVehicle?.name));
            const querySnapshot = await getDocs(q);
            let itemsToDelete: Item[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data()
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
                itemsToDelete.push(item)
            });
            
            console.log("Items to delete", itemsToDelete)
        }
    }

    const recoverArchivedItems = async (vehicleId: string) => {
        if (auth.currentUser) {
            const userDocRef = doc(db, "users", auth?.currentUser?.uid);
            const currentVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);
            const archivedItemsCollectionRef = collection(userDocRef, 'archivedItems');
            const q = query(archivedItemsCollectionRef, where("vehicle", "==", currentVehicle?.name));
            const querySnapshot = await getDocs(q);
            let itemsToRecover: Item[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data()
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
                itemsToRecover.push(item)
            });
            
            console.log("Items to recover", itemsToRecover)
        }
    }
    
    return (
        <>
            <h2>Manage your vehicles</h2>
            <p>Add vehicles for quick access when adding maintenance items.</p>
            <form onSubmit={(e) => {handleSubmit(e)}} className="vehicles-form">
                <div>
                    <label htmlFor="addVehicle">Add a vehicle</label>
                    <input id="addVehicle" type="text" onChange={handleChange} value={newVehicle.name} placeholder="Vehicle name" required />
                </div>
                <div className="align-self-flex-end"><button type="submit" className="btn btn-primary">Add</button></div>
            </form>
            <h3>Your vehicles:</h3>
            {vehicles.length > 0 && (
                <div>
                    <div className="vehicles-list-wrapper pb-1">
                        <ul role="list" className="vehicles-list-wrapper__list">
                        {vehicles.map((vehicle) => (
                            <div key={vehicle.id}>
                                {vehicle.archived == false && (
                                    <li key={vehicle.id} className="vehicles-list-wrapper__item">
                                    {vehicle.name}
                                    <div className="d-flex gap-05">
                                        <button onClick={() => handleArchiveItems(vehicle.id)} className="btn btn-secondary btn-sm">
                                            {loading ? (
                                                <div className="spinner"></div> 
                                            ) : (
                                                <i className="bi bi-archive"></i>
                                            )}
                                            <span> Archive</span>
                                        </button>
                                        <p className="fs-small"><i className="bi bi-info-circle"></i> NUMBER items will be archived</p>
                                    </div>
                                </li>
                                )}
                            </div>
                        ))}
                        </ul>
                    </div>
                </div>
            )}

                <div className="vehicles-list-wrapper py-1">
                    <h3>Archived vehicles</h3>
                    <ul role="list" className="vehicles-list-wrapper__list">
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.id}>
                            {vehicle.archived == true && (
                                <li key={vehicle.id} className="vehicles-list-wrapper__item">
                                    {vehicle.name}
                                    <div>
                                        {/* @todo: add confirmation before deleting */}
                                        {!confirmedDelete ? (
                                            <button onClick={() => setConfirmedDelete(true)} className="btn btn-sm btn-secondary"><i className="bi bi-trash3"></i> Delete</button>
                                        ) : (
                                            <div>
                                                <button onClick={() => handleDeleteVehicle(vehicle.id)} className="btn btn-sm btn-outline-danger"><i className="bi bi-trash3"></i> Confirm delete</button>
                                                <button onClick={() => setConfirmedDelete(false)} className="btn btn-sm btn-secondary">Cancel</button>
                                            </div>
                                        )}
                                        
                                    </div>
                                    <p className="fs-small"><i className="bi bi-info-circle"></i> NUMBER of associated items will also be deleted. </p>
                                    <button onClick={() => viewDeletionPreview(vehicle.id)} className="btn btn-sm btn-secondary">Preview delete</button>
                                    <button onClick={() => recoverArchivedItems(vehicle.id)} className="btn btn-sm btn-secondary">Recover</button>
                                </li>
                            )}
                        </div>
                    ))}
                    </ul>
                </div>
        </>
    )
}

export default ManageVehicles;