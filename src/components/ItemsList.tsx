import { useState } from "react";
import { Item } from "../types";
import "./ItemList.css"
  
interface ItemsListProps {
    items: Item[];
    selectedItems: string[];
    vehicles: string[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  }

function ItemsList({ items, vehicles, setItems, selectedItems, setSelectedItems }: ItemsListProps) {
    const [editingItems, setEditingItems] = useState<Item[]>([]);
    const [focusedItemId, setFocusedItemId] = useState("");
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    const sortByDate = (a: Item, b: Item) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    }

    const handleEdit = (item: Item) => {
        if (selectedItems.includes(item.id)) {
            setEditingItemId(item.id === editingItemId ? null: item.id)
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>, id: string) => {
        const { name, value } = e.target;
        const updatedItems = editingItems.map(item => item.id === id ? { ...item, [name.split('-')[0]]: value } : item);
        setEditingItems(updatedItems);
    };

    const handleItemSelect = (id: string) => {
        setEditingItems([])
        setSelectedItems(prevSelected => {
            if (prevSelected.includes(id)) {
                console.log("one")
                return prevSelected.filter(itemId => itemId !== id);
            } else {
                console.log("two")
                return [...prevSelected, id];
            }
        });
    };

    const handleFocus = (id: string) => {
        setFocusedItemId(id);
        if (!editingItems.length) {
            setEditingItems(items);
        }
    };

    const handleInputClick = (e: React.FormEvent) => {
        e.stopPropagation();
    }

    const handleSaveItem = (e: React.FormEvent, id: string) => {
        e.preventDefault();
        const updatedItems = editingItems.map(item => item.id === id ? item : item);
        if (updatedItems.length) {
            setItems(updatedItems);
        }
        
        setEditingItemId(null);
    }

    const handleCancelEdit = () => {
        setEditingItems([])
        setEditingItemId(null);
    }

    // @todo
    // 1. Issue saving updated item values
    // 2. If item is being edited, require save/cancel before being able to edit another
    // 3. Fix issue where item in unchecked after clicked to edit

    return (    
        <>
            {items.sort(sortByDate).map((item) => (
                <div key={item.id} className="data-item" onClick={() => handleItemSelect(item.id)}>
                        <form onSubmit={(e) => handleSaveItem(e, item.id)}>
                        <div className="data-item__input-wrapper">
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}   
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleItemSelect(item.id);
                                    }
                                }}
                                onChange={() => {}}
                            />
                            {editingItemId === item.id ? (
                               <select name={`vehicle-${item.id}`} 
                                    className="data-item__input"
                                    value={editingItems.find(editedItem => editedItem.id === item.id)?.vehicle || item.vehicle}
                                    onChange={(e) => handleChange(e, item.id)}
                                    onFocus={() => handleFocus(item.id)}
                                    onClick={(e) => handleInputClick(e)} >

                                    {vehicles.map((vehicle, vIndex) => (
                                        <option key={vIndex} value={vehicle}>{vehicle}</option>
                                    ))}
                                </select>
                            ) : (
                                <div onClick={selectedItems.includes(item.id) ? () => handleEdit(item): undefined} className={selectedItems.includes(item.id) ? "data-item__display-selected" : "data-item__display"}>
                                    {item.vehicle}
                                </div>
                            )}
                            
                            {editingItemId === item.id ? (
                               <input 
                                type="date" 
                                value={editingItems.find(editedItem => editedItem.id === item.id)?.date || item.date}
                                name={`date-${item.id}`} 
                                onChange={(e) => handleChange(e, item.id)}
                                onFocus={() => handleFocus(item.id)}
                                onClick={(e) => handleInputClick(e)} />
                            ) : (
                                <div onClick={selectedItems.includes(item.id) ? () => handleEdit(item): undefined} className={selectedItems.includes(item.id) ? "data-item__display-selected" : "data-item__display"}>
                                    {item.date}
                                </div>
                            )}
                            
                            {editingItemId === item.id ? (
                               <input 
                               className="data-item__input"
                               type="text" 
                               value={editingItems.find(editedItem => editedItem.id === item.id)?.description || item.description} 
                               name={`description-${item.id}`} 
                               onChange={(e) => handleChange(e, item.id)} 
                               onFocus={() => handleFocus(item.id)}
                               onClick={(e) => handleInputClick(e)} />
                            ) : (
                                <div onClick={selectedItems.includes(item.id) ? () => handleEdit(item): undefined} className={selectedItems.includes(item.id) ? "data-item__display-selected" : "data-item__display"}>
                                    {item.description}
                                </div>
                            )}
                            
                            {editingItemId === item.id ? (
                               <input 
                               className="data-item__input"
                               type="text" 
                               value={editingItems.find(editedItem => editedItem.id === item.id)?.shop || item.shop} 
                               name={`shop-${item.id}`} 
                               onChange={(e) => handleChange(e, item.id)} 
                               onFocus={() => handleFocus(item.id)}
                               onClick={(e) => handleInputClick(e)} />
                            ) : (
                                <div onClick={selectedItems.includes(item.id) ? () => handleEdit(item): undefined} className={selectedItems.includes(item.id) ? "data-item__display-selected" : "data-item__display"}>
                                    {item.shop}
                                </div>
                            )}

                            {editingItemId === item.id ? (
                               <input 
                               className="data-item__input"
                               type="text" 
                               value={editingItems.find(editedItem => editedItem.id === item.id)?.mileage || item.mileage} 
                               name={`mileage-${item.id}`} 
                               onChange={(e) => handleChange(e, item.id)} 
                               onFocus={() => handleFocus(item.id)}
                               onClick={(e) => handleInputClick(e)} />
                            ) : (
                                <div onClick={selectedItems.includes(item.id) ? () => handleEdit(item): undefined} className={selectedItems.includes(item.id) ? "data-item__display-selected" : "data-item__display"}>
                                    {item.mileage}
                                </div>
                            )}
                            
                            {editingItemId === item.id ? (
                               <input 
                               className="data-item__input"
                               type="text" 
                               value={editingItems.find(editedItem => editedItem.id === item.id)?.memo || item.memo} 
                               name={`memo-${item.id}`} 
                               onChange={(e) => handleChange(e, item.id)} 
                               onFocus={() => handleFocus(item.id)}
                               onClick={(e) => handleInputClick(e)} />
                            ) : (
                                <div onClick={selectedItems.includes(item.id) ? () => handleEdit(item): undefined} className={selectedItems.includes(item.id) ? "data-item__display-selected" : "data-item__display"}>
                                    {item.memo}
                                </div>
                            )}
                        </div>
                        {editingItemId === item.id && (
                            <div className="data-item__button-wrapper">
                                <button type="button" onClick={handleCancelEdit}>Cancel</button>
                                <button type="submit">Save</button>
                            </div>
                        )}
                    </form>
                </div>
            ))}
        </>
        );
    }
  
export default ItemsList;