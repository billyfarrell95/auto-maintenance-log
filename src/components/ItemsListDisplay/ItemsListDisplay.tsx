import { formatCost } from "../../utils/formatters";
import { Item } from "../../types";

interface ItemsListDisplayProps {
    selectedItems: string[];
    item: Item;
    handleEdit: (item: Item, e: React.MouseEvent<HTMLElement> ) => void;
}

function ItemsListDisplay({ selectedItems, handleEdit, item }: ItemsListDisplayProps) {
    const handleDefineClasses = (item: Item) => {
        return selectedItems.includes(item.id) && selectedItems.length < 2 ? "data-item__display-selected data-item__display" : "data-item__display-default data-item__display" 
    }
    
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
                <div onClick={selectedItems.includes(item.id) && selectedItems.length < 2 ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    {item.date}
                </div>
                <div onClick={selectedItems.includes(item.id) && selectedItems.length < 2 ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    {item.description}
                </div>
                <div onClick={selectedItems.includes(item.id) && selectedItems.length < 2 ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    {item.mileage}
                </div>
                <div onClick={selectedItems.includes(item.id) && selectedItems.length < 2 ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    {item.vehicle}
                </div>
                <div onClick={selectedItems.includes(item.id) && selectedItems.length < 2 ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    {item.shop}
                </div>
                <div onClick={selectedItems.includes(item.id) && selectedItems.length < 2 ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    {formatCost(item.cost)}
                </div>
                <div onClick={selectedItems.includes(item.id) && selectedItems.length < 2 ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    {item.memo}
                </div>
            </div>
        </>
    )
}

export default ItemsListDisplay;