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

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                `${API_URL}/laundry/edit-particulars/`,
                { slip_id: id, particulars },
                { headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' } }
            );
            alert('Particulars updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating particulars:', error);
        }
    };

    if (loading) {
        return <p>Loading slip details...</p>;
    }

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Slip Details</h1>
            <div className="p-4 bg-white shadow rounded-lg">
                <p><strong>Roll No.:</strong> {slip?.student?.roll_no || 'N/A'}</p>
                <p><strong>Name:</strong> {slip?.student?.name || 'N/A'}</p>
                <p className="mt-2"><strong>Particulars:</strong></p>
                {!isEditing ? (
                    <div>
                        {Object.entries(particulars).map(([key, value]) => (
                            <p key={key}>{key}: {value}</p>
                        ))}
                    </div>
                ) : (
                    <div>
                        {Object.entries(particulars).map(([key, value]) => (
                            <div key={key} className="mb-2">
                                <label className="block font-bold">{key}:</label>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => setParticulars({ ...particulars, [key]: e.target.value })}
                                    className="border p-2 w-full"
                                />
                            </div>
                        ))}
                        <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded">Save</button>
                    </div>
                )}
                {!isEditing && <button onClick={() => setIsEditing(true)} className="bg-gray-500 text-white p-2 rounded">Edit</button>}
            </div>
        </div>
    );
}

export default SlipDetail;
