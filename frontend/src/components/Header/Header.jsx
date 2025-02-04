import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DryCleaningIcon from "@mui/icons-material/DryCleaning";
import axios from "axios";

function Header() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return;

                const res = await axios.get(`${API_URL}/laundry/profile/`, {
                    headers: { Authorization: `Token ${token}` },
                });

                setUser(res.data); // Assuming API returns user data with name and role
                setProfile(res.data.profile)
                console.log(us.name);
                
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <header className="bg-teal-600 text-white p-4 mb-1">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-3xl font-bold flex items-center">
                    <DryCleaningIcon sx={{ fontSize: 40 }} className="mr-2" /> Laundry Management
                </h1>
                <nav>
                    <ul className="flex space-x-6 items-center">
                        <li>
                            <Link to="/" className="hover:text-teal-200 transition duration-300">Home</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-teal-200 transition duration-300">Contact</Link>
                        </li>
                        <li>
                            <Link to="/profile" className="hover:text-teal-200 transition duration-300">Profile</Link>
                        </li>
                        {user ? (
                            <li className="text-yellow-300 font-medium">
                                Logged in as {user.role === "worker" ? "Worker" : "Student"} ({profile?.name})
                            </li>
                        ) : (
                            <li>
                                <Link to="/" className="hover:text-teal-200 transition duration-300">Login</Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
