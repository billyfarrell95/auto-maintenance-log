import { useState, FormEvent } from "react";
import { Vehicle, Item } from "../../types";
import "./ManageVehicles.css";
import { Dispatch, SetStateAction } from "react";
import auth from "../../firebase/firebase";
import { doc, collection, addDoc, query, where, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { deleteItemFromDb } from "../../api/api";

interface ManageVehiclesProps {
    vehicles: Vehicle[];
    setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
    items: Item[],
    setItems: Dispatch<SetStateAction<Item[]>>;
}

const initialValues: Vehicle = {
    id: "",
    name: ""
};

function ManageVehicles({ vehicles, setVehicles, items, setItems }: ManageVehiclesProps) {
    const [newVehicle, setNewVehicle] = useState<Vehicle>({ ...initialValues });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const vehicle = {
            ...newVehicle,
            name: value
        }
        setNewVehicle(vehicle)
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newVehicleTrimmed = {
            ...newVehicle,
            name: newVehicle.name.trim(),
            id: crypto.randomUUID()
        }
        if (newVehicleTrimmed.name && !vehicles.some(e => e.name.toLowerCase() === newVehicleTrimmed.name.toLowerCase())) {
            try {
                if (auth.currentUser) {
                    const userDocRef = doc(db, "users", auth?.currentUser?.uid);
                    const vehiclesCollectionRef = collection(userDocRef, 'vehicles');
                    await addDoc(vehiclesCollectionRef, newVehicleTrimmed)
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

    // @todo: vehicles aren't deleted from db
    const handleDeleteVehicle = async (id: string) => {
        const updatedVehicles = vehicles.filter((vehicle, _) => vehicle.id !== id);
        setVehicles(updatedVehicles)
        try {
            if (auth.currentUser) {
                const userDocRef = doc(db, "users", auth?.currentUser?.uid);
                const vehiclesCollectionRef = collection(userDocRef, 'vehicles');
                const q = query(vehiclesCollectionRef, where("id", "==", id))

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
            {vehicles.length > 0 ? (
                <div>
                    <div className="vehicles-list-wrapper pb-1">
                        <ul role="list" className="vehicles-list-wrapper__list">
                        {vehicles.map((vehicle) => (
                            // @todo: add option to edit vehicle name
                            <li key={vehicle.id} className="vehicles-list-wrapper__item">
                                {vehicle.name}
                                <div>
                                    {/* @todo: add confirmation before deleting */}
                                    <button onClick={() => handleDeleteVehicle(vehicle.id)} className="btn btn-sm btn-outline-danger"><i className="bi bi-trash3"></i></button>
                                </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                    <p className="fs-small">Note: deleting vehicles will also remove any associated log items.</p>
                </div>
            ) : (
                <div className="vehicles-list-wrapper">
                    <p><i>No saved vehicles</i></p>
                </div>
            )}
        </>
    )
}

export default ManageVehicles;