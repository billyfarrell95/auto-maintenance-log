import { FormEvent, ChangeEvent, SetStateAction, Dispatch } from "react";
import { Item, Shop, Vehicle } from "../../types";
import { formatMileage } from "../../utils/formatters";
import CurrencyInput from "react-currency-input-field";
import "./InputForm.css";
import { maintenanceDescriptions } from "../../data/data";
import { initialValues } from "../../App";
import { doc, collection, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import auth from "../../firebase/firebase";

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

function InputForm({ items, vehicles, shops, setItems, selectedItems, currentItem, setCurrentItem }: InputFormProps) {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
            try {
                if (auth.currentUser) {
                    const userDocRef = doc(db, "users", auth?.currentUser?.uid);
                    const itemsCollectionRef = collection(userDocRef, 'items');
                    // Create doc with custom ID (for reference when editing or deleting)
                    await setDoc(doc(itemsCollectionRef, trimmedItem.id), trimmedItem);
                }
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
                <input type="date" name="date" value={currentItem.date} onChange={handleChange} />   
            </div>
            <div className="input-form__input-wrapper">
                <input list="description-options" type="text" name="description" value={currentItem.description} onChange={handleChange} placeholder="Description" required />
            </div>
            <div className="input-form__input-wrapper">
                <input type="text" inputMode="numeric" name="mileage" placeholder="Mileage" value={currentItem.mileage} onChange={handleMileageChange} required />
                <datalist id="description-options">
                    {maintenanceDescriptions.map((item, index) => (
                        <option value={item} key={index}>{item}</option>
                    ))}
                </datalist>
            </div>
            <div className="input-form__input-wrapper">
                <input list="vehicle-options" name="vehicle" type="text" value={currentItem.vehicle} onChange={handleChange} placeholder="Vehicle" required />
                <datalist id="vehicle-options">
                    {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.name}>{vehicle.name}</option>
                    ))}
                </datalist>
            </div>
            <div className="input-form__input-wrapper">
                <input list="shop-options" name="shop" type="text" value={currentItem.shop} onChange={handleChange} placeholder="Shop" required />
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
                    inputMode="numeric"
                    prefix="$"
                    decimalsLimit={2}
                    onValueChange={handleCostChange}
                    required
                />  
            </div>       
            <div className="input-form__input-wrapper">
                <input type="text" name="memo" placeholder="Memo" value={currentItem.memo} onChange={handleChange} />
            </div>       
            <div className="input-form__input-wrapper">
                <button type="submit" className="btn btn-primary" disabled={selectedItems.length > 0}>Add</button>
            </div>       
        </form>
    );
}

export default InputForm;