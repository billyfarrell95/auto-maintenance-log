import { useEffect, useRef } from 'react';

export enum CHECKBOX_STATES {
    Checked = 'checked',
    Empty = 'empty',
    Indeterminate = 'indeterminate',
}

interface CheckboxProps {
    label: string;
    value: CHECKBOX_STATES;
    onChange: () => void;
    disabled: boolean
}

function Checkbox({ label, value, onChange, disabled }: CheckboxProps) {
    const checkboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (checkboxRef.current) {
            if (value === CHECKBOX_STATES.Checked) {
                checkboxRef.current.checked = true;
                checkboxRef.current.indeterminate = false;
            } else if (value === CHECKBOX_STATES.Empty) {
                checkboxRef.current.checked = false;
                checkboxRef.current.indeterminate = false;
            } else if (value === CHECKBOX_STATES.Indeterminate) {
                checkboxRef.current.checked = false;
                checkboxRef.current.indeterminate = true;
            }
        }
    }, [value]);

    return (
        <label>
            <input
                ref={checkboxRef}
                type="checkbox"
                checked={value === CHECKBOX_STATES.Checked}
                onChange={onChange}
                disabled={disabled}
            />
            {label}
        </label>
    );
}

export default Checkbox;
