import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
function Login() {
    const { role } = useParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [exist,setexist] = useState(false);
    const [person, setperson] = useState('');

    useEffect(() => {
        const check = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const user = await axios.get('https://laundry-management-il8w.onrender.com/laundry/profile/', {
                    headers: { Authorization: `Token ${token}` },
                });
                setperson(user.data.role);
            } catch (error) {
                console.error('Error fetching slip:', error);
            } finally {
                setLoading(false);
            }
        };

        check();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email.trim() || !password.trim()) {
            alert('Please enter both email and password.');
            setLoading(false);
            return;
        }

        try {
            
            const response = await fetch('https://laundry-management-il8w.onrender.com/laundry/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Check if role is valid
            if (!['student', 'worker'].includes(data.role)) {
                alert('Invalid role or credentials');
                setLoading(false);
                return;
            }

            // Save the authentication token in local storage
            localStorage.setItem('authToken', data.token);

            // Display success message and redirect
            alert(`${data.role.charAt(0).toUpperCase() + data.role.slice(1)} logged in successfully`);
            setEmail('');
            setPassword('');
            navigate(`/${data.role}-dashboard`);

        } catch (error) {
            console.error('Login error:', error);
            alert(error.message || 'Failed to log in. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const handleLogOut = async () => {
        try{
            const token = localStorage.getItem('authToken');
            const res = await axios.post('https://laundry-management-il8w.onrender.com/laundry/logout/',{},{
                headers: { Authorization: `Token ${token}` },
            });
            localStorage.removeItem('authToken');
            alert('Logged out successfully')
            navigate('/');
        }catch(err){
            console.error("Logging out failed", err);
             alert("Failed to log out. Please try again later.");
        }
    }
    if (person === 'student') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-3xl font-semibold text-gray-700 mb-6">You are already logged in</h1>
    
                <button 
                    className="w-80 py-3 rounded-xl text-lg font-bold shadow-md bg-teal-500 text-white 
                               transition-all duration-300 transform hover:bg-teal-600 active:scale-95"
                    onClick={() => navigate('/student-dashboard')}
                >
                    Go to Student Dashboard
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
    else if (person === 'worker') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-3xl font-semibold text-gray-700 mb-6">You are already logged in</h1>
    
                <button 
                    className="w-80 py-3 rounded-xl text-lg font-bold shadow-md bg-teal-500 text-white 
                               transition-all duration-300 transform hover:bg-teal-600 active:scale-95"
                    onClick={() => navigate('/worker-dashboard')}
                >
                    Go to Worker Dashboard
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
    
    else {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 min-w-min">
                <h1 className="text-4xl font-semibold mb-4 text-cyan-500">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-teal-700 text-lg">
                            E-mail
                        </label>
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
                        <label htmlFor="password" className="block text-teal-700 text-lg">
                            Password
                        </label>
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
                            loading
                                ? 'bg-teal-300 text-gray-700 cursor-not-allowed'
                                : 'bg-teal-500 text-white hover:bg-teal-600'
                        }`}
                    >
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>
                <p className="text-teal-700 mt-4">
                    Don't Have an account?{' '}
                    <Link to={`/Register/${role}`} className="text-cyan-500">
                        Register Here
                    </Link>
                </p>
            </div>
        </div>
    );
}
}

export default Login;
