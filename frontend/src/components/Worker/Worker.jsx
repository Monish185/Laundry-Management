import React from 'react';
import { Link } from 'react-router-dom';

function Worker() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-teal-600 mb-6">Worker Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <Link to={`/slip-list`} className="bg-white shadow-md p-6 rounded-lg text-center hover:bg-teal-100">
                    <h2 className="text-2xl font-semibold text-gray-700">View All Slips</h2>
                </Link>

                <Link to={`/slip-create/`} className="bg-white shadow-md p-6 rounded-lg text-center hover:bg-teal-100">
                    <h2 className="text-2xl font-semibold text-gray-700">Create a Slip</h2>
                </Link>
            </div>
        </div>
    );
}

export default Worker;
