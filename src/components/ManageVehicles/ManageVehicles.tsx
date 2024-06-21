import { useState, FormEvent } from "react";
import { Vehicle } from "../../types";
import "./ManageVehicles.css";

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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newVehicleTrimmed = {
            ...newVehicle,
            name: newVehicle.name.trim(),
            id: crypto.randomUUID()
        }
        if (newVehicleTrimmed.name && !vehicles.some(e => e.name.toLowerCase() === newVehicleTrimmed.name.toLowerCase())) {
            setVehicles([...vehicles, newVehicleTrimmed]);
        } else {
            console.log("Vehicle name already used.")
        }
        setNewVehicle({...initialValues});
    }

    const handleDeleteVehicle = (id: string) => {
        const updatedVehicles = vehicles.filter((vehicle, _) => vehicle.id !== id);
        setVehicles(updatedVehicles)
    }

    return (
        <>
            <h2>Manage your vehicles</h2>
            <form onSubmit={(e) => {handleSubmit(e)}} className="vehicles-form">
                <label htmlFor="addVehicle">Add a vehicle</label>
                <input id="addVehicle" type="text" onChange={handleChange} value={newVehicle.name} placeholder="Vehicle name" required />
                <button type="submit">Add</button>
            </form>
            {vehicles.length > 0 ? (
                <ul className="vehicles-list" role="list">
                    {vehicles.map((vehicle) => (
                        <li key={vehicle.id}>
                            <p>{vehicle.name} </p>
                            <button onClick={() => handleDeleteVehicle(vehicle.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p><i>No saved vehicles</i></p>
            )}
        </>
    )
}

export default ManageVehicles;