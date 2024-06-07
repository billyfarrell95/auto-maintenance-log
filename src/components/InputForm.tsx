import { useState, FormEvent } from "react";
import { Item, Shop, Vehicle } from "../types";
import { datePickerCurrentDate, formatMileage } from "../utils/formatters";
import CurrencyInput from "react-currency-input-field";

interface InputFormProps {
    items: Item[];
    vehicles: Vehicle[];
    shops: Shop[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
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

function InputForm({ items, vehicles, shops, setItems }: InputFormProps) {
    const [currentItem, setCurrentItem] = useState<Item>({ ...initialValues, vehicle: vehicles[0].name });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedItem = {
            ...currentItem,
            cost: currentItem.cost.trim(),
            description: currentItem.description.trim(),
            shop: currentItem.shop.trim(),
            mileage: currentItem.mileage.trim(),
            memo: currentItem.memo.trim(),
        };
        if (trimmedItem.cost || trimmedItem.description || trimmedItem.shop || trimmedItem.mileage || trimmedItem.memo) {
            setItems([...items, trimmedItem]);
        }
        setCurrentItem({ ...initialValues, vehicle: vehicles[0].name });
        console.log(items)
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentItem({
            ...currentItem,  
            [name]: value,
            id: crypto.randomUUID()
        });
    };

    const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            <select name="vehicle" id="vehicles" value={currentItem.vehicle} onChange={handleChange}>
                {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.name}>{vehicle.name}</option>
                ))}
            </select>
            <input type="date" name="date" value={currentItem.date} onChange={handleChange} required />            
            <CurrencyInput
                placeholder="Enter cost"
                value={currentItem.cost}
                prefix="$"
                decimalsLimit={2}
                onValueChange={handleCostChange}
            />         
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
            <input list="shop-options" name="shop" value={currentItem.shop} onChange={handleChange} placeholder="Shop" />
            <datalist id="shop-options">
                {shops.map((shop) => (
                    <option key={shop.id} value={shop.name}>{shop.name}</option>
                ))}
            </datalist>
            <input type="text" name="mileage" placeholder="Mileage" value={currentItem.mileage} onChange={handleMileageChange} />
            <input type="text" name="memo" placeholder="Memo" value={currentItem.memo} onChange={handleChange} />
            <button type="submit">Add</button>
        </form>
    );
}

export default InputForm;