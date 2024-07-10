import { useEffect, useState } from 'react'
import './App.css'
import ItemsList from './components/ItemsList/ItemsList';
import InputForm from './components/InputForm/InputForm';
import { Item, Shop, Vehicle } from './types';
import ManageShops from './components/ManageShops/ManageShops';
import ManageVehicles from './components/ManageVehicles/ManageVehicles';
import { datePickerCurrentDate } from './utils/formatters';
import Header from './components/Header/Header';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import auth from './firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

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
  const [user, setUser] = useState(false);
  const [isUserNew, setIsUserNew] = useState(Boolean);
  const [items, setItems] = useState<Item[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(tabs.log);
  const [itemIsBeingEdited, setItemIsBeingEdited] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item>({ ...initialValues});
  const [isFormHidden, setIsFormHidden] = useState(false);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  const checkIfUserExists = async () => {
    try {
        const collectionRef = collection(db, "users");
        const q = query(collectionRef, where('userId', 'in', [auth?.currentUser?.uid]));

        const docSnap = await getDocs(q)
        if (docSnap.empty) {
          setIsUserNew(true)
          uploadNewUser()
        } else {
          setIsUserNew(false)
        }
    } catch (error) {
        console.error("Error checking if user exists", error)
    }
}

  const uploadNewUser = async () => {
    if (auth.currentUser?.uid) {
      const newUserUpload = {
          userId: auth?.currentUser?.uid,
          email: auth?.currentUser?.email,
          name: auth?.currentUser?.displayName,
      }
      
      try {
          const userRef = doc(db, "users", auth?.currentUser?.uid)
          await setDoc(userRef, newUserUpload);
      } catch (error) {
          console.error("Error uploading new user", error)
      }
    }
}

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (user && auth.currentUser) {
        setUser(true)
        checkIfUserExists()
        setLoading(false)
      } else {
        navigate("/login")
        setUser(false)
      } 
    })

    return () => unsubscribe();
  }, [user])

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab)
  }

  useEffect(() => {
    if (auth?.currentUser?.uid && user) {
      const userDocRef = doc(db, 'users', auth?.currentUser?.uid);
      const itemsCollectionRef = collection(userDocRef, 'items');
      const shopsCollectionRef = collection(userDocRef, 'shops');
      const vehiclesCollectionRef = collection(userDocRef, 'vehicles');

      const fetchUserData = async () => {
        try {
          
          const itemsSnapshot = await getDocs(itemsCollectionRef);
          const shopsSnapshot = await getDocs(shopsCollectionRef);
          const vehiclesSnapshot = await getDocs(vehiclesCollectionRef);
          let itemsData: Item[] = [];
          let shopsData: Shop[] = [];
          let vehiclesData: Vehicle[] = [];
      
          itemsSnapshot.forEach(doc => {
            const data = doc.data();
            const item: Item = {
              id: doc.id,
              date: data.date,
              vehicle: data.vehicle,
              cost: data.cost,
              description: data.description,
              shop: data.shop,
              mileage: data.mileage,
              memo: data.memo,
            };
            itemsData.push(item);
          });

          shopsSnapshot.forEach(doc => {
            const data = doc.data();
            const shop: Shop = {
              id: doc.id,
              name: data.name
            };
            shopsData.push(shop);
          });

          vehiclesSnapshot.forEach(doc => {
            const data = doc.data();
            const vehicle: Vehicle = {
              id: doc.id,
              name: data.name
            };
            vehiclesData.push(vehicle);
          });
      
          setItems(itemsData);
          setShops(shopsData);
          setVehicles(vehiclesData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchUserData()
    }
  }, [user]);  

  return (
    <>
      {!loading ? (
        <div>
        <Header />
        <main className="main-wrapper">
          {isUserNew ? (<p className="pb-1">Welcome, {auth?.currentUser?.displayName}!</p>) : (<p className="pb-1">Welcome back, {auth?.currentUser?.displayName}!</p>)}
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
                      handleActiveTab={handleActiveTab} />
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
              <ManageVehicles vehicles={vehicles} setVehicles={setVehicles} items={items} setItems={setItems} />
            </section>
          )}
        
          {activeTab === tabs.shops && (
            <section>
              <ManageShops shops={shops} setShops={setShops} />
            </section>
          )}
        </main>
      </div>
      ) : (
        <main className="main-wrapper">
          Loading...
        </main>
      )}
    </>
  );
}

export default App;