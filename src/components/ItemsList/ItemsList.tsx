import { useEffect, useState, MouseEvent, KeyboardEvent, FormEvent, Dispatch, SetStateAction, ChangeEvent } from "react";
import { Item, Vehicle, Shop } from "../../types";
import "./ItemList.css"
import ItemsListHeader from "../ItemsListHeader/ItemsListHeader";
import { CHECKBOX_STATES } from "../Checkbox";
import ItemsListDisplay from "../ItemsListDisplay/ItemsListDisplay";
import ItemsListEdit from "../ItemsListEdit/ItemsListEdit";
import ItemsListToolbar from "../../components/ItemsListToolbar/ItemsListToolbar"
import auth from "../../firebase/firebase";
import { updateItemInDb, deleteItemFromDb } from "../../api/api";
import { trimInput } from "../../utils/trimInput/trimInput";

interface ItemsListProps {
    items: Item[];
    selectedItems: string[];
    vehicles: Vehicle[];
    shops: Shop[];
    setItems: Dispatch<SetStateAction<Item[]>>;
    setSelectedItems: Dispatch<React.SetStateAction<string[]>>;
    itemIsBeingEdited: boolean;
    setItemIsBeingEdited: Dispatch<SetStateAction<boolean>>;
    focusedItemId: string | null;
    setFocusedItemId: Dispatch<SetStateAction<string | null>>;
}

function ItemsList({ items, setItems, selectedItems, setSelectedItems, itemIsBeingEdited, setItemIsBeingEdited, focusedItemId, setFocusedItemId, vehicles, shops }: ItemsListProps) {
    const [editingItems, setEditingItems] = useState<Item[]>([]);
    const [editingItemId, setEditingItemId] = useState("")
    const [checked, setChecked] = useState(CHECKBOX_STATES.Empty);
    const [selectModeOn, setSelectModeOn] = useState(false);
    const [sortItemsDescending, setSortItemsDescending] = useState(true);
    const [vehicleSort, setVehicleSort] = useState<string>("");

    const sortByDate = (a: Item, b: Item) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (sortItemsDescending) {
            return dateB.getTime() - dateA.getTime();
        } else {
            return dateA.getTime() - dateB.getTime();
        }
    }

    const handleEdit = (item: Item, e: MouseEvent | KeyboardEvent) => {
        e.stopPropagation();
        if (!itemIsBeingEdited && !selectModeOn) {
            setItemIsBeingEdited(true)
            setEditingItemId(item.id === editingItemId ? item.id : "")
            setFocusedItemId(item.id)
        } else {
            handleItemSelect(item.id, e)
        }
    }

    const handleCancelEdit = (e: FormEvent) => {
        e.stopPropagation();
        setEditingItems([])
        setEditingItemId("");
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
        if (vehicleSort === "") {
            const newSelectedItems = areAllItemsSelected ? [] : items.map(item => item.id);
            setSelectedItems(newSelectedItems);
        } else {
            const sortedItems = items.filter(item => item.vehicle.includes(vehicleSort));
            const newSelectedItems = areAllItemsSelected ? [] : sortedItems.map(item => item.id);
            setSelectedItems(newSelectedItems);
        }
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

    const handleSaveItem = async (e: FormEvent, id: string) => {
        if (editingItemId && auth.currentUser) {
            e.stopPropagation();
            e.preventDefault();
            setItemIsBeingEdited(false);
            let updatedItems = items.map(item => item.id === id ? editingItems.find(editedItem => editedItem.id === id) || item : item);
            let trimmedUpdatedItems = updatedItems.map(item => {
                return trimInput(item)
            })
            const itemToUpload = updatedItems.find(item => item.id === id);
            setItems(trimmedUpdatedItems);
            if (itemToUpload) {
                const trimmedItem = trimInput(itemToUpload);
                if (trimmedItem.cost && trimmedItem.description && trimmedItem.mileage && trimmedItem.shop) {
                    try {
                        updateItemInDb(trimmedItem, id)
                    } catch (error) {
                        console.error("Error updating item in DB", error)
                    }
                }
            }
            setEditingItemId("");
            setEditingItems([]);
        } else if (editingItemId && !auth.currentUser) {
            e.stopPropagation();
            e.preventDefault();
            setItemIsBeingEdited(false);
            const updatedItems = items.map(item => item.id === id ? editingItems.find(editedItem => editedItem.id === id) || item : item);
            setItems(updatedItems);
            setEditingItemId("");
            setEditingItems([]);
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

    const handleDeleteItems = async () => {
        const newArr = items.filter(item => !selectedItems.includes(item.id));
        setItems(newArr);
        try {
            if (auth.currentUser) {
                selectedItems.forEach(itemId => {
                    deleteItemFromDb(itemId)
                })
            }
        } catch (error) {
            console.error("Error deleting log item from db", error)
        }
        setSelectedItems([]);
    };

    const handleVehicleSort = (e: ChangeEvent<HTMLSelectElement>) => {
        setVehicleSort(e.target.value)
    }

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
            setFocusedItemId(null)
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

    return (    
        <>
            {items.length && (
                <ItemsListHeader
                    checked={checked} 
                    handleChange={handleCheckboxChange} 
                    itemIsBeingEdited={itemIsBeingEdited}
                    sortItemsDescending={sortItemsDescending}
                    setSortItemsDescending={setSortItemsDescending} />
            )}
            <div className="data-items">
                <ItemsListToolbar 
                    selectedItems={selectedItems}
                    itemIsBeingEdited={itemIsBeingEdited}
                    handleCancelEdit={handleCancelEdit}
                    handleSaveItem={handleSaveItem}
                    vehicleSort={vehicleSort}
                    handleDeleteItems={handleDeleteItems}
                    handleVehicleSort={handleVehicleSort}
                    editingItemId={editingItemId}
                    vehicles={vehicles}
                    setSelectedItems={setSelectedItems}
                    focusedItemId={focusedItemId} />

                {items.sort(sortByDate).map((item) => (
                    <div key={item.id}>
                        {item.vehicle.includes(vehicleSort) ? (
                            <div>
                                <div className="data-item small">
                                    <div className={selectedItems.includes(item.id) || focusedItemId === item.id ? "data-item__selected" : undefined}
                                        onClick={(e) => {handleItemClick(item.id, e)}} >
                                            <div className={!focusedItemId ? "data-item__wrapper" : undefined}>
                                                {!focusedItemId && (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(item.id)}
                                                        onClick={(e) => handleItemSelect(item.id, e)}
                                                        disabled={itemIsBeingEdited}
                                                        onChange={() => {}} />
                                                )}
                                                <>
                                                    {focusedItemId === item.id ? (
                                                        <>
                                                            <ItemsListEdit
                                                            editingItems={editingItems}
                                                            setEditingItems={setEditingItems}
                                                            setEditingItemId={setEditingItemId}
                                                            setItemIsBeingEdited={setItemIsBeingEdited}
                                                            item={item}
                                                            vehicles={vehicles}
                                                            shops={shops} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {!focusedItemId && (
                                                                <ItemsListDisplay
                                                                    selectedItems={selectedItems}
                                                                    handleEdit={handleEdit}
                                                                    item={item} />
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            </div>
                                    </div>
                                </div>
                                <div className="data-item large">
                                <div className={selectedItems.includes(item.id) || focusedItemId === item.id ? "data-item__selected" : undefined}
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
                                                        item={item}
                                                        vehicles={vehicles}
                                                        shops={shops} />
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
                        </div>
                        ) : (
                            null
                        )}
                    </div>
                ))}
            </div>
        </>
        );
    }
  
export default ItemsList;