import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthPage from '../Login/Login';
function Register() {
   
    
    const {role} = useParams();
    const navigate = useNavigate();
    console.log(role);
    const [name,setname] = useState();
    const [email,setemail] = useState();
    const [password,setpassword] = useState();
    const [confirmPassword,setconfirmPassword] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();

        if(password != confirmPassword)
        {
            alert('Passwords do not match');
            return;
        }

        navigate(`/${role}-dashboard`)
    
    }

    return ( 
        <>
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600">
                <div className="bg-white rounded-xl p-8 w-full max-w-lg text-center shadow-2xl">
                    <h1 className="text-4xl font-semibold mb-4 text-cyan-500">
                        Registration
                    </h1>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div>
                            <label htmlFor="name" className='block text-teal-700 text-lg'>Name</label>
                            <input 
                                type="text" 
                                id='name'
                                name='name'
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                                className='w-full p-3 rounded-lg border-2 border-teal-500'
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className='block text-teal-700 text-lg'>E-mail</label>
                            <input 
                                type="email" 
                                id='email'
                                name='email'
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                                className='w-full p-3 rounded-lg border-2 border-teal-500'
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className='block text-teal-700 text-lg'>Password</label>
                            <input 
                                type="password" 
                                id='password'
                                name='password'
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                                className='w-full p-3 rounded-lg border-2 border-teal-500'
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className='block text-teal-700 text-lg'>ConfirmPassword</label>
                            <input 
                                type="password" 
                                id='confirmPassword'
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={(e) => setconfirmPassword(e.target.value)}
                                className='w-full p-3 rounded-lg border-2 border-teal-500'
                                required
                            />
                        </div>
                        <button type="submit" className='text-teal-700 mt-4'>
                            Register
                        </button>
                    </form>
                    <p className="text-teal-700 mt-4">
                        Already have an Account?{' '}
                        <Link to={`/Login/${role}`} className="text-cyan-500">
                             Login
                        </Link>
                    </p>

                </div>
            </div>
        </>
     );
}

export default Register;