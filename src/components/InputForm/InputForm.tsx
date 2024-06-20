import { FormEvent, ChangeEvent, SetStateAction, Dispatch } from "react";
import { Item, Shop, Vehicle } from "../../types";
import { formatMileage } from "../../utils/formatters";
import CurrencyInput from "react-currency-input-field";
import "./InputForm.css";
import { maintenanceDescriptions } from "../../data/data";
import { initialValues } from "../../App";
import { tabs } from "../../App";


interface InputFormProps {
    items: Item[];
    currentItem: Item,
    vehicles: Vehicle[];
    shops: Shop[];
    setItems: Dispatch<SetStateAction<Item[]>>;
    setCurrentItem: Dispatch<SetStateAction<Item>>;
    selectedItems: string[];
    handleActiveTab: (tab: string) => void; 
}

function InputForm({ items, vehicles, shops, setItems, selectedItems, currentItem, setCurrentItem, handleActiveTab }: InputFormProps) {
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
                <input type="date" name="date" value={currentItem.date} onChange={handleChange} />   
            </div>
            <div className="input-form__input-wrapper">
                <input list="description-options" type="text" name="description" value={currentItem.description} onChange={handleChange} placeholder="Maintenance description" />
            </div>
            <div className="input-form__input-wrapper">
                <input type="text" name="mileage" placeholder="Mileage" value={currentItem.mileage} onChange={handleMileageChange} />
                <datalist id="description-options">
                    {maintenanceDescriptions.map((item, index) => (
                        <option value={item} key={index}>{item}</option>
                    ))}
                </datalist>
            </div>
            <div className="input-form__input-wrapper">
                <select id="vehicles-select" disabled={!vehicles.length}>
                    <option value="">-- select --</option>
                    {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.name}>{vehicle.name}</option>
                    ))}
                </select>
                {!vehicles.length && (
                    <button onClick={() => {handleActiveTab(tabs.vehicles)}}>Add a vehicle</button>
                )}
            </div>
            <div className="input-form__input-wrapper">
                <input list="shop-options" name="shop" type="text" value={currentItem.shop} onChange={handleChange} placeholder="Shop" />
                <datalist id="shop-options">
                    {shops.map((shop) => (
                        <option key={shop.id} value={shop.name}>{shop.name}</option>
                    ))}
                </datalist>
            </div>
            <div className="input-form__input-wrapper">
                <CurrencyInput
                    placeholder="Enter cost"
                    value={currentItem.cost}
                    prefix="$"
                    decimalsLimit={2}
                    onValueChange={handleCostChange}
                />  
            </div>       
            <div className="input-form__input-wrapper">
                <input type="text" name="memo" placeholder="Memo" value={currentItem.memo} onChange={handleChange} />
            </div>       
            <div className="input-form__input-wrapper">
                <button type="submit" disabled={selectedItems.length > 0}>Add</button>
            </div>       
        </form>
    );
}

export default InputForm;