import { Item } from "../types";
import "./ItemList.css"
  
interface ItemsListProps {
    items: Item[];
    selectedItems: number[];
    vehicles: string[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;  
    setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;  
    setIsItemSelected: React.Dispatch<React.SetStateAction<boolean>>;  
}

function ItemsList({ items, vehicles, setItems, setIsItemSelected, selectedItems, setSelectedItems }: ItemsListProps) {
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

    const handleItemSelect = (index: number) => {
        const selectedIndex = selectedItems.indexOf(index);
        let updatedSelection: number[];

        if (selectedIndex === -1) {
            updatedSelection = [...selectedItems, index];
        } else {
            updatedSelection = [...selectedItems.slice(0, selectedIndex), ...selectedItems.slice(selectedIndex + 1)];
        }

        setSelectedItems(updatedSelection);
        setIsItemSelected(true);
    }
 
    return (
        <>
            {sortedItems.map((item, index) => ( 
                <div key={index} className="data-item">
                    <input 
                        type="checkbox" 
                        checked={selectedItems.includes(index)} 
                        onClick={() => handleItemSelect(index)}
                        onChange={() => {}}
                    />
                    <select name={`vehicle-${index}`} value={item.vehicle} onChange={(e) => handleChange(e, index)}  >
                        {vehicles.map((vehicle, vIndex) => (
                            <option key={vIndex} value={vehicle}>{vehicle}</option>
                        ))}
                    </select>
                    <input type="date" value={item.date} name={`date-${index}`} onChange={(e) => handleChange(e, index)}  />
                    <input type="text" value={item.description} name={`description-${index}`} onChange={(e) => handleChange(e, index)}  />
                    <input type="text" value={item.shop} name={`shop-${index}`} onChange={(e) => handleChange(e, index)}  />
                    <input type="text" value={item.mileage} name={`mileage-${index}`} onChange={(e) => handleChange(e, index)}  />
                    <input type="text" value={item.memo} name={`memo-${index}`} onChange={(e) => handleChange(e, index)}  />
                </div>
            ))}
        </>
        );
    }
  
export default ItemsList;