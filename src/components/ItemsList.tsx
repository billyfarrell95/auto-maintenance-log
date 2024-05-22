import { Item } from "../types";
  
interface ItemsListProps {
    items: Item[];
    vehicles: string[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;  
}

function ItemsList({ items, vehicles, setItems }: ItemsListProps) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const { name, value } = e.target;
        const updatedItems = [...items];
        updatedItems[index] = {
            ...updatedItems[index],
            [name]: value,
        };
        setItems(updatedItems);
    }

    return (
        <>
            {items.map((item, index) => ( 
                <div key={index}>
                    <input type="date" value={item.date} name={`date-${index}`} onChange={(e) => handleChange(e, index)} />
                    <p>Vehicle: {item.vehicle}</p>
                    {/* <select name="vehicle" id="vehicles" value={item.vehicle} onChange={(e) => handleChange(e, index)}>
                        {vehicles.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </select> */}
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