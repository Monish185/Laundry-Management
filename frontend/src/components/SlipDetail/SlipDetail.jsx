import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function SlipDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [slip, setSlip] = useState(null);
    const [particulars, setParticulars] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isWorker, setIsWorker] = useState(false);
    
    // Ensure API URL is formatted correctly
    const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

    useEffect(() => {
        const fetchSlip = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const user = await axios.get(`${API_URL}/laundry/profile/`, {
                    headers: { Authorization: `Token ${token}` },
                });

                setIsWorker(user.data.role === 'worker');

                const res = await axios.get(`${API_URL}/laundry/get-slip-details/${id}/`, {
                    headers: { Authorization: `Token ${token}` },
                });

                setSlip(res.data);
                setParticulars(res.data.particulars || {});
            } catch (error) {
                console.error('Error fetching slip:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSlip();
    }, [id]);

    const handleAction = async (status) => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.post(
                `${API_URL}/laundry/update-slip-status/${id}/`,
                { status },
                { headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' } }
            );

            setSlip((prevSlip) => ({ ...prevSlip, status: res.data.new_status }));
            alert(`Slip status updated to: ${res.data.new_status}`);
        } catch (error) {
            console.error('Error updating slip status:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.post(
                `${API_URL}/laundry/edit-particulars/`,
                { slip_id: id, particulars },
                { headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' } }
            );

            alert(res.data.message);
            setIsEditing(false);
            setSlip((prevSlip) => ({ ...prevSlip, particulars }));
        } catch (error) {
            console.error('Error updating particulars:', error);
        }
    };

    const handleResolveIssue = (studentEmail, slipId, issue) => {
        const subject = encodeURIComponent(`Laundry Issue Resolution - Slip #${slipId}`);
        const body = encodeURIComponent(
            `Dear Student,\n\nYour reported issue for Laundry Slip #${slipId} has been noted.\n\nIssue: "${issue}"\n\nPlease reply to this email for any further clarification.\n\nBest regards,\nLaundry Management`
        );
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${studentEmail}&su=${subject}&body=${body}`, "_blank");
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600">Loading slip details...</p>
            </div>
        );
    }

    if (!isWorker) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                <p className="text-lg text-gray-800 mb-4">You must be logged in as a worker to access this page.</p>
                <button
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
                    onClick={() => navigate('/Login/LaundryWorker/')}
                >
                    Login
                </button>
            </div>
        );
    }

    if (!slip) {
        return (
            <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
                <p className="text-lg text-red-500">Slip not found.</p>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-pink-100">
            <h1 className="text-2xl font-bold mb-4">Slip Details</h1>
            <div className="p-4 bg-white shadow rounded-lg">
                <p className="text-lg">
                    <strong className="mr-10">Roll No.: {slip?.student?.roll_no || 'N/A'}</strong>
                    <strong>Name: {slip?.student?.name || 'N/A'}</strong>
                </p>

                <p className="mt-2">
                    <strong>Particulars:</strong>
                </p>

                {!isEditing ? (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mt-2 shadow-md">
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(particulars).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-2 px-4 border-b last:border-b-0 text-gray-700 bg-white rounded-md shadow-sm">
                                    <span className="font-semibold">{key}:</span>
                                    <span>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-gray-100 mt-4 rounded-lg shadow-md">
                        {Object.entries(particulars).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center p-2 border-b">
                                <span className="font-semibold">{key}:</span>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => setParticulars({ ...particulars, [key]: e.target.value })}
                                    className="border rounded p-1"
                                />
                            </div>
                        ))}
                        <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-2">
                            Save Changes
                        </button>
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-2">
                            Cancel
                        </button>
                    </div>
                )}

                <p className="mt-4">
                    <strong>Status:</strong> {slip?.status || 'N/A'}
                </p>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Reported Issue:</h3>
                    {slip?.issue ? (
                        <>
                            <p className="p-4 bg-red-50 text-red-600 border border-red-300 rounded-lg shadow-md">{slip.issue}</p>
                            <button onClick={() => handleResolveIssue(slip.student.email, slip.id, slip.issue)} className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-green-600 m-2">
                                Resolve Issue
                            </button>
                        </>
                    ) : (
                        <p className="text-gray-500">No issues reported by the student.</p>
                    )}
                </div>
            </div>

            <div className="mt-4 space-x-4">
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">
                    Back
                </button>
            </div>
        </div>
    );
}

export default SlipDetail;
