import { useState, useEffect } from 'react'
import './App.css'
import ItemsList from './components/ItemsList';
import InputForm from './components/InputForm';
import { Item } from './types';

function App() {
  // const [items, setItems] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>([
    {
      id: crypto.randomUUID(),
      "date": "2024-05-23",
      "vehicle": "Vehicle Three",
      "description": "Oil Change",
      "shop": "Shop name 123",
      "mileage": "123222",
      "memo": "Need new brakes next oil change"
    },
    {
      id: crypto.randomUUID(),
      "date": "2024-05-02",
      "vehicle": "Vehicle One",
      "description": "Tire rotation",
      "shop": "Shop name 123",
      "mileage": "126123",
      "memo": "Need new tires soon"
    },
    {
      id: crypto.randomUUID(),
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
  // const [isItemSelected, setIsItemSelected] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleShowInputForm = () => {
    setIsFormVisible(true)
  }

  const handleHideInputForm = () => {
    setIsFormVisible(false)
  }

  const handleDeleteItems = () => {
    const newArr = items.filter(item => !selectedItems.includes(item.id));
    setItems(newArr);
    setSelectedItems([]);
  };

  useEffect(() => {
    console.log("ALL ITEMS:", items)
  }, [items]);

  useEffect(() => {
    console.log("SELECTED ITEM QTY:", selectedItems.length);
  }, [selectedItems]);

  return (
    <>
      <h1>Auto Maintenance Log</h1>
      <button onClick={handleShowInputForm}>Add item</button>

      {isFormVisible && (
        <InputForm items={items} setItems={setItems} vehicles={vehicles} handleHideInputForm={handleHideInputForm} />
      )}

      <ItemsList
          items={items}
          setItems={setItems}
          vehicles={vehicles}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
        />

      {selectedItems.length > 0 && (
        <button onClick={handleDeleteItems}>Delete selected items ({selectedItems.length})</button>
      )}
    </>
  );
}

export default App;