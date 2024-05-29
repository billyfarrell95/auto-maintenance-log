
interface ItemListInputProps {
    inputType: string,
    inputValue: string,
    inputName: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    onFocus: React.FocusEventHandler<HTMLInputElement>,
    onClick: React.MouseEventHandler<HTMLInputElement>,
}

function ItemListInput({ inputType, inputValue, inputName, onChange, onFocus, onClick }: ItemListInputProps) {
    return (
        <input
            type={inputType}
            value={inputValue}
            name={inputName}
            onChange={onChange}
            onFocus={onFocus}
            onClick={onClick}
        />
    )
}

export default ItemListInput