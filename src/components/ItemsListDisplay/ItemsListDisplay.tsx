import { formatCost } from "../../utils/formatters";
import { Item } from "../../types";

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
                    <div className="item">{item.date}</div>
                    <div className="item">{item.description}</div> 
                    <div className="item">{item.mileage}</div>
                    <div className="item">{item.vehicle}</div>
                    <div className="item">{item.shop}</div>
                    <div className="item">{formatCost(item.cost)}</div>
                    <div className="item">{item.memo}</div>
                </div>
            </div>
            <div className="data-item__display-wrapper large">
                <div onClick={(e) => handleEdit(item, e)} className={handleDefineClasses(item)}>
                    {item.date}
                </div>
                <div onClick={(e) => handleDisplayItemClick(item, e)} className={handleDefineClasses(item)}>
                    {item.description}
                </div>
                <div onClick={(e) => handleDisplayItemClick(item, e)} className={handleDefineClasses(item)}>
                    {item.mileage}
                </div>
                <div onClick={(e) => handleDisplayItemClick(item, e)} className={handleDefineClasses(item)}>
                    {item.vehicle}
                </div>
                <div onClick={(e) => handleDisplayItemClick(item, e)} className={handleDefineClasses(item)}>
                    {item.shop}
                </div>
                <div onClick={(e) => handleDisplayItemClick(item, e)} className={handleDefineClasses(item)}>
                    {formatCost(item.cost)}
                </div>
                <div onClick={(e) => handleDisplayItemClick(item, e)} className={handleDefineClasses(item)}>
                    {item.memo}
                </div>
            </div>
        </>
    )
}

export default ItemsListDisplay;