import { useState, FormEvent } from "react";
import { Vehicle, Item } from "../../types";
import "./ManageVehicles.css";
import { Dispatch, SetStateAction } from "react";
import auth from "../../firebase/firebase";
import { doc, collection, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { deleteItemFromDb, deleteArchivedItemsFromDb, deleteVehicleFromDb, deleteArchivedVehicleFromDb } from "../../api/api";
import { updateVehiclesFromDb } from "../../api/api";
import ArchivedDataModal from "../ArchivedDataModal/ArchivedDataModal";

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
};

function ManageVehicles({ vehicles, setVehicles, items, setItems, archivedItems, setArchivedItems, archivedVehicles, setArchivedVehicles }: ManageVehiclesProps) {
    const [newVehicle, setNewVehicle] = useState<Vehicle>({ ...initialValues });
    const [archivePreviewVehicleId, setArchivePreviewVehicleId] = useState("");
    const [archivedItemsPreview, setArchivedItemsPreview] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [itemBeingArchived, setItemBeingArchived] = useState("");

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
        }
        if (newVehicleTrimmed.name && !vehicles.some(e => e.name.toLowerCase() === newVehicleTrimmed.name.toLowerCase()) && !archivedVehicles.some(e => e.name.toLowerCase() === newVehicleTrimmed.name.toLowerCase())) {
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
    
    const handleArchiveItems = async (vehicleId: string) => {
        setLoading(true)
        setItemBeingArchived(vehicleId)
        const currentVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);
        const updatedVehicles = vehicles.filter((vehicle, _) => vehicle.id !== vehicleId);
        const updatedArchivedVehicles = [
            ...archivedVehicles,
            ...vehicles.filter((vehicle, _) => vehicle.id == vehicleId)
        ]
        const itemsToArchive = items.filter((item) => item.vehicle == currentVehicle?.name);
        const updatedArchivedItems = [
            ...archivedItems,
            ...itemsToArchive
        ]
        const newArr = items.filter(item => item.vehicle !== currentVehicle?.name);
        setItems(newArr);
        setArchivedItems(updatedArchivedItems);
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
            } else {
                setArchivedVehicles(updatedArchivedVehicles);
                setVehicles(updatedVehicles)
                setLoading(false)
            }
        } catch (error) {
            console.error("Error archiving", error)
        }
    };

    const viewArchivePreview = async (vehicleId: string) => {
        const currentVehicle = archivedVehicles.find((vehicle) => vehicle.id === vehicleId);
        const archivePreview = archivedItems.filter((item) => item.vehicle === currentVehicle?.name);
        setArchivedItemsPreview(archivePreview);
        setArchivePreviewVehicleId(vehicleId);
    }

    const recoverArchivedItem = async (vehicleId: string) => {
        const currentVehicle = archivedVehicles.find((vehicle) => vehicle.id === vehicleId);
        const itemsToRecover = archivedItems.filter((item) => item.vehicle === currentVehicle?.name);
        const updatedItems = [
            ...items,
            ...itemsToRecover
        ];
        const updatedArchivedVehicles = archivedVehicles.filter((vehicle, _) => vehicle.id !== vehicleId);
        const updatedVehicles = [
            ...vehicles,
            ...archivedVehicles.filter((vehicle, _) => vehicle.id === vehicleId)
        ];
        try {
            if (auth.currentUser) {
                const userDocRef = doc(db, "users", auth?.currentUser?.uid);
                const itemsCollectionRef = collection(userDocRef, 'items');
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
            }
            setItems(updatedItems);
            setArchivedVehicles(updatedArchivedVehicles);
            setVehicles(updatedVehicles);
            setArchivePreviewVehicleId("");
            setArchivedItemsPreview([]);
        } catch (error) {
            console.error("Error recovering archived item", error)
        }
    }

    const handleDeleteVehicle = async (id: string) => {
        const updatedVehicles = [
            ...archivedVehicles.filter((vehicle, _) => vehicle.id !== id)
        ];
        try {
            if (auth.currentUser) {
                await deleteArchivedVehicleFromDb(id);
                await handleDeleteAssociatedItems(id);
            }
            setArchivedVehicles(updatedVehicles);
        } catch (error) {
            console.error("Error deleting vehicle from db", error)
        }
    }

    const handleDeleteAssociatedItems = async (vehicleId: string) => {
        const currentVehicle = archivedVehicles.find((vehicle) => vehicle.id === vehicleId);
        const itemsToDelete = archivedItems.filter((item) => item.vehicle == currentVehicle?.name);
        const newArr = items.filter(item => item.vehicle !== currentVehicle?.name);
        try {
            if (auth.currentUser) {
                itemsToDelete.forEach(item => {
                    deleteArchivedItemsFromDb(item.id)
                })
            }
            setArchivePreviewVehicleId("");
            setArchivedItemsPreview([]);
            setItems(newArr);
            setArchivedItems(itemsToDelete);
        } catch (error) {
            console.error("Error deleting associated items", error)
        }
    };

    return (
        <>
            <h2>Manage your vehicles</h2>
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
                                <li>
                                    <div className="vehicles-list-wrapper__item">
                                        {vehicle.name}
                                        <div className="d-flex gap-05">
                                            <button onClick={() => handleArchiveItems(vehicle.id)} className="btn btn-secondary btn-sm">
                                                {loading && itemBeingArchived === vehicle.id ? (
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
                        <li className="vehicles-list-wrapper__item">
                            {vehicle.name}
                            <ArchivedDataModal
                                archivedItemsPreview={archivedItemsPreview}
                                viewArchivePreview={viewArchivePreview}
                                setArchivedItemsPreview={setArchivedItemsPreview}
                                vehicleId={vehicle.id}
                                handleDeleteVehicle={handleDeleteVehicle}
                                recoverArchivedItem={recoverArchivedItem}
                                archivePreviewVehicleId={archivePreviewVehicleId}
                                vehicleName={vehicle.name}
                             />
                        </li>
                    </div>
                ))}
                </ul>
            </div>
            )}
        </>
    )
}

export default ManageVehicles;