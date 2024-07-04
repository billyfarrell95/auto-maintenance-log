import { useState, FormEvent } from "react";
import { Vehicle } from "../../types";
import "./ManageVehicles.css";
import auth from "../../firebase/firebase";
import { doc, collection, addDoc, query, where, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase"

interface ManageVehiclesProps {
    vehicles: Vehicle[];
    setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
}

const initialValues: Vehicle = {
    id: "",
    name: ""
};

function ManageVehicles({ vehicles, setVehicles }: ManageVehiclesProps) {
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
        // @todo: improve validation against duplicate names
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
            // @todo: input validation when vehicle name has been used
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
                const q = query(vehiclesCollectionRef, where("id", "==", id))

                const querySnapshot = await getDocs(q);
                // @todo: define type for "doc"
                querySnapshot.forEach((doc: any) => {
                    deleteDoc(doc.ref);
                });
            }
        } catch (error) {
            console.error("Error deleting vehicle from db", error)
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
            {vehicles.length > 0 ? (
                <div>
                    <div className="vehicles-list-wrapper pb-1">
                        <ul role="list" className="vehicles-list-wrapper__list">
                        {vehicles.map((vehicle) => (
                            <li key={vehicle.id} className="vehicles-list-wrapper__item">
                                {vehicle.name}
                                <div>
                                    <button onClick={() => handleDeleteVehicle(vehicle.id)} className="btn btn-sm btn-outline-danger"><i className="bi bi-trash3"></i></button>
                                </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                    <p className="fs-small">Note: deleting vehicles will not remove them from your maintenance log, only from forms, filters, and this list.</p>
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