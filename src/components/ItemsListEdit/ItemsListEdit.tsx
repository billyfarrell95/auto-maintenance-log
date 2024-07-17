import ItemsListInput from "../ItemListInput";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { formatMileage } from "../../utils/formatters";
import { Item, Vehicle, Shop } from "../../types";
import CurrencyInput from "react-currency-input-field";

interface ItemsListEditProps {
    setEditingItems: Dispatch<SetStateAction<Item[]>>;
    editingItems: Item[];
    item: Item;
    setEditingItemId: Dispatch<SetStateAction<string>>;
    setItemIsBeingEdited: Dispatch<SetStateAction<boolean>>;
    vehicles: Vehicle[],
    shops: Shop[]
}

function ItemsListEdit({ editingItems, setEditingItems, item, setEditingItemId, setItemIsBeingEdited, shops, vehicles }: ItemsListEditProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>, id: string) => {
        const { name, value } = e.target;
        let updatedValue = value;

        if (name.startsWith('mileage')) {
            updatedValue = formatMileage(value);
        }

        const updatedItems = editingItems.map(item => 
            item.id === id ? { ...item, [name.split('-')[0]]: updatedValue } : item
        );

        setEditingItems(updatedItems);
    }

    const handleCostChange = (value: string | undefined, id: string) => {
        const updatedItems = editingItems.map(item => item.id === id ? { ...item, cost: value || '' } : item);
        setEditingItems(updatedItems);
    };

    const handleFocus = (e: ChangeEvent<HTMLInputElement> , id: string) => {
        e.target.select()
        e.stopPropagation()
        setEditingItemId(id);
        setItemIsBeingEdited(true)
    }

    const handleSelectFocus = (e: ChangeEvent<HTMLSelectElement>, id: string) => {
        e.stopPropagation()
        setEditingItemId(id);
        setItemIsBeingEdited(true)
    }

    return (
        <form>
            <div className="data-item__input-wrapper">
                <div className="data-item__display">
                    <label>Date</label>
                    <input
                        type="date"
                        value={editingItems.find(editedItem => editedItem.id === item.id)?.date || item.date}
                        name={`date-${item.id}`}
                        onChange={(e) => handleChange(e, item.id)}
                        onFocus={(e) => handleFocus(e, item.id)}
                        onClick={(e) => console.log(e)} />
                </div>
                <ItemsListInput
                    itemId={item.id}
                    handleChange={handleChange}
                    setEditingItemId={setEditingItemId}
                    setItemIsBeingEdited={setItemIsBeingEdited}
                    value={editingItems.length ? (editingItems.find(editedItem => editedItem.id === item.id)?.description || "") : (item.description)}
                    type="text"
                    inputMode="text"
                    name="description"
                    placeholder="Description" />
                <ItemsListInput
                    itemId={item.id}
                    handleChange={handleChange}
                    setEditingItemId={setEditingItemId}
                    setItemIsBeingEdited={setItemIsBeingEdited}
                    value={editingItems.length ? (editingItems.find(editedItem => editedItem.id === item.id)?.mileage || "") : (item.mileage)}
                    type="text"
                    inputMode="numeric"
                    name="mileage"
                    placeholder="Mileage" />
                <div className="data-item__display">
                    <select id="vehicles-select" name="vehicle" defaultValue={item.vehicle} onChange={(e) => handleChange(e, item.id)} onFocus={(e) => handleSelectFocus(e, item.id)} required>
                        {vehicles && vehicles.map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.name}>{vehicle.name}</option>
                        ))}
                    </select>
                </div>
                <div className="data-item__display">
                    <select id="shops-select" name="shop" defaultValue={item.shop} onChange={(e) => handleChange(e, item.id)} onFocus={(e) => handleSelectFocus(e, item.id)} required>
                        <option value="">-- select --</option>
                        {shops && shops.map((shop) => (
                            <option key={shop.id} value={shop.name}>{shop.name}</option>
                        ))}
                    </select>
                </div>
                <div className="data-item__display">
                    <label>Cost</label>
                    <CurrencyInput
                        id={`cost-${item.id}`}
                        name={`cost-${item.id}`}
                        placeholder="Enter cost"
                        inputMode="numeric"
                        value={editingItems.length ? (editingItems.find(editedItem => editedItem.id === item.id)?.cost || "") : (item.cost)}
                        prefix="$"
                        decimalsLimit={2}
                        decimalScale={2}
                        onFocus={(e) => handleFocus(e, item.id)}
                        onClick={(e) => e.stopPropagation()}
                        onValueChange={(value) => handleCostChange(value, item.id)}
                    />
                </div>
                <ItemsListInput
                    itemId={item.id}
                    handleChange={handleChange}
                    setEditingItemId={setEditingItemId}
                    setItemIsBeingEdited={setItemIsBeingEdited}
                    value={editingItems.length ? (editingItems.find(editedItem => editedItem.id === item.id)?.memo || "") : (item.memo)}
                    type="text"
                    inputMode="text"
                    name="memo"
                    placeholder="Memo" />
            </div>
        </form>
    )
}

export default ItemsListEdit