import { Dispatch, FormEvent, ChangeEvent } from "react";
import { Vehicle } from "../../types";

interface ItemsListToolbarProps {
    selectedItems: string[];
    itemIsBeingEdited: boolean;
    handleCancelEdit: (e: FormEvent) => void
    handleSaveItem: (e: FormEvent, id: string) => void;
    vehicleSort: string;
    handleDeleteItems: () => void;
    handleVehicleSort: (e: ChangeEvent<HTMLSelectElement>) => void;
    editingItemId: string;
    vehicles: Vehicle[];
    setSelectedItems: Dispatch<React.SetStateAction<string[]>>;
}


function ItemsListToolbar({ selectedItems, itemIsBeingEdited, handleCancelEdit, handleDeleteItems, handleSaveItem, vehicleSort, editingItemId, handleVehicleSort, vehicles, setSelectedItems }: ItemsListToolbarProps) {
    
    return (
        <>
            {itemIsBeingEdited ? (
                    <div className="data-item__button-wrapper">
                        <button type="button" onClick={(e) => {handleCancelEdit(e)}}>Cancel</button>
                        <button type="submit" onClick={(e) => {handleSaveItem(e, editingItemId)}}>Save</button>
                    </div>
                ) : (
                    <>
                    {!selectedItems.length ? (
                        <div className="data-item__button-wrapper">
                            <div>
                                <span>Sort by: </span>
                                <select id="vehicles-select" onChange={(e) => handleVehicleSort(e)} value={vehicleSort}>
                                    <option value="">All vehicles</option>
                                    {vehicles.map((vehicle) => (
                                        <option key={vehicle.id} value={vehicle.name}>{vehicle.name}</option>
                                    ))}
                                </select>
                            </div>
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
        </>
    )
}

export default ItemsListToolbar;