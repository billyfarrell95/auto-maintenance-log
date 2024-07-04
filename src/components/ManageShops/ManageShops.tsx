import { useState, FormEvent } from "react";
import { Shop } from "../../types";
import "./ManageShops.css";
import auth from "../../firebase/firebase";
import { doc, collection, addDoc, query, where, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

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
        // @todo: improve validation against duplicate names
        if (newShopTrimmed.name && !shops.some(e => e.name.toLowerCase() === newShopTrimmed.name.toLowerCase())) {
            try {
                if (auth.currentUser) {
                    const userDocRef = doc(db, "users", auth?.currentUser?.uid);
                    const shopsCollectionRef = collection(userDocRef, 'shops');
                    await addDoc(shopsCollectionRef, newShopTrimmed)
                }
            } catch (error) {
                console.error("Error adding new shop to db", error)
            }
            setShops([...shops, newShopTrimmed]);
        } else {
            // @todo: input validation when shop name has been used
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
                // @todo: define type for "doc"
                querySnapshot.forEach((doc: any) => {
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
                    <p className="fs-small">Note: deleting shops will not remove them from your maintenance log, only from forms, filters, and this list.</p>
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