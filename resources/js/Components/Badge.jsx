import React from "react";

const statusStyle = {
    PAID: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    PENDING: "bg-yellow-100 text-yellow-800",
};

export default function Badge({ status }) {
    const normalizedStatus = status?.toUpperCase() || "PENDING";
    const style = statusStyle[normalizedStatus] || "bg-gray-100 text-gray-800";

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${style}`}>
            {normalizedStatus}
        </span>
    );
}
