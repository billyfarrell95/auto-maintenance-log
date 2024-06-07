import React, { useState } from 'react'
import './App.css'
import ItemsList from './components/ItemsList';
import InputForm from './components/InputForm';
import { Item, Shop } from './types';
import testData from './data/testData';
import AddShopForm from './components/AddShopForm';

function App() {
  const tabs = {
    0: "Log",
    1: "Vehicles",
    2: "Shops"
  }
  // const [items, setItems] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>(testData);
  const [vehicles, setVehicles] = useState([{id: crypto.randomUUID(), name: "Vehicle One"}, {id: crypto.randomUUID(), name: "Vehicle Two"}, {id: crypto.randomUUID(), name: "Vehicle Three"}]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [itemIsBeingEdited, setItemIsBeingEdited] = useState(false);

  const handleDeleteItems = () => {
    const newArr = items.filter(item => !selectedItems.includes(item.id));
    setItems(newArr);
    setSelectedItems([]);
  };

  const handleActiveTab = (tab: string, e: React.MouseEvent) => {
    setActiveTab(tab)
  }

  return (
    <>
      <h1>Auto Maintenance Log</h1>
      <button onClick={(e) => {handleActiveTab(tabs[0], e)}}>{tabs[0]}</button>
      <button onClick={(e) => {handleActiveTab(tabs[1], e)}} disabled={itemIsBeingEdited}>{tabs[1]}</button>
      <button onClick={(e) => {handleActiveTab(tabs[2], e)}} disabled={itemIsBeingEdited}>{tabs[2]}</button>
      {activeTab === tabs[0] && (
        <div>
          <InputForm items={items} setItems={setItems} vehicles={vehicles} shops={shops} />
          {items.length ? (
              <ItemsList
                items={items}
                setItems={setItems}
                vehicles={vehicles}
                // shops={shops}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                itemIsBeingEdited={itemIsBeingEdited}
                setItemIsBeingEdited={setItemIsBeingEdited}
              />
          ) : (
            <p><i>Nothing here...</i></p>
          )}
    
          {selectedItems.length > 0 && (
            <div>
              <button onClick={handleDeleteItems} disabled={itemIsBeingEdited}>Delete selected items ({selectedItems.length})</button>
            </div>
          )}
        </div>
      )}

      {activeTab === tabs[1] && (
        <div>
          Vehicles tabs
        </div>
      )}
      
      {activeTab === tabs[2] && (
        <div>
          <AddShopForm shops={shops} setShops={setShops} />
        </div>
      )}
    </>
  );
}

export default App;