import React from 'react';

/**
 * Komponen label input yang fleksibel.
 * - Bisa menerima teks lewat prop `value` atau lewat `children`.
 * - Dapat dikombinasikan dengan atribut HTML standar (misal: htmlFor).
 */
export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label
            {...props}
            className={`block text-sm font-medium text-gray-700 ${className}`}
        >
            {value ? value : children}
        </label>
    );
}
