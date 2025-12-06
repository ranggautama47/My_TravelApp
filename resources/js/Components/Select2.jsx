import React from "react"

import Select from "react-select"

export default function Select2({options,onChange,placeholder,defaultOptions}) {
    // custom styles
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#4CAF50' : '#CCC', // Warna border saat fokus
            boxShadow: state.isFocused ? '0 0 5px rgba(76, 175, 80, 0.5)' :'none',
            outLine: 'none', // Menghilangkan garis biru
            '&:hover': {
                borderColor: '#4CAF50', // Warna border saat hover
            },
        }),
    };
  return (
    <Select
        options={options}
        onChange={onChange}
        className="basic-multi-select"
        defaultValue={defaultOptions || null} // set nilai default
        classNamePrefix="select"
        placeholder={placeholder || "pilih opsi..." }
        isMulti //Aktifan fitur multiple select
        styles={customStyles}
    />
  )
}
