import { useState, useEffect } from 'react'
import './App.css'
import ItemsList from './components/ItemsList';
import InputForm from './components/InputForm';
import { Item } from './types';

function App() {
  // const [items, setItems] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>([
    {
        "date": "2024-05-23",
        "vehicle": "Vehicle Three",
        "description": "Oil Change",
        "shop": "Shop name 123",
        "mileage": "123222",
        "memo": "Need new brakes next oil change"
    },
    {
        "date": "2024-05-02",
        "vehicle": "Vehicle One",
        "description": "Tire rotation",
        "shop": "Shop name 123",
        "mileage": "126123",
        "memo": "Need new tires soon"
    },
    {
        "date": "2023-05-02",
        "vehicle": "Vehicle Two",
        "description": "New brakes",
        "shop": "Shop name 123",
        "mileage": "126123",
        "memo": "Replace air filter soon"
    }
  ]);
  const [vehicles, setVehicles] = useState(["Vehicle One", "Vehicle Two", "Vehicle Three"]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleShowInputForm = () => {
    setIsFormVisible(true)
  }

  const handleHideInputForm = () => {
    setIsFormVisible(false)
  }

  // @todo: fix - there is an issue when deleting, where the expected item isn't what is deleted
  const handleDeleteItems = (selectedItemIndexes: number[]) => {
    const newArr = items.filter((_, index) => !selectedItemIndexes.includes(index));
    setItems(newArr);
    setSelectedItems([]);
  }

  useEffect(() => {
    console.log("ALL ITEMS:", items)
  }, [items]);

  useEffect(() => {
    console.log("SELECTED ITEM QTY:", selectedItems.length);
  }, [selectedItems]);

  return (
    <>
      <button onClick={handleShowInputForm}>Add item</button>

      {isFormVisible && (
        <InputForm items={items} setItems={setItems} vehicles={vehicles} handleHideInputForm={handleHideInputForm} />
      )}

      <ItemsList items={items}
        setItems={setItems} 
        vehicles={vehicles} 
        setIsItemSelected={setIsItemSelected}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        />

      {selectedItems.length > 0 && (
        <button onClick={() => {handleDeleteItems(selectedItems)}}>Delete selected ({selectedItems.length})</button>
      )}
    </>
  );
}

export default App;