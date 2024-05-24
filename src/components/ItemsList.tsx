import { Item } from "../types";
import "./ItemList.css"
  
interface ItemsListProps {
    items: Item[];
    selectedItems: string[];
    vehicles: string[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  }

function ItemsList({ items, vehicles, setItems, selectedItems, setSelectedItems }: ItemsListProps) {
    const sortByDate = (a: Item, b: Item) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>, id: string) => {
        const { name, value } = e.target;
        const updatedItems = items.map(item => item.id === id ? { ...item, [name.split('-')[0]]: value } : item);
        setItems(updatedItems);
    };

    const handleItemSelect = (id: string) => {
        setSelectedItems(prevSelected => {
          if (prevSelected.includes(id)) {
            return prevSelected.filter(itemId => itemId !== id);
          } else {
            return [...prevSelected, id];
          }
        });
    };

    return (    
        <>
            {items.sort(sortByDate).map((item) =>( 
                <div key={item.id} className="data-item">
                    <input 
                        type="checkbox" 
                        checked={selectedItems.includes(item.id)} 
                        onClick={() => handleItemSelect(item.id)}
                        onChange={() => {}}
                    />
                    <select name={`vehicle-${item.id}`} value={item.vehicle} onChange={(e) => handleChange(e, item.id)}  >
                        {vehicles.map((vehicle, vIndex) => (
                            <option key={vIndex} value={vehicle}>{vehicle}</option>
                        ))}
                    </select>
                    <input type="date" value={item.date} name={`date-${item.id}`} onChange={(e) => handleChange(e, item.id)} />
                    <input type="text" value={item.description} name={`description-${item.id}`} onChange={(e) => handleChange(e, item.id)} />
                    <input type="text" value={item.shop} name={`shop-${item.id}`} onChange={(e) => handleChange(e, item.id)} />
                    <input type="text" value={item.mileage} name={`mileage-${item.id}`} onChange={(e) => handleChange(e, item.id)} />
                    <input type="text" value={item.memo} name={`memo-${item.id}`} onChange={(e) => handleChange(e, item.id)} />
                </div>
            ))}
        </>
        );
    }
  
export default ItemsList;