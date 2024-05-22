import { useState, useEffect } from 'react'
import './App.css'
import ItemsList from './components/ItemsList';
import InputForm from './components/InputForm';
import { Item } from './types';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [vehicles, setVehicles] = useState(["Vehicle One", "Vehicle Two", "Vehicle Three"]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    console.log("All Items:", items);
  }, [items]);

  const handleShowInputForm = () => {
    setIsFormVisible(true)
  }

  const handleHideInputForm = () => {
    setIsFormVisible(false)
  }

  return (
    <>
      <button onClick={handleShowInputForm}>Add item</button>
      {isFormVisible && (
        <InputForm items={items} setItems={setItems} vehicles={vehicles} handleHideInputForm={handleHideInputForm} />
      )}
      <ItemsList items={items} setItems={setItems} vehicles={vehicles}  />
    </>
  );
}

export default App;