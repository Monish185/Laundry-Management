import React from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate();

    const handleAdminClick = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}admin/`;
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold text-teal-600 mb-6">CLICK TO GO TO ADMIN PAGE</h1>

            <button
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
                onClick={handleAdminClick}
            >
                Admin
            </button>
        </div>
    );
};

export default Admin;