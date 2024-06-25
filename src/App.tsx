import { useEffect, useState } from 'react'
import './App.css'
import ItemsList from './components/ItemsList/ItemsList';
import InputForm from './components/InputForm/InputForm';
import { Item, Shop, Vehicle } from './types';
import testData from './data/testData';
import ManageShops from './components/ManageShops/ManageShops';
import ManageVehicles from './components/ManageVehicles/ManageVehicles';
import { datePickerCurrentDate } from './utils/formatters';
import testVehicles from "./data/testVehicles";
import testShops from "./data/testShops";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


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

export const tabs = {
  log: "Log",
  vehicles: "Vehicles",
  shops: "Shops"
}

function App() {
  const [user, setUser] = useState(false)
  // const [items, setItems] = useState<Item[]>([]);
  // const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  // const [shops, setShops] = useState<Shop[]>([]);
  const [items, setItems] = useState<Item[]>(testData);
  const [vehicles, setVehicles] = useState<Vehicle[]>(testVehicles);
  const [shops, setShops] = useState<Shop[]>(testShops);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(tabs.log);
  const [itemIsBeingEdited, setItemIsBeingEdited] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item>({ ...initialValues});

  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      console.log(user)
      if (user) {
        console.log("logged in")
        setUser(true)
      } else {
        console.log("logged out")
        setUser(false)
        navigate("/login")
      }
      setUser(false)
    })
  }, [user])

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <>
      {/* {!user && (
        <Navigate to="/login"></Navigate>
      )} */}
      <h1>Auto Maintenance Log</h1>
      <div className="tabs-wrapper">
        <button onClick={() => {handleActiveTab(tabs.log)}} className={`tabs-wrapper__tab-btn ${activeTab  === tabs.log ? ("active") : null}`}><i className="bi bi-card-text"></i> {tabs.log}</button>
        <button onClick={() => {handleActiveTab(tabs.vehicles)}} className={`tabs-wrapper__tab-btn ${activeTab  === tabs.vehicles ? ("active") : null}`}><i className="bi bi-car-front-fill"></i> {tabs.vehicles}</button>
        <button onClick={() => {handleActiveTab(tabs.shops)}} className={`tabs-wrapper__tab-btn ${activeTab  === tabs.shops ? ("active") : null}`}><i className="bi bi-shop-window"></i> {tabs.shops}</button>
      </div>
      {activeTab === tabs.log && (
        <div>
          <section>
            <InputForm 
              items={items} 
              setItems={setItems} 
              vehicles={vehicles} 
              shops={shops} 
              selectedItems={selectedItems} 
              currentItem={currentItem} 
              setCurrentItem={setCurrentItem} 
              handleActiveTab={handleActiveTab} />
            </section>
            <div>
              {items.length ? (
                  <ItemsList
                    items={items}
                    setItems={setItems}
                    vehicles={vehicles}
                    focusedItemId={focusedItemId}
                    setFocusedItemId={setFocusedItemId}
                    setSelectedItems={setSelectedItems}
                    selectedItems={selectedItems}
                    itemIsBeingEdited={itemIsBeingEdited}
                    setItemIsBeingEdited={setItemIsBeingEdited}
                  />
              ) : (
                <p><i>Nothing here...</i></p>
              )}
            </div>
        </div>
      )}

      {activeTab === tabs.vehicles && (
        <section>
          <ManageVehicles vehicles={vehicles} setVehicles={setVehicles} />
        </section>
      )}
      
      {activeTab === tabs.shops && (
        <section>
           <ManageShops shops={shops} setShops={setShops} />
        </section>
      )}
    </>
  );
}

export default App;