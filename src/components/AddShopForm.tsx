// import { useState, FormEvent } from "react";
// import { Shop } from "../types";

// interface AddShopFormProps {
//     shops: Shop[];
//     setShops: React.Dispatch<React.SetStateAction<Shop[]>>;
// }

// function AddShopForm({ shops }: AddShopFormProps) {
//     const [shop, setShop] = useState("");

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value.trim();
//         setShop(value)
//     };

//     const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//         setShops([...current, shop])
//         e.preventDefault();
//     }

//     return (
//         <form onSubmit={(e) => {handleSubmit(e)}} >
//             <input type="text" onChange={handleChange} value={shop} />
//             <button type="submit">Add</button>
//         </form>
//     )
// }

// export default AddShopForm;