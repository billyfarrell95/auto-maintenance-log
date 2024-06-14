import { ChangeEvent } from "react";

interface InputProps {
    itemId: string;
    handleChange: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
    defaultValue: string,
    type: string,
    name: string
}

function ItemsListInput({ itemId, handleChange, defaultValue, type, name }: InputProps) {
    return (
        <>
            <input
                className="data-item__input"
                type={type}
                defaultValue={defaultValue}
                name={`${name}-${itemId}`}
                onChange={(e) => handleChange(e, itemId)}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.target.select()} />
        </>
    )
}

export default ItemsListInput;