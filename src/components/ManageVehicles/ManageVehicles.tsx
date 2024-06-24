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
            <form onSubmit={(e) => {handleSubmit(e)}} className="shops-form">
                <div>
                    <label htmlFor="addVehicle">Add a vehicle</label>
                    <input id="addVehicle" type="text" onChange={handleChange} value={newVehicle.name} placeholder="Vehicle name" required />
                </div>
                <div className="align-self-flex-end"><button type="submit" className="btn btn-primary">Add</button></div>
            </form>
            {vehicles.length > 0 ? (
                <div className="shops-list-wrapper">
                    <ul className="shops-list-wrapper__list" role="list">
                    {vehicles.map((vehicle) => (
                        <li key={vehicle.id} className="shops-list-wrapper__item">
                            {vehicle.name}
                            <div>
                                <button onClick={() => handleDeleteVehicle(vehicle.id)} className="btn btn-sm btn-outline-danger"><i className="bi bi-trash3"></i></button>
                            </div>
                        </li>
                    ))}
                </ul>
                </div>
            ) : (
                <div className="shops-list-wrapper">
                    <p><i>No saved vehicles</i></p>
                </div>
            )}
        </>
    )
}

export default ManageVehicles;