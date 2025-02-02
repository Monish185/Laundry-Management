import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Student = () => {
    const [slips, setSlips] = useState([]); // Ensure it's an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [student, setIsStudent] = useState(false);
    const [reportingSlip, setReportingSlip] = useState(null); // Tracks which slip is being reported
    const [newComplaint, setNewComplaint] = useState(""); // Complaint text
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSlips = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const user = await axios.get(`${import.meta.env.VITE_API_URL}profile/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setIsStudent(user.data.role === "student");

                const res = await axios.get(`${import.meta.env.VITEP_API_URL}slip-list/`, {
                    headers: { Authorization: `Token ${token}` },
                });

                setSlips(res.data || []);
            } catch (error) {
                console.error("Error fetching slips:", error);
                setError("Failed to fetch laundry slips. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSlips();
    }, []);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    };

    const handleReportIssue = (slipId) => {
        setReportingSlip(slipId); // Set the slip being reported
    };

    const handleSubmitComplaint = async (slipId) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(
                `${process.env.REACT_APP_API_URL}report-issue/${slipId}/`,
                {
                    issue: newComplaint,
                },
                {
                    headers: { Authorization: `Token ${token}` },
                }
            );

            alert("Your issue has been reported successfully!");
            setNewComplaint("");
            setReportingSlip(null); 
        } catch (error) {
            console.error("Error reporting issue:", error);
            alert("Failed to report the issue. Please try again.");
        }
    };

    if (loading) {
        return <div className="text-center text-lg text-gray-600">Loading...</div>;
    }

    if (!student) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                <p className="text-lg text-gray-800 mb-4">You must be logged in as a student to view slips.</p>
                <button
                    className="btn px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
                    onClick={() => navigate("/Login/student/")}
                >
                    Login
                </button>
            </div>
        );
    }

    if (slips.length === 0) {
        return <div className="text-center text-gray-500">No slips available.</div>;
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold text-teal-600 mb-6">Laundry Slips</h1>

            {slips.map((slip) => (
                <div
                    key={slip.id}
                    className="bg-pink-100 shadow-lg rounded-lg p-6 mb-4 border border-gray-300"
                >
                    <h2 className="text-2xl font-semibold text-pink-600">Campus Dryclean</h2>
                    <p className="text-lg mt-2">
                        <strong>Name:</strong> {slip.student.name}
                    </p>
                    <p className="text-lg">
                        <strong>Date:</strong> {formatDateTime(slip.date_issued)}
                    </p>

                    <h3 className="text-lg mt-4 font-semibold">Particulars:</h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        {Object.entries(slip.particulars).map(([key, value]) => (
                            <div
                                key={key}
                                className="flex justify-between p-2 bg-white shadow rounded-md"
                            >
                                <span className="font-semibold">{key}:</span>{" "}
                                <span>{value}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-lg mt-4">
                        <strong>Status:</strong>
                        <span
                            className={`ml-2 px-3 py-1 rounded-md text-white ${
                                slip.status === "done"
                                    ? "bg-green-500"
                                    : slip.status === "ready"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                        >
                            {slip.status}
                        </span>
                    </p>

                    <div className="mt-6">
                        {reportingSlip === slip.id ? (
                            <div>
                                <textarea
                                    value={newComplaint}
                                    onChange={(e) => setNewComplaint(e.target.value)}
                                    placeholder="Describe the issue..."
                                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <button
                                    onClick={() => handleSubmitComplaint(slip.id)}
                                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                                >
                                    Submit Complaint
                                </button>
                                <button
                                    onClick={() => setReportingSlip(null)}
                                    className="mt-4 ml-4 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded shadow"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleReportIssue(slip.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                            >
                                Report Issue
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Student;
