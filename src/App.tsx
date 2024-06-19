import { useState } from 'react'
import './App.css'
import ItemsList from './components/ItemsList';
import InputForm from './components/InputForm';
import { Item, Shop, Vehicle } from './types';
import testData from './data/testData';
import ManageShops from './components/ManageShops';
import ManageVehicles from './components/ManageVehicles';
import { datePickerCurrentDate } from './utils/formatters';

export const initialValues: Item = {
  id: "",
  date: datePickerCurrentDate(),
  vehicle: "",
  cost: "",
  description: "",
  shop: "",
  mileage: "",
  memo: "",
};

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
  const [currentItem, setCurrentItem] = useState<Item>({ ...initialValues});

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
          <InputForm items={items} setItems={setItems} vehicles={vehicles} shops={shops} selectedItems={selectedItems} currentItem={currentItem} setCurrentItem={setCurrentItem} />
          {items.length ? (
              <ItemsList
                items={items}
                setItems={setItems}
                vehicles={vehicles}

                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                itemIsBeingEdited={itemIsBeingEdited}
                setItemIsBeingEdited={setItemIsBeingEdited}
              />
          ) : (
            <p><i>Nothing here...</i></p>
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