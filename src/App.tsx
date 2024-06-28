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
  const [items, setItems] = useState<Item[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  // const [items, setItems] = useState<Item[]>(testData);
  // const [vehicles, setVehicles] = useState<Vehicle[]>(testVehicles);
  // const [shops, setShops] = useState<Shop[]>(testShops);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(tabs.log);
  const [itemIsBeingEdited, setItemIsBeingEdited] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item>({ ...initialValues});
  const navigate = useNavigate()

  const logout = () => {
    auth.signOut()
  }

  const checkIfUserExists = async (userId: string) => {
    try {
        const collectionRef = collection(db, "users");
        // const finalData = [];
        const q = query(collectionRef, where('userId', 'in', [userId]));

        const docSnap = await getDocs(q)
        if (docSnap.empty) {
          uploadNewUser(userId)
        } else {
          return true
        }
    } catch (error) {
        console.error("Error checking if user exists", error)
    }
}

  const uploadNewUser = async (currentUser: any) => {
    const docName = currentUser.uid;
    const newUserUpload = {
        userId: currentUser.uid,
        email: currentUser.email,
        name: currentUser.displayName,
        logItems: null,
        vehicles: null,
        shops: null,
    }
    try {
        const document = doc(db, "users", docName)
        await setDoc(document, newUserUpload)
    } catch (error) {
        console.error("Error uploading new user", error)
    }
}

  useEffect(() => {
    console.log("USER TRUE/FALSE:", user)
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (user && auth.currentUser) {
        setUser(true)
        checkIfUserExists(auth.currentUser.uid)
      } else {
        navigate("/login")
        setUser(false)
      } 
    })
  }, [user])

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <>
      {!user ? (
        <div>
          <button onClick={() => {navigate("/login")}}>Log in</button>
        </div>
      ) : (
        <div>
          <h1>Auto Maintenance Log</h1>
          <button onClick={logout}>Sign out</button>
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
        </div>
      )}
    </>
  );
}

export default App;