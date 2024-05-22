import { Item } from "../types";
  
interface ItemsListProps {
    items: Item[];  
}

function ItemsList({ items }: ItemsListProps) {
    return (
        <>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                    <p>Date: {item.date}</p>
                    <p>Vehicle: {item.vehicle}</p>
                    <p>Description: {item.description}</p>
                    <p>Shop: {item.shop}</p>
                    <p>Mileage: {item.mileage}</p>
                    <p>Memo: {item.memo}</p>
                    </li>
                ))}
            </ul>
        </>
        );
    }
  
export default ItemsList;