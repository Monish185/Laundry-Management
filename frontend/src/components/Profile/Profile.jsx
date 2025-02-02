import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await axios.get(`${import.meta.env.VITE_API_URL}profile/`, {
                    headers: { Authorization: `Token ${token}` }
                });
                setUser(true);
                setProfile(res.data.profile);
                setRole(res.data.role);
            } catch (error) {
                console.error("Error fetching profile:", error);
                //alert("Failed to fetch profile details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogOut = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.post(`${import.meta.env.VITE_API_URL}logout/`, {}, {
                headers: { Authorization: `Token ${token}` },
            });
            localStorage.removeItem('authToken');
            alert('Logged out successfully');
            navigate('/');
        } catch (err) {
            console.error("Logging out failed", err);
            alert("Failed to log out. Please try again later.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Please Login</h1>
                    <button className="btn border-spacing-1 text-white bg-blue-400 p-3 text-lg m-4 rounded-md hover:bg-blue-500 hover:text-green-50" onClick={() => navigate('/')}>
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-teal-600 mb-4">Profile</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <p className="text-lg"><strong>Role:</strong> {role}</p>
                <p className="text-lg"><strong>Name:</strong> {profile?.name || "N/A"}</p>
                {role === "student" && (
                    <>
                        <p className="text-lg"><strong>Roll No:</strong> {profile?.roll_no || "N/A"}</p>
                        <p className="text-lg"><strong>E-mail:</strong> {profile?.email || "N/A"}</p>
                    </>
                )}
                {role === "worker" && (
                    <>
                        <p className="text-lg"><strong>Worker ID:</strong> {profile?.contact || "N/A"}</p>
                        <p className="text-lg"><strong>Department:</strong> {profile?.email || "N/A"}</p>
                    </>
                )}
            </div>
            <button className="btn border-spacing-1 text-white bg-red-400 p-3 text-lg m-4 rounded-md hover:bg-red-500 hover:text-green-50" onClick={handleLogOut}>
                Log Out
            </button>
        </div>
    );
};

export default Profile;
