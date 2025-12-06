import React from "react";

export default function Input({ label, name, type = "text", className = "", error, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="text-gray-600 text-sm">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className={`w-full px-4 py-2 border text-sm rounded-md focus:outline-hidden focus:ring-0 bg-white text-gray-700 focus:border-gray-200 border-gray-200 ${className}`}
        {...props}
      />
      {error && <small className="text-xs text-red-500">{error}</small>}
    </div>
  );
}
