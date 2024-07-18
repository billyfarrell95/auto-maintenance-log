import { ChangeEvent, Dispatch, SetStateAction } from "react";

type InputModes = 'email' | 'search' | 'tel' | 'text' | 'url' | 'none' | 'numeric' | undefined;
interface InputProps {
    itemId: string;
    handleChange: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
    value: string,
    type: string,
    name: string,
    setItemIsBeingEdited: Dispatch<SetStateAction<boolean>>,
    setEditingItemId: Dispatch<SetStateAction<string>>,
    placeholder: string,
    inputMode: InputModes
}

function ItemsListInput({ itemId, handleChange, value, type, name, setItemIsBeingEdited, setEditingItemId, placeholder, inputMode }: InputProps) {
    const handleFocus = (e: ChangeEvent<HTMLInputElement>, id: string) => {
        e.target.select();
        setEditingItemId(id);
        setItemIsBeingEdited(true);
    }

    return (
        <>
            <div className="data-item__display">
                <div><label>{placeholder}</label></div>
                <input
                    className="data-item__input"
                    type={type}
                    value={value}
                    inputMode={inputMode}
                    name={`${name}-${itemId}`}
                    onChange={(e) => handleChange(e, itemId)}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => handleFocus(e, itemId)}
                    placeholder={placeholder} />
            </div>
        </>
    )
}

export default ItemsListInput;