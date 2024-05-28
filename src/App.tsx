import { useState, useEffect } from 'react'
import './App.css'
import ItemsList from './components/ItemsList';
import InputForm from './components/InputForm';
import { Item } from './types';
import testData from './data/testData';

function App() {
  // const [items, setItems] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>(testData);
  const [vehicles, setVehicles] = useState(["Vehicle One", "Vehicle Two", "Vehicle Three"]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
      <p>Total items: {items.length}</p>
      <InputForm items={items} setItems={setItems} vehicles={vehicles} />

      <ItemsList
          items={items}
          setItems={setItems}
          vehicles={vehicles}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
        />

      {selectedItems.length > 0 && (
        <div>
          <button onClick={handleDeleteItems}>Delete selected items ({selectedItems.length})</button>
          <button onClick={() => setSelectedItems([])}>Deselect All</button>
        </div>
      )}
    </>
  );
}

export default App;