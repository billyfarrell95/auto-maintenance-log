import Checkbox from "../Checkbox";
import { CHECKBOX_STATES } from "../Checkbox";
import "./ItemsListHeader.css";
import { SetStateAction, Dispatch } from "react";

interface ItemsListHeaderProps {
    checked: CHECKBOX_STATES
    handleChange: () => void;
    itemIsBeingEdited: boolean;
    sortItemsDescending: boolean,
    setSortItemsDescending: Dispatch<SetStateAction<boolean>>;
}

function ItemsListHeader ({ checked, handleChange, itemIsBeingEdited, sortItemsDescending, setSortItemsDescending }: ItemsListHeaderProps) {
    
    return (
        <div className="data-header">
            <Checkbox
                label=""
                value={checked}
                onChange={handleChange}
                disabled={itemIsBeingEdited} />
            <div className="data-header__items">
                <span>Date <button onClick={() => setSortItemsDescending(current => !current)} className="btn-transparent">{sortItemsDescending ? (<i className="bi bi-arrow-down"></i>) : (<i className="bi bi-arrow-up"></i>)}</button></span>
                <span>Description</span>
                <span>Mileage</span>
                <span>Vehicle</span>
                <span>Shop</span>
                <span>Cost</span>
                <span>Memo</span>
            </div>
        </div>
    )
}

export default ItemsListHeader