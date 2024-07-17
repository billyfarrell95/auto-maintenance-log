import '../../App.css';
import { useEffect, useState } from 'react';
import ItemsList from '../ItemsList/ItemsList';
import InputForm from '../InputForm/InputForm';
import testVehicles from '../../data/testVehicles';
import testShops from '../../data/testShops';
import testData from '../../data/testData';
import { Item, Shop, Vehicle } from '../../types';
import ManageShops from '../ManageShops/ManageShops';
import ManageVehicles from '../ManageVehicles/ManageVehicles';
import { datePickerCurrentDate } from '../../utils/formatters';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import auth from '../../firebase/firebase';

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

function DemoApp() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>(testData);
  const [archivedItems, setArchivedItems] = useState<Item[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>(testVehicles);
  const [archivedVehicles, setArchivedVehicles] = useState<Vehicle[]>([]);
  const [shops, setShops] = useState<Shop[]>(testShops);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(tabs.log);
  const [itemIsBeingEdited, setItemIsBeingEdited] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item>({ ...initialValues});
  const [isFormHidden, setIsFormHidden] = useState(false);


  const handleActiveTab = (tab: string) => {
      setActiveTab(tab)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigate('/app');
      }
    });

    return () => unsubscribe();
  }, [])

  return (
    <>
      <div>
        <Header />
        <main className="main-wrapper">
          <p className="pb-1">Welcome, Demo User!</p>
          <div className="tabs-wrapper">
            <button onClick={() => {handleActiveTab(tabs.log)}} className={`tabs-wrapper__tab-btn ${activeTab  === tabs.log ? ("active") : null}`}><i className="bi bi-card-text"></i> {tabs.log}</button>
            <button onClick={() => {handleActiveTab(tabs.vehicles)}} className={`tabs-wrapper__tab-btn ${activeTab  === tabs.vehicles ? ("active") : null}`}><i className="bi bi-car-front-fill"></i> {tabs.vehicles}</button>
            <button onClick={() => {handleActiveTab(tabs.shops)}} className={`tabs-wrapper__tab-btn ${activeTab  === tabs.shops ? ("active") : null}`}><i className="bi bi-shop-window"></i> {tabs.shops}</button>
          </div>
          {activeTab === tabs.log && (
            <section>
              <>
                {!isFormHidden ? (
                  <div className="pb-1">
                    <button onClick={() => setIsFormHidden(true)} className="mb-1 btn btn-sm btn-secondary form-toggle-btn"><i className="bi bi-arrows-collapse"></i> Hide form</button>
                    <InputForm
                      items={items}
                      setItems={setItems}
                      vehicles={vehicles}
                      shops={shops}
                      selectedItems={selectedItems}
                      currentItem={currentItem}
                      setCurrentItem={setCurrentItem}
                      handleActiveTab={handleActiveTab}
                      tabs={tabs} />
                  </div>
                ) : (
                  <div className="pb-1">
                    <button onClick={() => setIsFormHidden(false)} className="btn btn-sm btn-secondary form-toggle-btn"><i className="bi bi-plus-circle"></i> Add item</button>
                  </div>
                )}
                </>
                <>
                  {items.length ? (
                      <ItemsList
                        items={items}
                        setItems={setItems}
                        vehicles={vehicles}
                        shops={shops}
                        focusedItemId={focusedItemId}
                        setFocusedItemId={setFocusedItemId}
                        setSelectedItems={setSelectedItems}
                        selectedItems={selectedItems}
                        itemIsBeingEdited={itemIsBeingEdited}
                        setItemIsBeingEdited={setItemIsBeingEdited}
                      />
                  ) : (
                    <p className="py-1"><i>Nothing here...</i></p>
                  )}
                </>
            </section>
          )}
          {activeTab === tabs.vehicles && (
            <section>
              <ManageVehicles 
                vehicles={vehicles} 
                setVehicles={setVehicles} 
                items={items} 
                setItems={setItems} 
                archivedItems={archivedItems} 
                setArchivedItems={setArchivedItems}
                archivedVehicles={archivedVehicles}
                setArchivedVehicles={setArchivedVehicles} />
            </section>
          )}
        
          {activeTab === tabs.shops && (
            <section>
              <ManageShops shops={shops} setShops={setShops} />
            </section>
          )}
        </main>
      </div>
    </>
  );
}

export default DemoApp;