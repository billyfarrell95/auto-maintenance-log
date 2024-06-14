import { useEffect, useState, MouseEvent, KeyboardEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { Item, Vehicle } from "../types";
import "./ItemList.css"
import ItemsListHeader from "./ItemsListHeader";
import { CHECKBOX_STATES } from "./Checkbox";
import ItemsListDisplay from "./ItemsListDisplay";
import ItemsListEdit from "./ItemsListEdit";
  
interface ItemsListProps {
    items: Item[];
    selectedItems: string[];
    vehicles: Vehicle[];
    setItems: Dispatch<SetStateAction<Item[]>>;
    setSelectedItems: Dispatch<React.SetStateAction<string[]>>;
    itemIsBeingEdited: boolean;
    setItemIsBeingEdited: Dispatch<SetStateAction<boolean>>
}

function ItemsList({ items, setItems, selectedItems, setSelectedItems, itemIsBeingEdited, setItemIsBeingEdited }: ItemsListProps) {
    const [editingItems, setEditingItems] = useState<Item[]>([]);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [checked, setChecked] = useState(CHECKBOX_STATES.Empty);

    const sortByDate = (a: Item, b: Item) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    }

    const handleEdit = (item: Item, e: MouseEvent | KeyboardEvent) => {
        e.stopPropagation();
        if (selectedItems.includes(item.id) && !itemIsBeingEdited) {
            setItemIsBeingEdited(true)
            setEditingItemId(item.id === editingItemId ? null: item.id)
        }
    }

    const handleCancelEdit = (e: FormEvent) => {
        e.stopPropagation();
        setEditingItems([])
        setEditingItemId(null);
        setItemIsBeingEdited(false)
    }
    
    const handleSelectAll = () => {
        const allItemsSelected = selectedItems.length === items.length;
        const newSelectedItems = allItemsSelected ? [] : items.map(item => item.id);
        setSelectedItems(newSelectedItems);
    };

    const handleItemSelect = (id: string, e: FormEvent) => {
        e.stopPropagation();
        setEditingItems([])
        setSelectedItems(prevSelected => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(itemId => itemId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSaveItem = (e: FormEvent, id: string) => {
        e.stopPropagation();
        e.preventDefault();
        setItemIsBeingEdited(false)
        const updatedItems = items.map(item => item.id === id ? editingItems.find(editedItem => editedItem.id === id) || item : item);
        setItems(updatedItems);
        setEditingItemId(null);
    } 

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
   
    useEffect(() => {
        if (itemIsBeingEdited) {
            setEditingItems(items.map(item => ({ ...item })));
        }
    }, [itemIsBeingEdited])

    return (    
        <>
            {items.length && (
                <ItemsListHeader checked={checked} handleChange={handleCheckboxChange} />
            )}
            <div className="data-items">
                {items.sort(sortByDate).map((item) => (
                    <div className="data-item" key={item.id}>
                        <div className={selectedItems.includes(item.id) ? "data-item__selected" : "data-item"}
                            onClick={!itemIsBeingEdited ? (e) => handleItemSelect(item.id, e) : undefined} >
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
                                    <>
                                        {editingItemId === item.id ? (
                                            <ItemsListEdit editingItems={editingItems} setEditingItems={setEditingItems} item={item} />
                                        ) : (
                                            <ItemsListDisplay selectedItems={selectedItems} handleEdit={handleEdit} item={item} />
                                        )}
                                    </>
                                </div>
                        </div>
                        {editingItemId === item.id && (
                            <div className="data-item__button-wrapper">
                                <button type="button" onClick={(e) => {handleCancelEdit(e)}} disabled={!itemIsBeingEdited}>Cancel</button>
                                <button type="submit" onClick={(e) => {handleSaveItem(e, item.id)}}>Save</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
        );
    }
  
export default ItemsList;