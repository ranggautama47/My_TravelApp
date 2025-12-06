import React, { useState } from "react";

export default function Dropdown({
    options,
    value,
    onChange,
    placeholder = "Urutkan berdasarkan",
}) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
    };



  return (
    <div className="relative inline-block min-w-32">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white text-gray-600 hover:cursor-pointer hover:bg-gray-100 font-medium py-2 px-4 rounded-lg border"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <i className="bi bi-chevron-down ml-2"></i>
      </button>

      {isOpen && (
        <ul className="absolute z-20 mt-2 w-full bg-white rounded-lg border py-2 text-left">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium text-sm text-gray-600"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

}
