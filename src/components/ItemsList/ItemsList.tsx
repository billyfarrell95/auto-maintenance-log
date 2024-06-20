import { useEffect, useState, MouseEvent, KeyboardEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { Item, Vehicle } from "../../types";
import "./ItemList.css"
import ItemsListHeader from "../ItemsListHeader/ItemsListHeader";
import { CHECKBOX_STATES } from "../Checkbox";
import ItemsListDisplay from "../ItemsListDisplay/ItemsListDisplay";
import ItemsListEdit from "../ItemsListEdit/ItemsListEdit";

interface ItemsListProps {
    items: Item[];
    selectedItems: string[];
    vehicles: Vehicle[];
    setItems: Dispatch<SetStateAction<Item[]>>;
    setSelectedItems: Dispatch<React.SetStateAction<string[]>>;
    itemIsBeingEdited: boolean;
    setItemIsBeingEdited: Dispatch<SetStateAction<boolean>>;
    focusedItemId: string | null;
    setFocusedItemId: Dispatch<SetStateAction<string | null>>;
}

function ItemsList({ items, setItems, selectedItems, setSelectedItems, itemIsBeingEdited, setItemIsBeingEdited, focusedItemId, setFocusedItemId }: ItemsListProps) {
    const [editingItems, setEditingItems] = useState<Item[]>([]);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [checked, setChecked] = useState(CHECKBOX_STATES.Empty);
    const [selectedModeOn, setSelectModeOn] = useState(false)

    const sortByDate = (a: Item, b: Item) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    }

    const handleEdit = (item: Item, e: MouseEvent | KeyboardEvent) => {
        e.stopPropagation();
        if (!itemIsBeingEdited && !selectedModeOn) {
            setItemIsBeingEdited(true)
            setEditingItemId(item.id === editingItemId ? null: item.id)
            setFocusedItemId(item.id)
        } else {
            handleItemSelect(item.id, e)
        }
    }

    const handleCancelEdit = (e: FormEvent) => {
        e.stopPropagation();
        setEditingItems([])
        setEditingItemId(null);
        setItemIsBeingEdited(false)
    }

    const handleItemClick = (id: string, e: MouseEvent | KeyboardEvent ) => {
        if (!itemIsBeingEdited && selectedItems.length < 2) {
            setSelectedItems([]);
            handleItemSelect(id, e)
            e.stopPropagation();
            setFocusedItemId(id)
        } else {
            handleItemSelect(id, e)
        }
    }
    
    const handleSelectAll = () => {
        const areAllItemsSelected = selectedItems.length === items.length;
        const newSelectedItems = areAllItemsSelected ? [] : items.map(item => item.id);
        setSelectedItems(newSelectedItems);
    };

    const handleItemSelect = (id: string, e: FormEvent) => {
        if (!itemIsBeingEdited) {
            e.stopPropagation();
            setEditingItems([])
            setSelectedItems(prevSelected => {
                if (prevSelected.includes(id)) {
                    return prevSelected.filter(itemId => itemId !== id);
                } else {
                    return [...prevSelected, id];
                }
            });
        }
    };

    const handleSaveItem = (e: FormEvent, id: string) => {
        if (editingItemId) {
            e.stopPropagation();
            e.preventDefault();
            setItemIsBeingEdited(false)
            const updatedItems = items.map(item => item.id === id ? editingItems.find(editedItem => editedItem.id === id) || item : item);
            setItems(updatedItems);
            setEditingItemId(null);
            setEditingItems([])
        }
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

        if (selectedItems.length) {
            setSelectModeOn(true)
        } else {
            setSelectModeOn(false)
        }

        // Unfocus Item if more than one are selected
        if (selectedItems.length > 1 && focusedItemId !== null) {
            setFocusedItemId(null)
        }
    }, [selectedItems])
   
    useEffect(() => {
        if (itemIsBeingEdited) {
            setEditingItems(items.map(item => ({ ...item })));
        }
    }, [itemIsBeingEdited])

    const handleDeleteItems = () => {
        const newArr = items.filter(item => !selectedItems.includes(item.id));
        setItems(newArr);
        setSelectedItems([]);
    };

    return (    
        <>
            {items.length && (
                <ItemsListHeader checked={checked} handleChange={handleCheckboxChange} itemIsBeingEdited={itemIsBeingEdited} />
            )}
            <div className="data-items">
                {itemIsBeingEdited ? (
                    <div className="data-item__button-wrapper">
                        <button type="button" onClick={(e) => {handleCancelEdit(e)}}>Cancel</button>
                        <button type="submit" onClick={editingItemId ? (e) => {handleSaveItem(e, editingItemId)} : undefined}>Save</button>
                    </div>
                ) : (
                    <>
                    {!selectedItems.length ? (
                        <div className="data-item__button-wrapper">
                            <button>Sort and filters will go here</button>
                        </div>
                    ) : (
                        <div className="data-item__button-wrapper">
                            <button onClick={() => setSelectedItems([])} disabled={itemIsBeingEdited}>X</button>
                            <span>{selectedItems.length} Selected</span>
                            <button onClick={handleDeleteItems} disabled={itemIsBeingEdited}>Delete selected</button>
                        </div>
                    )}
                    </>
                )}
                {items.sort(sortByDate).map((item) => (
                    <div className="data-item" key={item.id}>
                        <div className={selectedItems.includes(item.id) || focusedItemId === item.id ? "data-item__selected" : "data-item"}
                            onClick={(e) => {handleItemClick(item.id, e)}} >
                                <div className="data-item__wrapper">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onClick={(e) => handleItemSelect(item.id, e)}
                                        disabled={itemIsBeingEdited}
                                        onChange={() => {}}
                                    />
                                    <>
                                        {focusedItemId === item.id ? (
                                            <>
                                                <ItemsListEdit
                                                 editingItems={editingItems} 
                                                 setEditingItems={setEditingItems} 
                                                 setEditingItemId={setEditingItemId} 
                                                 setItemIsBeingEdited={setItemIsBeingEdited} 
                                                 item={item} />
                                            </>
                                        ) : (
                                            <>
                                                <ItemsListDisplay 
                                                selectedItems={selectedItems} 
                                                handleEdit={handleEdit} 
                                                item={item} />
                                            </>
                                        )}
                                    </>
                                </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
        );
    }
  
export default ItemsList;