import { Dispatch, FormEvent, ChangeEvent } from "react";
import { Vehicle } from "../../types";
import "./ItemsListToolbar.css"

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
            <div className="toolbar-wrapper">
                {itemIsBeingEdited ? (
                    <div className="toolbar-wrapper__group">
                        <button type="button" className="btn btn-sm btn-secondary" onClick={(e) => {handleCancelEdit(e)}}>Cancel</button>
                        <button type="submit" className="btn btn-sm btn-primary" onClick={(e) => {handleSaveItem(e, editingItemId)}}>Save</button>
                    </div>
                ) : (
                    <>
                    {!selectedItems.length ? (
                        <div className="toolbar-wrapper__group">
                            <div>
                                <span>Filter by: </span>
                                <select id="vehicles-select" onChange={(e) => handleVehicleSort(e)} value={vehicleSort}>
                                    <option value="">All vehicles</option>
                                    {vehicles.map((vehicle) => (
                                        <option key={vehicle.id} value={vehicle.name}>{vehicle.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className="toolbar-wrapper__group">
                            <button onClick={() => setSelectedItems([])} className="btn btn-sm btn-secondary" disabled={itemIsBeingEdited}><i className="bi bi-x-lg"></i></button>
                            <span>{selectedItems.length} selected</span>
                            <button onClick={handleDeleteItems} className="btn btn-sm btn-danger" disabled={itemIsBeingEdited}>Delete selected</button>
                        </div>
                    )}
                    </>
                )}
            </div>
        </>
    )
}

export default ItemsListToolbar;