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
        if (newShopTrimmed.name && !shops.some(e => e.name.toLowerCase() === newShopTrimmed.name.toLowerCase())) {
            setShops([...shops, newShopTrimmed]);
        } else {
            console.log("Shop name already used.")
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
                <div>
                    <label htmlFor="addShop">Add a shop</label>
                    <input id="addShop" type="text" onChange={handleChange} value={newShop.name} placeholder="Shop name" required />
                </div>
                <div className="align-self-flex-end"><button type="submit" className="btn btn-primary">Add</button></div>
            </form>
            {shops.length > 0 ? (
                <div className="shops-list-wrapper">
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
            ) : (
                <div className="shops-list-wrapper">
                    <p><i>No saved shops</i></p>
                </div>
            )}
        </>
    )
}

export default ManageShops;