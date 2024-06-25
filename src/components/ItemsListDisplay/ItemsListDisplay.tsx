import { formatCost } from "../../utils/formatters";
import { Item } from "../../types";
import {formatDate} from "../../utils/formatters"

interface ItemsListDisplayProps {
    selectedItems: string[];
    item: Item;
    handleEdit: (item: Item, e: React.MouseEvent<HTMLElement> ) => void;
}

function ItemsListDisplay({ selectedItems, handleEdit, item }: ItemsListDisplayProps) {
    const handleDefineClasses = (item: Item) => {
        if (selectedItems.includes(item.id) && selectedItems.length < 2) {
            return "data-item__display-default data-item__display"
        } else {
            return "data-item__display"
        }
    }

    const handleDisplayItemClick = (item: Item,  e: React.MouseEvent<HTMLElement>) => {
        if (selectedItems.includes(item.id) && selectedItems.length < 2) {
            handleEdit(item, e);
        }
    };
    
    return (
        <>
            <div className="data-item__display-wrapper small">
                <div className={handleDefineClasses(item)}>
                    <div className="item">
                        <div><label>Date</label></div>
                        <span className="data-item__data">{formatDate(item.date)}</span>
                    </div>
                    <div className="item">
                        <div><label>Vehicle</label></div>
                        <span className="data-item__data">{item.vehicle}</span>
                    </div>
                    <div className="item">
                        <div><label>Description</label></div>
                        <span className="data-item__data">{item.description}</span>
                    </div>
                </div>
            </div>
            <div className="data-item__display-wrapper large">
                <div onClick={(e) => handleDisplayItemClick(item, e)} className={handleDefineClasses(item)}>
                    <label>Date</label>
                    <span className="data-item__data">{formatDate(item.date)}</span>
                </div>
                <div onClick={(e) => handleDisplayItemClick(item, e)} className={handleDefineClasses(item)}>
                    <label>Description</label>
                    <span className="data-item__data">{item.description}</span>
                </div>
                <div onClick={(e) => handleDisplayItemClick(item, e)} className={handleDefineClasses(item)}>
                    <label>Mileage</label>
                    <span className="data-item__data">{item.mileage}</span>
                </div>
                <div onClick={(e) => handleDisplayItemClick(item, e)} className={handleDefineClasses(item)}>
                    <label>Vehicle</label>
                    <span className="data-item__data">{item.vehicle}</span>
                </div>
                <div onClick={(e) => handleDisplayItemClick(item, e)} className={handleDefineClasses(item)}>
                    <label>Shop</label>
                    <span className="data-item__data">{item.shop}</span>
                </div>
                <div onClick={(e) => handleDisplayItemClick(item, e)} className={handleDefineClasses(item)}>
                    <label>Cost</label>
                    <span className="data-item__data">{formatCost(item.cost)}</span>
                </div>
                <div onClick={(e) => handleDisplayItemClick(item, e)} className={handleDefineClasses(item)}>
                    <label>Memo</label>
                    <span className="data-item__data">{item.memo}</span>
                </div>
            </div>
        </>
    )
}

export default ItemsListDisplay;