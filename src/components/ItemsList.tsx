import { Item } from "../types";
  
interface ItemsListProps {
    items: Item[];
    vehicles: string[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;  
}

function ItemsList({ items, vehicles, setItems }: ItemsListProps) {

    const sortByDate = (a: Item, b: Item) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    }

    const sortedItems = [...items].sort(sortByDate);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const { name, value } = e.target;
        const updatedItems = [...sortedItems];
        updatedItems[index] = {
            ...updatedItems[index],
            [name.split('-')[0]]: value,
        };
        setItems(updatedItems);
    }

    return (
        <>
            {sortedItems.map((item, index) => ( 
                <div key={index}>
                    <input type="date" value={item.date} name={`date-${index}`} onChange={(e) => handleChange(e, index)} />
                    <select name={`vehicle-${index}`} value={item.vehicle} onChange={(e) => handleChange(e, index)}>
                        {vehicles.map((vehicle, vIndex) => (
                            <option key={vIndex} value={vehicle}>{vehicle}</option>
                        ))}
                    </select>
                    <input type="text" value={item.description} name={`description-${index}`} onChange={(e) => handleChange(e, index)} />
                    <input type="text" value={item.shop} name={`shop-${index}`} onChange={(e) => handleChange(e, index)} />
                    <input type="text" value={item.mileage} name={`mileage-${index}`} onChange={(e) => handleChange(e, index)} />
                    <input type="text" value={item.memo} name={`memo-${index}`} onChange={(e) => handleChange(e, index)} />
                </div>
            ))}
        </>
        );
    }
  
export default ItemsList;