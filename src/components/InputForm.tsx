import { useState, FormEvent, ChangeEvent, SetStateAction, Dispatch } from "react";
import { Item, Shop, Vehicle } from "../types";
import { datePickerCurrentDate, formatMileage } from "../utils/formatters";
import CurrencyInput from "react-currency-input-field";
import "./InputForm.css";
import { maintenanceDescriptions } from "../data/data";

interface InputFormProps {
    items: Item[];
    vehicles: Vehicle[];
    shops: Shop[];
    setItems: Dispatch<SetStateAction<Item[]>>;
    selectedItems: string[];
}

const initialValues: Item = {
    id: "",
    date: datePickerCurrentDate(),
    vehicle: "",
    cost: "",
    description: "",
    shop: "",
    mileage: "",
    memo: "",
};

function InputForm({ items, vehicles, shops, setItems, selectedItems }: InputFormProps) {
    const [currentItem, setCurrentItem] = useState<Item>({ ...initialValues});

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedItem = {
            ...currentItem,
            cost: currentItem.cost.trim(),
            vehicle: currentItem.vehicle.trim(),
            description: currentItem.description.trim(),
            shop: currentItem.shop.trim(),
            mileage: currentItem.mileage.trim(),
            memo: currentItem.memo.trim(),
        };
        if (trimmedItem.cost || trimmedItem.description || trimmedItem.shop || trimmedItem.mileage || trimmedItem.memo || trimmedItem.vehicle) {
            setItems([...items, trimmedItem]);
        }
        setCurrentItem({ ...initialValues });
        console.log(items)
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentItem({
            ...currentItem,  
            [name]: value,
            id: crypto.randomUUID()
        });
    };

    const handleMileageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const formattedValue = formatMileage(value);
        setCurrentItem({
            ...currentItem,  
            [name]: formattedValue,
            id: crypto.randomUUID()
        });
    };

    const handleCostChange = (value: string | undefined) => {
        setCurrentItem({
            ...currentItem,
            cost: value || '',
            id: crypto.randomUUID()
        });
    };

    return (
        <form onSubmit={handleSubmit} className="input-form" autoComplete="off">
            <input list="description-options" name="description" value={currentItem.description} onChange={handleChange} placeholder="Maintenance description" />
            <input type="date" name="date" value={currentItem.date} onChange={handleChange} />   
            <input type="text" name="mileage" placeholder="Mileage" value={currentItem.mileage} onChange={handleMileageChange} />
            <datalist id="description-options">
                {maintenanceDescriptions.map((item, index) => (
                    <option value={item} key={index}>{item}</option>
                ))}
            </datalist>
            <input list="vehicles-options" name="vehicle" value={currentItem.vehicle} onChange={handleChange} placeholder="Vehicle" />
            <datalist id="vehicles-options">
                {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.name}>{vehicle.name}</option>
                ))}
            </datalist>
            <input list="shop-options" name="shop" value={currentItem.shop} onChange={handleChange} placeholder="Shop" />
            <datalist id="shop-options">
                {shops.map((shop) => (
                    <option key={shop.id} value={shop.name}>{shop.name}</option>
                ))}
            </datalist>
            <CurrencyInput
                placeholder="Enter cost"
                value={currentItem.cost}
                prefix="$"
                decimalsLimit={2}
                onValueChange={handleCostChange}
            />         
            <input type="text" name="memo" placeholder="Memo" value={currentItem.memo} onChange={handleChange} />
            <button type="submit" disabled={selectedItems.length > 0}>Add</button>
        </form>
    );
}

export default InputForm;