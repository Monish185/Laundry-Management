import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const { role } = useParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [person, setPerson] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const checkProfile = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;

                const response = await axios.get(`${API_URL}/laundry/profile/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setPerson(response.data.role);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        checkProfile();
    }, [API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (!email.trim() || !password.trim()) {
            alert('Please enter both email and password.');
            setLoading(false);
            return;
        }
    
        try {
            const response = await axios.post(
                `${API_URL}/laundry/login/`,
                { email, password }, 
                { headers: { 'Content-Type': 'application/json' } } 
            );
    
            const data = response.data; 
    
            if (!['student', 'worker'].includes(data.role)) {
                alert('Invalid role or credentials');
                setLoading(false);
                return;
            }
    
            localStorage.setItem('authToken', data.token);
            alert(`${data.role.charAt(0).toUpperCase() + data.role.slice(1)} logged in successfully`);
            navigate(`/${data.role}-dashboard`);
        } catch (error) {
            console.error('Login error:', error);
            alert(error.response?.data?.error || 'Failed to log in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogOut = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert("No active session found.");
                return;
            }
            await axios.post(`${API_URL}/laundry/logout/`, {}, {
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

    if (person === 'student' || person === 'worker') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-3xl font-semibold text-gray-700 mb-6">You are already logged in</h1>
                <button 
                    className="w-80 py-3 rounded-xl text-lg font-bold shadow-md bg-teal-500 text-white 
                               transition-all duration-300 transform hover:bg-teal-600 active:scale-95"
                    onClick={() => navigate(`/${person}-dashboard`)}
                >
                    Go to {person.charAt(0).toUpperCase() + person.slice(1)} Dashboard
                </button>
                <button 
                    className="w-80 py-3 mt-4 rounded-xl text-lg font-bold shadow-md bg-gray-800 text-white 
                               transition-all duration-300 transform hover:bg-gray-900 active:scale-95"
                    onClick={handleLogOut}
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 min-w-min">
                <h1 className="text-4xl font-semibold mb-4 text-cyan-500">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-teal-700 text-lg">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg border-2 border-teal-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-teal-700 text-lg">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border-2 border-teal-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-lg text-lg font-bold shadow-lg transition duration-300 ${
                            loading ? 'bg-teal-300 text-gray-700 cursor-not-allowed' : 'bg-teal-500 text-white hover:bg-teal-600'
                        }`}
                    >
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
