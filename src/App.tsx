import { useState, useEffect } from 'react'
import './App.css'
import ItemsList from './components/ItemsList';
import InputForm from './components/InputForm';
import { Item } from './types';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [vehicles, setVehicles] = useState(["Vehicle One", "Vehicle Two", "Vehicle Three"]);

  useEffect(() => {
    console.log("All Items:", items);
  }, [items]);

  return (
    <>
      <InputForm items={items} setItems={setItems} vehicles={vehicles} />
      <ItemsList items={items} />
    </>
  );
}

export default App;