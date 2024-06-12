import { useEffect, useState } from "react";
import { Item, Vehicle } from "../types";
import "./ItemList.css"
import { formatCost, formatMileage } from "../utils/formatters";
import CurrencyInput from "react-currency-input-field";
import Checkbox from "./Checkbox";
  
interface ItemsListProps {
    items: Item[];
    selectedItems: string[];
    vehicles: Vehicle[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
    itemIsBeingEdited: boolean;
    setItemIsBeingEdited: React.Dispatch<React.SetStateAction<boolean>>
}

function ItemsList({ items, setItems, selectedItems, setSelectedItems, itemIsBeingEdited, setItemIsBeingEdited }: ItemsListProps) {
    enum CHECKBOX_STATES {
        Checked = 'checked',
        Empty = 'empty',
        Indeterminate = 'indeterminate',
    }

    const [editingItems, setEditingItems] = useState<Item[]>([]);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [checked, setChecked] = useState(CHECKBOX_STATES.Empty);

    const sortByDate = (a: Item, b: Item) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    }

    const handleEdit = (item: Item, e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
        if (selectedItems.includes(item.id) && !itemIsBeingEdited) {
            setItemIsBeingEdited(true)
            setEditingItemId(item.id === editingItemId ? null: item.id)
        }
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>, id: string) => {
        const { name, value } = e.target;
        const updatedItems = editingItems.map(item => item.id === id ? { ...item, [name.split('-')[0]]: value } : item);
        setEditingItems(updatedItems);
    };
    
    const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const { name, value } = e.target;
        const formattedValue = formatMileage(value);
        const updatedItems = editingItems.map(item => item.id === id ? { ...item, [name.split('-')[0]]: formattedValue } : item);
        setEditingItems(updatedItems);
    };

    const handleCostChange = (value: string | undefined, id: string) => {
        const updatedItems = editingItems.map(item => item.id === id ? { ...item, cost: value || '' } : item);
        setEditingItems(updatedItems);
    };
    
    const handleSelectAll = () => {
        const allItemsSelected = selectedItems.length === items.length;
        const newSelectedItems = allItemsSelected ? [] : items.map(item => item.id);
        setSelectedItems(newSelectedItems);
    };

    const handleItemSelect = (id: string, e: React.FormEvent) => {
        e.stopPropagation();
        setEditingItems([])
        setSelectedItems(prevSelected => {
            if (prevSelected.includes(id)) {
                // Unselected
                return prevSelected.filter(itemId => itemId !== id);
            } else {
                // Selected
                return [...prevSelected, id];
            }
        });
    };

    const handleFocus = () => {
        if (!editingItems.length) {
            setEditingItems(items.map(item => ({ ...item })));
        }
    };

    const handleSaveItem = (e: React.FormEvent, id: string) => {
        e.stopPropagation();
        e.preventDefault();
        setItemIsBeingEdited(false)
        const updatedItems = items.map(item => item.id === id ? editingItems.find(editedItem => editedItem.id === id) || item : item);
        setItems(updatedItems);
        setEditingItemId(null);
    }

    const handleCancelEdit = (e: React.FormEvent) => {
        e.stopPropagation();
        setEditingItems([])
        setEditingItemId(null);
        setItemIsBeingEdited(false)
    }

    const itemSelectedClasses = "data-item__display-selected data-item__display";
    const itemDefaultClasses = "data-item__display-default data-item__display";    

    const handleCheckboxChange = () => {
        let updatedChecked: CHECKBOX_STATES = CHECKBOX_STATES.Empty;
    
        if (checked === CHECKBOX_STATES.Checked) {
            updatedChecked = CHECKBOX_STATES.Empty;
            setSelectedItems([]);
        } else if (checked === CHECKBOX_STATES.Empty) {
            updatedChecked = CHECKBOX_STATES.Checked;
            handleSelectAll()
        } else if (checked === CHECKBOX_STATES.Indeterminate) {
            setSelectedItems([])
            updatedChecked = CHECKBOX_STATES.Empty;
        }
    
        setChecked(updatedChecked);
    };

    useEffect(() => {
        if (selectedItems.length === 0) {
            setChecked(CHECKBOX_STATES.Empty)
        } else if (selectedItems.length < items.length && selectedItems.length !== 0) {
            setChecked(CHECKBOX_STATES.Indeterminate)
        } else {
            setChecked(CHECKBOX_STATES.Checked)
        }
    }, [selectedItems])

    return (    
        <>
            {items.length && (
                <div className="data-header">
                    <Checkbox
                        label=""
                        value={checked}
                        onChange={handleCheckboxChange}

                    />
                    <div className="data-header__items">
                        <span>Date</span>
                        <span>Mileage</span>
                        <span>Description</span>
                        <span>Vehicle</span>
                        <span>Shop</span>
                        <span>Cost</span>
                        <span>Memo</span>
                    </div>
                </div>
            )}
            <div className="data-items">
                {items.sort(sortByDate).map((item) => (
                    <div key={item.id} 
                        className={selectedItems.includes(item.id) ? "data-item data-item__selected" : "data-item"} 
                        onClick={!itemIsBeingEdited ? (e) => handleItemSelect(item.id, e) : undefined} >
                            <form>
                                <div className="data-item__wrapper">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onClick={!itemIsBeingEdited ? (e) => handleItemSelect(item.id, e) : undefined}
                                        disabled={editingItemId !== null && editingItemId !== item.id}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && selectedItems.includes(item.id)) {
                                                e.preventDefault()
                                                handleEdit(item, e)
                                            } 
                                        }}
                                        onChange={() => {}}
                                    />
                                    <div className="data-item__input-wrapper">
                                        {editingItemId === item.id ? (
                                            <input
                                                className="data-item__input"
                                                type="text"
                                                defaultValue={editingItems.find(editedItem => editedItem.id === item.id)?.description || item.description}
                                                name={`description-${item.id}`}
                                                onChange={(e) => handleChange(e, item.id)}
                                                onFocus={() => handleFocus()}
                                                onClick={(e) => e.stopPropagation()} />
                                        ) : (
                                            <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={selectedItems.includes(item.id) ? itemSelectedClasses : itemDefaultClasses }>
                                                {item.description}
                                            </div>
                                        )}
                                        {editingItemId === item.id ? (
                                            <input
                                                type="date"
                                                value={editingItems.find(editedItem => editedItem.id === item.id)?.date || item.date}
                                                name={`date-${item.id}`}
                                                onChange={(e) => handleChange(e, item.id)}
                                                onFocus={() => handleFocus()}
                                                onClick={(e) => e.stopPropagation()} />
                                        ) : (
                                            <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={selectedItems.includes(item.id) ?  itemSelectedClasses : itemDefaultClasses }>
                                                {item.date}
                                            </div>
                                        )}
                                        {editingItemId === item.id ? (
                                            <input
                                                className="data-item__input"
                                                type="text"
                                                defaultValue={editingItems.find(editedItem => editedItem.id === item.id)?.mileage || item.mileage}
                                                name={`mileage-${item.id}`}
                                                onChange={(e) => handleMileageChange(e, item.id)}
                                                onFocus={() => handleFocus()}
                                                onClick={(e) => e.stopPropagation()} />
                                        ) : (
                                            <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={selectedItems.includes(item.id) ? itemSelectedClasses : itemDefaultClasses }>
                                                {item.mileage}
                                            </div>
                                        )}
                                        {editingItemId === item.id ? (
                                            <input
                                                className="data-item__input"
                                                type="text"
                                                defaultValue={editingItems.find(editedItem => editedItem.id === item.id)?.vehicle || item.vehicle}
                                                name={`vehicle-${item.id}`}
                                                onChange={(e) => handleChange(e, item.id)}
                                                onFocus={() => handleFocus()}
                                                onClick={(e) => e.stopPropagation()} />
                                        ) : (
                                            <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={selectedItems.includes(item.id) ? itemSelectedClasses : itemDefaultClasses }>
                                                {item.vehicle}
                                            </div>
                                        )}
                                        {editingItemId === item.id ? (
                                            <input
                                                className="data-item__input"
                                                type="text"
                                                defaultValue={editingItems.find(editedItem => editedItem.id === item.id)?.shop || item.shop}
                                                name={`shop-${item.id}`}
                                                onChange={(e) => handleChange(e, item.id)}
                                                onFocus={() => handleFocus()}
                                                onClick={(e) => e.stopPropagation()} />
                                        ) : (
                                            <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={selectedItems.includes(item.id) ? itemSelectedClasses : itemDefaultClasses }>
                                                {item.shop}
                                            </div>
                                        )}
                                        {editingItemId === item.id ? (
                                            <CurrencyInput
                                                id={`cost-${item.id}`}
                                                name={`cost-${item.id}`}
                                                placeholder="Enter cost"
                                                defaultValue={editingItems.find(editedItem => editedItem.id === item.id)?.cost || item.cost}
                                                prefix="$"
                                                decimalsLimit={2}
                                                decimalScale={2}
                                                onFocus={() => handleFocus()}
                                                onClick={(e) => e.stopPropagation()}
                                                onValueChange={(value) => handleCostChange(value, item.id)}
                                            />
                                            ) : (
                                            <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={selectedItems.includes(item.id) ? itemSelectedClasses : itemDefaultClasses }>
                                                {formatCost(item.cost)}
                                            </div>
                                        )}
                                        {editingItemId === item.id ? (
                                            <input
                                                className="data-item__input"
                                                type="text"
                                                defaultValue={editingItems.find(editedItem => editedItem.id === item.id)?.memo || item.memo}
                                                name={`memo-${item.id}`}
                                                onChange={(e) => handleChange(e, item.id)}
                                                onFocus={() => handleFocus()}
                                                onClick={(e) => e.stopPropagation()} />
                                        ) : (
                                            <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={selectedItems.includes(item.id) ? itemSelectedClasses : itemDefaultClasses }>
                                                {item.memo}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            {editingItemId === item.id && (
                                <div className="data-item__button-wrapper">
                                    <button type="button" onClick={(e) => {handleCancelEdit(e)}} disabled={!itemIsBeingEdited}>Cancel</button>
                                    <button type="submit" onClick={(e) => {handleSaveItem(e, item.id)}}>Save</button>
                                </div>
                            )}
                        </form>
                    </div>
                ))}
            </div>
        </>
        );
    }
  
export default ItemsList;