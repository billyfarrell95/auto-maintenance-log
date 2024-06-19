import { useState, FormEvent } from "react";
import { Shop } from "../../types";
import "./ManageShops.css"

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
            id: crypto.randomUUID(),
            name: value
        }
        setNewShop(shop)
        console.log("Shops,value", shops, value)
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newShopTrimmed = {
            ...newShop,
            name: newShop.name.trim()
        }
        if (newShopTrimmed.name) {
            setShops([...shops, newShopTrimmed]);
        }
        setNewShop({...initialValues});
    }

    const handleDeleteShop = (id: string) => {
        const updatedShops = shops.filter((shop, _) => shop.id !== id);
        setShops(updatedShops)
    }

    return (
        <>
            <h2>Manage your shops</h2>
            <form onSubmit={(e) => {handleSubmit(e)}} className="shops-form">
                <label htmlFor="addShop">Add a shop</label>
                <input id="addShop" type="text" onChange={handleChange} value={newShop.name} placeholder="Shop name" required />
                <button type="submit">Add</button>
            </form>
            {shops.length > 0 ? (
                <div>
                    <ul className="shops-list" role="list">
                    {shops.map((shop) => (
                        <li key={shop.id}>
                            <p>{shop.name} </p>
                            <button onClick={() => handleDeleteShop(shop.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
                </div>
            ) : (
                <p><i>No saved shops</i></p>
            )}
        </>
    )
}

export default ManageShops;