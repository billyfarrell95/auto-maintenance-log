import Checkbox from "./Checkbox";
import { CHECKBOX_STATES } from "./Checkbox";

interface ItemsListHeaderProps {
    checked: CHECKBOX_STATES
    handleChange: () => void;
}

function ItemsListHeader ({ checked, handleChange }: ItemsListHeaderProps) {
    
    return (
        <div className="data-header">
            <Checkbox
                label=""
                value={checked}
                onChange={handleChange}

            />
            <div className="data-header__items">
                <span>Description</span>
                <span>Date</span>
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