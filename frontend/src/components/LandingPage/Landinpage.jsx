import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import Person4Icon from '@mui/icons-material/Person4';

function Landingpage() {
    const navigate = useNavigate();

    const handleNavigation = (role) => {
        console.log(role);
        
        navigate(`Login/${role}`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600">
            <div className="bg-white rounded-xl p-8 w-full max-w-lg text-center shadow-2xl">
                <h1 className="text-4xl font-semibold mb-4 text-cyan-500">
                    Welcome
                </h1>
                <p className="text-teal-700 mb-8 text-lg">
                    Please select your role to proceed:
                </p>
                <div className="space-y-6">
                    <button
                        onClick={() => handleNavigation('student')}
                        className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-bold shadow-lg hover:bg-blue-700 transition duration-300"
                    >
                       <PersonIcon /> Student
                    </button>
                    <button
                        onClick={() => handleNavigation('LaundryWorker')}
                        className="w-full bg-teal-500 text-white py-4 rounded-lg text-lg font-bold shadow-lg hover:bg-teal-600 transition duration-300"
                    >
                      <Person4Icon />  Laundry Worker
                    </button>
                    <button
                        onClick={() => navigate(`admin-dashboard`)}
                        className="w-full bg-orange-500 text-white py-4 rounded-lg text-lg font-bold shadow-lg hover:bg-orange-600 transition duration-300"
                    >
                       < AdminPanelSettingsIcon /> Admin
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Landingpage;
