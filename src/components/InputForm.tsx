import { useState, FormEvent } from "react";
import { Item } from "../types";

interface InputFormProps {
    items: Item[];
    vehicles: string[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

const initialValues: Item = {
    id: "",
    date: "",
    vehicle: "",
    description: "",
    shop: "",
    mileage: "",
    memo: "",
};


function InputForm({ items, vehicles, setItems }: InputFormProps) {
    const [currentItem, setCurrentItem] = useState<Item>({ ...initialValues, vehicle: vehicles[0] });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedItem = {
            ...currentItem,
            description: currentItem.description.trim(),
            shop: currentItem.shop.trim(),
            mileage: currentItem.mileage.trim(),
            memo: currentItem.memo.trim(),
        };
        setItems([...items, trimmedItem]);
        setCurrentItem({ ...initialValues, vehicle: vehicles[0] });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentItem({
            ...currentItem,  
            [name]: value,
            id: crypto.randomUUID()
        });
    };

    return (
        <form onSubmit={handleSubmit} className="input-form">
            <select name="vehicle" id="vehicles" value={currentItem.vehicle} onChange={handleChange}>
                {vehicles.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                ))}
            </select>
            <input type="date" name="date" value={currentItem.date} onChange={handleChange} required />            
            <input list="description-options" name="description" value={currentItem.description} onChange={handleChange} placeholder="Maintenance description" required />
            <datalist id="description-options">
                <option value="Oil change"></option>
                <option value="Wheel alignment/balance"></option>
                <option value="Tire rotation"></option>
                <option value="New battery"></option>
                <option value="Coolant flush"></option>
                <option value="Spark plug replacement"></option>
                <option value="Air filter replacement"></option>
                <option value="New brakes"></option>
                <option value="Engine tune-up"></option>
                <option value="New brakes/rotors"></option>
            </datalist>
            <input type="text" name="shop" placeholder="Shop" value={currentItem.shop} onChange={handleChange} />
            <input type="text" name="mileage" placeholder="Mileage" value={currentItem.mileage} onChange={handleChange} />
            <input type="text" name="memo" placeholder="Memo" value={currentItem.memo} onChange={handleChange} />
            <button type="submit">Add</button>
        </form>
    );
}

export default InputForm;