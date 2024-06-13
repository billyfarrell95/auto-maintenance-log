interface InputProps {
    itemId: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    handleFocus: () => void;
    defaultValue: string,
    type: string,
    name: string
}

function ItemsListInput({ itemId, handleChange, handleFocus, defaultValue, type, name }: InputProps) {
    return (
        <>
            <input
                className="data-item__input"
                type={type}
                defaultValue={defaultValue}
                name={`${name}-${itemId}`}
                onChange={(e) => handleChange(e, itemId)}
                onFocus={() => handleFocus()}
                onClick={(e) => e.stopPropagation()} />
        </>
    )
}

export default ItemsListInput;