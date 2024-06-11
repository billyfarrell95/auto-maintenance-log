import React, { useState } from 'react'
import './App.css'
import ItemsList from './components/ItemsList';
import InputForm from './components/InputForm';
import { Item, Shop, Vehicle } from './types';
import testData from './data/testData';
import ManageShops from './components/ManageShops';
import ManageVehicles from './components/ManageVehicles';

function App() {
  const tabs = {
    0: "Log",
    1: "Vehicles",
    2: "Shops"
  }
  // const [items, setItems] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>(testData);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [itemIsBeingEdited, setItemIsBeingEdited] = useState(false);

  const handleDeleteItems = () => {
    const newArr = items.filter(item => !selectedItems.includes(item.id));
    setItems(newArr);
    setSelectedItems([]);
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  }

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
          <InputForm items={items} setItems={setItems} vehicles={vehicles} shops={shops} selectedItems={selectedItems} />
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
              <button onClick={handleDeselectAll} disabled={itemIsBeingEdited}>Deselect all</button>
            </div>
          )}
        </div>
      )}

      {activeTab === tabs[1] && (
        <div>
          <ManageVehicles vehicles={vehicles} setVehicles={setVehicles} />
        </div>
      )}
      
      {activeTab === tabs[2] && (
        <div>
          <ManageShops shops={shops} setShops={setShops} />
        </div>
      )}
    </>
  );
}

export default App;