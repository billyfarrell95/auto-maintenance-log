import ItemsListInput from "./ItemListInput";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { formatMileage } from "../utils/formatters";
import { Item } from "../types";
import CurrencyInput from "react-currency-input-field";

interface ItemsListEditProps {
    setEditingItems: Dispatch<SetStateAction<Item[]>>;
    editingItems: Item[];
    item: Item;
    setEditingItemId: any;
    setItemIsBeingEdited: Dispatch<SetStateAction<boolean>>;
}


function ItemsListEdit({ editingItems, setEditingItems, item, setEditingItemId, setItemIsBeingEdited }: ItemsListEditProps) {
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

    const handleFocus = (e: ChangeEvent<HTMLInputElement>, id: string) => {
        e.target.select()
        e.stopPropagation()
        setEditingItemId(id);
        setItemIsBeingEdited(true)
    }

    return (
        <form>
            <div className="data-item__input-wrapper">
                <input
                    type="date"
                    value={editingItems.find(editedItem => editedItem.id === item.id)?.date || item.date}
                    name={`date-${item.id}`}
                    onChange={(e) => handleChange(e, item.id)}
                    onFocus={(e) => handleFocus(e, item.id)}
                    onClick={(e) => console.log(e)} />
                <ItemsListInput
                    itemId={item.id}
                    handleChange={handleChange}
                    setEditingItemId={setEditingItemId}
                    setItemIsBeingEdited={setItemIsBeingEdited}
                    value={editingItems.find(editedItem => editedItem.id === item.id)?.description || item.description}
                    type="text"
                    name="description" />
                <ItemsListInput
                    itemId={item.id}
                    handleChange={handleChange}
                    setEditingItemId={setEditingItemId}
                    setItemIsBeingEdited={setItemIsBeingEdited}
                    value={editingItems.find(editedItem => editedItem.id === item.id)?.mileage || item.mileage}
                    type="text"
                    name="mileage" />
                <ItemsListInput
                    itemId={item.id}
                    handleChange={handleChange}
                    setEditingItemId={setEditingItemId}
                    setItemIsBeingEdited={setItemIsBeingEdited}
                    value={editingItems.find(editedItem => editedItem.id === item.id)?.vehicle || item.vehicle}
                    type="text"
                    name="vehicle" />
                <ItemsListInput
                    itemId={item.id}
                    handleChange={handleChange}
                    setEditingItemId={setEditingItemId}
                    setItemIsBeingEdited={setItemIsBeingEdited}
                    value={editingItems.find(editedItem => editedItem.id === item.id)?.shop || item.shop}
                    type="text"
                    name="shop" />
                <CurrencyInput
                    id={`cost-${item.id}`}
                    name={`cost-${item.id}`}
                    placeholder="Enter cost"
                    value={editingItems.find(editedItem => editedItem.id === item.id)?.cost || item.cost}
                    prefix="$"
                    decimalsLimit={2}
                    decimalScale={2}
                    onFocus={(e) => handleFocus(e, item.id)}
                    onClick={(e) => e.stopPropagation()}
                    onValueChange={(value) => handleCostChange(value, item.id)}
                />
                <ItemsListInput
                    itemId={item.id}
                    handleChange={handleChange}
                    setEditingItemId={setEditingItemId}
                    setItemIsBeingEdited={setItemIsBeingEdited}
                    value={editingItems.find(editedItem => editedItem.id === item.id)?.memo || item.memo}
                    type="text"
                    name="memo" />
            </div>
        </form>
    )
}

export default ItemsListEdit