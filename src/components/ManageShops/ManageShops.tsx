import { useState, FormEvent } from "react";
import { Shop } from "../../types";
import "./ManageShops.css";
import auth from "../../firebase/firebase";
import { doc, collection, query, where, deleteDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

// @todo setup to work with demo

interface ManageShopsProps {
    shops: Shop[];
    setShops: React.Dispatch<React.SetStateAction<Shop[]>>;
}

const initialValues: Shop = {
    id: "",
    name: ""
};

function ManageShops({ shops, setShops }: ManageShopsProps) {
    const [newShop, setNewShop] = useState<Shop>({ ...initialValues });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const shop = {
            ...newShop,
            name: value
        }
        setNewShop(shop)
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newShopTrimmed = {
            ...newShop,
            name: newShop.name.trim(),
            id: crypto.randomUUID()
        }
        if (newShopTrimmed.name && !shops.some(e => e.name.toLowerCase() === newShopTrimmed.name.toLowerCase())) {
            try {
                if (auth.currentUser) {
                    const userDocRef = doc(db, "users", auth?.currentUser?.uid);
                    const shopsCollectionRef = collection(userDocRef, 'shops');
                    // setDoc rather than addDoc so that Doc can have custom ID (shop ID)
                    await setDoc(doc(shopsCollectionRef, newShopTrimmed.id), newShopTrimmed);
                }
            } catch (error) {
                console.error("Error adding new shop to db", error)
            }
            setShops([...shops, newShopTrimmed]);
        } else {
            alert('Shop name already used.');
        }
        setNewShop({...initialValues});
    }

    const handleDeleteShop = async (id: string) => {
        const updatedShops = shops.filter((shop, _) => shop.id !== id);
        setShops(updatedShops)
        try {
            if (auth.currentUser) {
                const userDocRef = doc(db, "users", auth?.currentUser?.uid);
                const shopsCollectionRef = collection(userDocRef, 'shops');
                const q = query(shopsCollectionRef, where("id", "==", id))

                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    deleteDoc(doc.ref);
                });
            }
        } catch (error) {
            console.error("Error deleting shop from db", error)
        }
    }

    return (
        <>
            <h2>Manage your shops</h2>
            <p>Add shops for quick access when adding maintenance items.</p>
            <form onSubmit={(e) => {handleSubmit(e)}} className="shops-form">
                <div>
                    <label htmlFor="addShop">Add a shop</label>
                    <input id="addShop" type="text" onChange={handleChange} value={newShop.name} placeholder="Shop name" required />
                </div>
                <div className="align-self-flex-end"><button type="submit" className="btn btn-primary">Add</button></div>
            </form>
            <p className="fs-small pb-1"><i className="bi bi-info-circle"></i> Deleting shops removes the option to use them in forms, but the shop name remains associated with the maintenance item.</p>
            {shops.length > 0 ? (
                <div>
                    <div className="shops-list-wrapper pb-1">
                        <ul className="shops-list-wrapper__list" role="list">
                        {shops.map((shop) => (
                            <li key={shop.id} className="shops-list-wrapper__item">
                                {shop.name}
                                <div>
                                    <button onClick={() => handleDeleteShop(shop.id)} className="btn btn-sm btn-outline-danger"><i className="bi bi-trash3"></i></button>
                                </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="shops-list-wrapper">
                    <p><i>No saved shops</i></p>
                </div>
            )}
        </>
    )
}

export default ManageShops;