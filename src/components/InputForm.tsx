import { useState, FormEvent } from "react";
import { Item } from "../types";

interface InputFormProps {
    items: Item[];
    vehicles: string[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
    handleHideInputForm: () => void;
}

const initialValues: Item = {
    date: "",
    vehicle: "",
    description: "",
    shop: "",
    mileage: "",
    memo: "",
};


function InputForm({ items, vehicles, setItems, handleHideInputForm }: InputFormProps) {
    const [currentItem, setCurrentItem] = useState<Item>({ ...initialValues, vehicle: vehicles[0] });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setItems([...items, currentItem]);
        setCurrentItem({ ...initialValues, vehicle: vehicles[0] });
        handleHideInputForm();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentItem({
            ...currentItem,
            [name]: value,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="date" name="date" value={currentItem.date} onChange={handleChange} required />
            <select name="vehicle" id="vehicles" value={currentItem.vehicle} onChange={handleChange}>
                {vehicles.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                ))}
            </select>
            <input type="text" name="description" placeholder="Description" value={currentItem.description} onChange={handleChange} required />
            <input type="text" name="shop" placeholder="Shop" value={currentItem.shop} onChange={handleChange} required />
            <input type="text" name="mileage" placeholder="Mileage" value={currentItem.mileage} onChange={handleChange} required />
            <input type="text" name="memo" placeholder="Memo" value={currentItem.memo} onChange={handleChange} />
            <button type="submit">Add</button>
            <button onClick={handleHideInputForm}>Cancel</button>
        </form>
    );
}

export default InputForm;