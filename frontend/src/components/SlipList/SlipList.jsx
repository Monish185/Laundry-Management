    import axios from 'axios';
    import React, { useEffect, useState } from 'react';
    import { Link } from 'react-router-dom';
    import { useNavigate } from 'react-router-dom';

    function SlipList() {
        const [slips, setSlips] = useState([]);
        const [loading, setLoading] = useState(true);
        const [isWorker,setIsWorker] = useState(false);
        const navigate = useNavigate();

        const API_URL = import.meta.env.VITE_API_URL;
        useEffect(() => {
            const fetchSlips = async () => {
                try {
                    const token = localStorage.getItem("authToken");  
                    const user = await axios.get(`${API_URL}/laundry/profile/`, {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    });
                    setIsWorker(user.data.role ===   'worker');
                    const res = await axios.get(`${API_URL}/laundry/slip-list/`, {
                        headers: {
                            Authorization: `Token ${token}`,  // Include token in headers
                        },
                    }); 
                    console.log(res.data);
                    setSlips(res.data || []);
                } catch (error) {
                    console.error('Error fetching slips:', error);
                    //alert('Failed to fetch laundry slips. Please try again later.');
                } finally {
                    setLoading(false);
                }
            };
            fetchSlips();
        }, []);
        

        if (loading) {
            return (
                <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
                    <p className="text-lg text-gray-600">Loading laundry slips...</p>
                </div>
            );
        }
        if(!isWorker){
            return (
                <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                <p className="text-lg text-gray-800 mb-4">You must be logged in as a worker to create a slip.</p>
                <button
                    className="btn px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
                    onClick={() => navigate("/Login/LaundryWorker/")}
                >
                    Login
                </button>
            </div>
            )
            
        }
        else if (slips.length === 0) {
            return (
                <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
                    <p className="text-lg text-gray-600">No laundry slips available.</p>
                    <Link
                        to={`/slip-create/`}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Create New Slip
                    </Link>
                </div>
            );
        }

        return (
            <div className="p-6 bg-gray-100 min-h-screen">
                        <h1 className="text-2xl font-bold mb-4">All Laundry Slips</h1>
                        <div className="space-y-4">
                            {slips.map((slip) => (
                            <div
                                key={slip.id}
                                className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
                            >
                                <div>
                                    <p className="text-lg font-medium">Slip ID: {slip.id}</p>
                                    <p>Student Name: {slip.student?.name || 'N/A'}</p>
                                    <p>Status: {slip.status || 'Pending'}</p>
                                </div>
                                <Link
                                    to={`/slip-detail/${slip.id}`}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    View Details
                                </Link>
                            </div>
                            ))}
                        </div>
                        <Link
                            to={`/slip-create/`}
                            className="block mt-6 px-4 py-2 bg-green-500 text-white rounded text-center hover:bg-green-600"
                        >
                            Create New Slip
                        </Link>
                
            </div>
        );
    }

    export default SlipList;
