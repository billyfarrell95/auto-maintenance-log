import { useEffect, useState } from "react";
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
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [itemIsBeingEdited, setItemIsBeingEdited] = useState(false);
    const sortByDate = (a: Item, b: Item) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    }

    const handleEdit = (item: Item, e: React.MouseEvent) => {
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

    useEffect(() => {
    }, [selectedItems])

    return (    
        <>
            {/* @todo; add indeterminate state to this checkbox if some items are selected, but not all */}
            {items.length ? (
                <div className="data-header">
                    <input type="checkbox" checked={selectedItems.length === items.length && selectedItems.length > 1} onChange={handleSelectAll} />
                    <div className="data-header__items">
                        <span>Vehicle</span>
                        <span>Date</span>
                        <span>Description</span>
                        <span>Shop</span>
                        <span>Mileage</span>
                        <span>Memo</span>
                    </div>
                </div>
            ) : (
                null
            )}
            <div className="data-items">
                {items.sort(sortByDate).map((item) => (
                    <div key={item.id} className={selectedItems.includes(item.id) ? "data-item data-item__selected" : "data-item"} onClick={!itemIsBeingEdited ? (e) => handleItemSelect(item.id, e) : undefined}>
                            <form>
                                <div className="data-item__wrapper">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onClick={!itemIsBeingEdited ? (e) => handleItemSelect(item.id, e) : undefined}
                                        disabled={editingItemId !== null && editingItemId !== item.id}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleItemSelect(item.id, e);
                                            }
                                        }}
                                        onChange={() => {}}
                                    />
                                    <div className="data-item__input-wrapper">
                                        {editingItemId === item.id ? (
                                            <select name={`vehicle-${item.id}`}
                                                className="data-item__input"
                                                value={editingItems.find(editedItem => editedItem.id === item.id)?.vehicle || item.vehicle}
                                                onChange={(e) => handleChange(e, item.id)}
                                                onFocus={() => handleFocus()}
                                                onClick={(e) => e.stopPropagation()} >
                                                {vehicles.map((vehicle, vIndex) => (
                                                    <option key={vIndex} value={vehicle}>{vehicle}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={selectedItems.includes(item.id) ? itemSelectedClasses : itemDefaultClasses }>
                                                {item.vehicle}
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
                                                value={editingItems.find(editedItem => editedItem.id === item.id)?.description || item.description}
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
                                                className="data-item__input"
                                                type="text"
                                                value={editingItems.find(editedItem => editedItem.id === item.id)?.shop || item.shop}
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
                                            <input
                                                className="data-item__input"
                                                type="text"
                                                value={editingItems.find(editedItem => editedItem.id === item.id)?.mileage || item.mileage}
                                                name={`mileage-${item.id}`}
                                                onChange={(e) => handleChange(e, item.id)}
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
                                                value={editingItems.find(editedItem => editedItem.id === item.id)?.memo || item.memo}
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