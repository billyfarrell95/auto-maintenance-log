import { useState, FormEvent } from "react";
import { Vehicle, Item } from "../../types";
import "./ManageVehicles.css";
import { Dispatch, SetStateAction } from "react";
import auth from "../../firebase/firebase";
import { doc, collection, query, where, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { deleteItemFromDb, deleteArchivedItemsFromDb, deleteVehicleFromDb, deleteArchivedVehicleFromDb } from "../../api/api";
import { updateVehiclesFromDb } from "../../api/api";

interface ManageVehiclesProps {
    vehicles: Vehicle[];
    archivedVehicles: Vehicle[];
    setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
    setArchivedVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
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

function ManageVehicles({ vehicles, setVehicles, items, setItems, archivedItems, setArchivedItems, archivedVehicles, setArchivedVehicles }: ManageVehiclesProps) {
    const [newVehicle, setNewVehicle] = useState<Vehicle>({ ...initialValues });
    const [archivePreviewVehicleId, setArchivePreviewVehicleId] = useState("");
    const [archiveItemsPreview, setArchivedItemsPreview] = useState<Item[]>([]);
    const [archivePreviewVisible, setArchivePreviewVisible] = useState(false)
    const [loading, setLoading] = useState(false);
    // const [confirmedDelete, setConfirmedDelete] = useState(false);

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
        const updatedVehicles = vehicles.filter((vehicle, _) => vehicle.id == id);
        try {
            if (auth.currentUser) {
                setArchivedVehicles(updatedVehicles)
                deleteArchivedVehicleFromDb(id)
                handleDeleteAssociatedItems(id);
            }
        } catch (error) {
            console.error("Error deleting vehicle from db", error)
        }
    }

    const handleDeleteAssociatedItems = async (vehicleId: string) => {
        const currentVehicle = archivedVehicles.find((vehicle) => vehicle.id === vehicleId);
        const itemsToDelete = archivedItems.filter((item) => item.vehicle == currentVehicle?.name);
        const newArr = items.filter(item => item.vehicle !== currentVehicle?.name);
        setItems(newArr);
        setArchivedItems(itemsToDelete);
        try {
            if (auth.currentUser) {
                itemsToDelete.forEach(item => {
                    deleteArchivedItemsFromDb(item.id)
                })
                setArchivePreviewVehicleId("");
                setArchivedItemsPreview([]);
                setArchivePreviewVisible(false);
            }
        } catch (error) {
            console.error("Error deleting items that were assigned to deleted vehicle", error)
        }
    };
    
    const handleArchiveItems = async (vehicleId: string) => {
        setLoading(true)
        const currentVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);
        const updatedVehicles = vehicles.filter((vehicles, _) => vehicles.id !== vehicleId);
        const itemsToArchive = items.filter((item) => item.vehicle == currentVehicle?.name);
        const newArr = items.filter(item => item.vehicle !== currentVehicle?.name);
        setItems(newArr);
        setArchivedItems(itemsToArchive);
        try {
            if (auth.currentUser) {
                const userDocRef = doc(db, "users", auth?.currentUser?.uid);
                const archivedItemsCollectionRef = collection(userDocRef, 'archivedItems');
                const archivedVehiclesCollectionRef = collection(userDocRef, 'archivedVehicles')
                // Delete items from items collection
                itemsToArchive.forEach(item => {
                    deleteItemFromDb(item.id)
                })

                deleteVehicleFromDb(vehicleId);
                setDoc(doc(archivedVehiclesCollectionRef, vehicleId), currentVehicle);
                // Save items to archivedItems collection
                itemsToArchive.forEach(item => {
                    setDoc(doc(archivedItemsCollectionRef, item.id), item);
                })

                const vehiclesSnapshot = await getDocs(archivedVehiclesCollectionRef);
                const vehiclesData = await updateVehiclesFromDb(vehiclesSnapshot)
                setArchivedVehicles(vehiclesData);
                setVehicles(updatedVehicles)
                setLoading(false)
            }
        } catch (error) {
            console.error("Error archiving", error)
        }
    };

    const viewArchivePreview = async (vehicleId: string) => {
        setArchivePreviewVisible(true)
        if (auth.currentUser) {
            const userDocRef = doc(db, "users", auth?.currentUser?.uid);
            const currentVehicle = archivedVehicles.find((vehicle) => vehicle.id === vehicleId);
            const archivedItemsCollectionRef = collection(userDocRef, 'archivedItems');
            const q = query(archivedItemsCollectionRef, where("vehicle", "==", currentVehicle?.name));
            const querySnapshot = await getDocs(q);
            let archivePreview: Item[] = [];
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
                archivePreview.push(item)
            });
            setArchivedItemsPreview(archivePreview);
            setArchivePreviewVehicleId(vehicleId);
        }
    }

    const recoverArchivedItem = async (vehicleId: string) => {
        if (auth.currentUser) {
            const userDocRef = doc(db, "users", auth?.currentUser?.uid);
            const currentVehicle = archivedVehicles.find((vehicle) => vehicle.id === vehicleId);
            const itemsCollectionRef = collection(userDocRef, 'items');
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
            const updatedItems = [
                ...items,
                ...itemsToRecover
            ];

            itemsToRecover.forEach(item => {
                deleteArchivedItemsFromDb(item.id)
            })

            deleteArchivedVehicleFromDb(vehicleId)

            // Save items to archivedItems collection
            updatedItems.forEach(item => {
                setDoc(doc(itemsCollectionRef, item.id), item, {merge: true});
            })

            const vehiclesCollectionRef = collection(userDocRef, "vehicles");
            const vehicleDocRef = doc(vehiclesCollectionRef, vehicleId)             
            await setDoc(vehicleDocRef, currentVehicle);
            setItems(updatedItems);

            const updatedArchivedVehicles = archivedVehicles.filter((vehicle, _) => vehicle.id !== vehicleId);
            const updatedVehicles = [
                ...vehicles,
                ...archivedVehicles.filter((vehicle, _) => vehicle.id === vehicleId)
            ];

            
            setArchivedVehicles(updatedArchivedVehicles);
            setVehicles(updatedVehicles);
            setArchivePreviewVehicleId("");
            setArchivedItemsPreview([]);
            setArchivePreviewVisible(false)
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
            <h3>Your vehicles</h3>
            {vehicles.length > 0 ? (
                <div>
                    <div className="vehicles-list-wrapper pb-1">
                        <ul role="list" className="vehicles-list-wrapper__list">
                        {vehicles.map((vehicle) => (
                            <div key={vehicle.id}>
                                <li key={vehicle.id}>
                                    <div className="vehicles-list-wrapper__item">
                                        {vehicle.name}
                                        <div className="gap-05">
                                            <button onClick={() => handleArchiveItems(vehicle.id)} className="btn btn-secondary btn-sm">
                                                {loading ? (
                                                    <div className="spinner"></div>
                                                ) : (
                                                    <i className="bi bi-archive"></i>
                                                )}
                                                <span> Archive</span>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </div>
                        ))}
                        </ul>
                    </div>
                </div>
            ) : (<p className="fs-small">No saved vehicles</p>)}

            {archivedVehicles.length > 0 && (
                <div className="vehicles-list-wrapper py-1">
                <h3>Archived vehicles</h3>
                <ul role="list" className="vehicles-list-wrapper__list">
                {archivedVehicles.map((vehicle) => (
                    <div key={vehicle.id}>
                        <li key={vehicle.id} className="vehicles-list-wrapper__item">
                            {vehicle.name}
                            <button onClick={() => viewArchivePreview(vehicle.id)} className="btn btn-sm btn-secondary">Manage</button>
                        </li>
                    </div>
                ))}
                </ul>
            </div>
            )}
            <div>
                {archivePreviewVisible && (
                    <>
                        {archiveItemsPreview.length > 0 && (
                            <>
                            {archiveItemsPreview.map((item) => (
                                <ul key={item.id}>
                                    <li>{item.date}</li>
                                    <li>{item.description}</li>
                                    <li>{item.mileage}</li>
                                    <li>{item.vehicle}</li>
                                    <li>{item.shop}</li>
                                    <li>{item.cost}</li>
                                    <li>{item.memo}</li>
                                </ul>
                            ))}
                            </>
                        )}
                        <div className="d-flex gap-1">
                            <button onClick={() => handleDeleteVehicle(archivePreviewVehicleId)} className="btn btn-sm btn-danger">Delete</button>
                            <button onClick={() => recoverArchivedItem(archivePreviewVehicleId)} className="btn btn-sm btn-secondary">Recover</button>
                        </div>
                    </>
                )}
                
            </div>
        </>
    )
}

export default ManageVehicles;