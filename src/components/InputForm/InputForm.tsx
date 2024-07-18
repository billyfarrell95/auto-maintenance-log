import { FormEvent, ChangeEvent, SetStateAction, Dispatch } from "react";
import { Item, Shop, Vehicle } from "../../types";
import { formatMileage } from "../../utils/formatters";
import CurrencyInput from "react-currency-input-field";
import "./InputForm.css";
import { maintenanceDescriptions } from "../../data/maintenanceDescriptions";
import { initialValues } from "../../App";
import { addNewItemToDb } from "../../api/api";

interface InputFormProps {
    items: Item[];
    currentItem: Item,
    vehicles: Vehicle[];
    shops: Shop[];
    setItems: Dispatch<SetStateAction<Item[]>>;
    setCurrentItem: Dispatch<SetStateAction<Item>>;
    selectedItems: string[];
    handleActiveTab: (tab: string) => void; 
    tabs: { log: string; vehicles: string; shops: string; },
}

function InputForm({ items, vehicles, shops, setItems, selectedItems, currentItem, setCurrentItem, handleActiveTab, tabs }: InputFormProps) {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedItem = {
            ...currentItem,
            cost: currentItem.cost.trim(),
            vehicle: currentItem.vehicle.trim(),
            description: currentItem.description.trim(),
            shop: currentItem.shop.trim() || "none",
            mileage: currentItem.mileage.trim(),
            memo: currentItem.memo.trim(),
        };
        if (trimmedItem.cost || trimmedItem.description || trimmedItem.shop || trimmedItem.mileage || trimmedItem.memo || trimmedItem.vehicle) {
            try {
                addNewItemToDb(trimmedItem)
                setItems([...items, trimmedItem]);
                setCurrentItem({ ...initialValues });
            } catch (error) {
                console.error("Error adding new item to db", error)
            }
        }
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
            <div className="input-form__input-wrapper">
                <label htmlFor="date">Date</label>
                <input type="date" name="date" id="date" value={currentItem.date} onChange={handleChange} />   
            </div>
            <div className="input-form__input-wrapper">
                <label htmlFor="description">Description</label>
                <input list="description-options" type="text" id="description" name="description" value={currentItem.description} onChange={handleChange} placeholder="Description" required />
                <datalist id="description-options">
                    {maintenanceDescriptions.map((item, index) => (
                        <option value={item} key={index}>{item}</option>
                    ))}
                </datalist>
            </div>
            <div className="input-form__input-wrapper">
                <label htmlFor="mileage">Mileage</label>
                <input type="text" inputMode="numeric" name="mileage" id="mileage" placeholder="Mileage" value={currentItem.mileage} onChange={handleMileageChange} required />
            </div>
            <div className="input-form__input-wrapper">
                <div className="d-flex justify-space-between">
                    <label htmlFor="vehicles-select">Vehicle</label>
                    {!vehicles.length && (
                        <button className="btn-small btn-link fs-small text-left" onClick={() => handleActiveTab(tabs.vehicles)}>Add a vehicle</button>
                    )}
                </div>
                <select id="vehicles-select" disabled={!vehicles.length} name="vehicle" value={currentItem.vehicle} onChange={handleChange} required>
                    <option value="">-- select vehicle --</option>
                    {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.name}>{vehicle.name}</option>
                    ))}
                </select>
            </div>
            <div className="input-form__input-wrapper">
                <label htmlFor="shops-select">Shop</label>
                <select id="shops-select" name="shop" value={currentItem.shop} onChange={handleChange}>
                    <option value="n/a">-- select shop --</option>
                    {shops.map((shop) => (
                        <option key={shop.id} value={shop.name}>{shop.name}</option>
                    ))}
                </select>
            </div>
            <div className="input-form__input-wrapper">
                <label htmlFor="cost">Cost</label>
                <CurrencyInput
                    id="cost"
                    placeholder="Enter cost"
                    value={currentItem.cost}
                    inputMode="numeric"
                    prefix="$"
                    decimalsLimit={2}
                    onValueChange={handleCostChange}
                    required
                />  
            </div>       
            <div className="input-form__input-wrapper">
                <label htmlFor="memo">Memo</label>
                <input type="text" name="memo" placeholder="Memo" id="memo" value={currentItem.memo} onChange={handleChange} />
            </div>       
            <div className="input-form__input-wrapper align-self-flex-end">
                <button type="submit" className="btn btn-primary" disabled={selectedItems.length > 0}>Add</button>
            </div>       
        </form>
    );
}

export default InputForm;