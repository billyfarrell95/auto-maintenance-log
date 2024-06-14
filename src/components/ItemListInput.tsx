import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface InputProps {
    itemId: string;
    handleChange: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
    defaultValue: string,
    type: string,
    name: string,
    setItemIsBeingEdited: Dispatch<SetStateAction<boolean>>,
    setEditingItemId: Dispatch<SetStateAction<string>>,
}

function ItemsListInput({ itemId, handleChange, defaultValue, type, name, setItemIsBeingEdited, setEditingItemId }: InputProps) {
    const handleFocus = (e: ChangeEvent<HTMLInputElement>, id: string) => {
        e.target.select();
        setEditingItemId(id);
        setItemIsBeingEdited(true)
    }

    return (
        <>
            <input
                className="data-item__input"
                type={type}
                defaultValue={defaultValue}
                name={`${name}-${itemId}`}
                onChange={(e) => handleChange(e, itemId)}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => handleFocus(e, itemId)} />
        </>
    )
}

export default ItemsListInput;