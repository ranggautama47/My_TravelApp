import React from 'react'

export default function select({ name, value, onChange, className, children, ...props}) {
  return (
     <select
            name={name}
            value={value}
            onChange={onChange}
            className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-xs ${className}`}
            {...props}
    >
            {children}
    </select>
  )
}

