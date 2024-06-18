import Checkbox from "./Checkbox";
import { CHECKBOX_STATES } from "./Checkbox";
import "./ItemsListHeader.css";

interface ItemsListHeaderProps {
    checked: CHECKBOX_STATES
    handleChange: () => void;
    itemIsBeingEdited: boolean;
}

function ItemsListHeader ({ checked, handleChange, itemIsBeingEdited }: ItemsListHeaderProps) {
    
    return (
        <div className="data-header">
            <Checkbox
                label=""
                value={checked}
                onChange={handleChange}
                disabled={itemIsBeingEdited}

            />
            <div className="data-header__items">
                <span>Date</span>
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