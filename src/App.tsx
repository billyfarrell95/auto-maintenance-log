import { useState } from 'react'
import './App.css'
import ItemsList from './components/ItemsList';
import InputForm from './components/InputForm';
import { Item, Shop, Vehicle } from './types';
import testData from './data/testData';
import ManageShops from './components/ManageShops';
import ManageVehicles from './components/ManageVehicles';

function App() {
  const tabs = {
    log: "Log",
    vehicles: "Vehicles",
    shops: "Shops"
  }
  // const [items, setItems] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>(testData);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(tabs.log);
  const [itemIsBeingEdited, setItemIsBeingEdited] = useState(false);

  const handleDeleteItems = () => {
    const newArr = items.filter(item => !selectedItems.includes(item.id));
    setItems(newArr);
    setSelectedItems([]);
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  }

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <>
      <h1>Auto Maintenance Log</h1>
      <button onClick={() => {handleActiveTab(tabs.log)}}>{tabs.log}</button>
      <button onClick={() => {handleActiveTab(tabs.vehicles)}} disabled={itemIsBeingEdited}>{tabs.vehicles} ({vehicles.length})</button>
      <button onClick={() => {handleActiveTab(tabs.shops)}} disabled={itemIsBeingEdited}>{tabs.shops} ({shops.length})</button>
      {activeTab === tabs.log && (
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
            <div className="buttons-bar">
              <button onClick={handleDeleteItems} disabled={itemIsBeingEdited}>Delete selected items ({selectedItems.length})</button>
              <button onClick={handleDeselectAll} disabled={itemIsBeingEdited}>Deselect all</button>
            </div>
          )}
        </div>
      )}

      {activeTab === tabs.vehicles && (
        <div>
          <ManageVehicles vehicles={vehicles} setVehicles={setVehicles} />
        </div>
      )}
      
      {activeTab === tabs.shops && (
        <div>
          <ManageShops shops={shops} setShops={setShops} />
        </div>
      )}
    </>
  );
}

export default App;