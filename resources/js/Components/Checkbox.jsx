import React from 'react';

const Checkbox = ({ label, value, onChange, checked, ...props }) => {
    const handleChange = (e) => {
        if (onChange) {
            // kirim event ke parent dengan value dan checked status
            onChange({
                target: {
                    value,
                    checked: e.target.checked
                }
            });
        }
    };

    return (
        <label className="flex items-center space-x-2 cursor-pointer">
            <input
                type="checkbox"
                value={value}
                checked={checked}
                onChange={handleChange}   // ✅ gunakan handleChange
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                {...props}
            />
            <span className="text-sm text-gray-700">{label}</span>
        </label>
    );
};

export default Checkbox;
