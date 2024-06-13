import { formatCost } from "../utils/formatters";
import { Item } from "../types";

interface ItemsListDisplayProps {
    selectedItems: string[];
    item: Item;
    handleEdit: any;
}

function ItemsListDisplay({ selectedItems, handleEdit, item }: ItemsListDisplayProps) {
    const handleDefineClasses = (item: Item) => {
        return selectedItems.includes(item.id) ? "data-item__display-selected data-item__display" : "data-item__display-default data-item__display" 
    }
    
    return (
        <>
            <div className="data-item__display-wrapper small">
                <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    <div>{item.description}</div>
                    <div>{item.date}</div>
                    <div>{item.mileage}</div>
                    <div>{item.vehicle}</div>
                    <div>{item.shop}</div>
                    <div>{formatCost(item.cost)}</div>
                    <div>{item.memo}</div>
                </div>
            </div>
            <div className="data-item__display-wrapper large">
                <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    {item.description}
                </div>
                <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    {item.date}
                </div>
                <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    {item.mileage}
                </div>
                <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    {item.vehicle}
                </div>
                <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    {item.shop}
                </div>
                <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    {formatCost(item.cost)}
                </div>
                <div onClick={selectedItems.includes(item.id) ? (e) => handleEdit(item, e): undefined} className={handleDefineClasses(item)}>
                    {item.memo}
                </div>
            </div>
        </>
    )
}

export default ItemsListDisplay;