import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo.jpeg'
import './Login.css'

export default function Login() {
    const Navigate = useNavigate();
    const [userid, setUserId] = useState('');
    const [password, SetPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userid === '' || password === '') {
            setError('Fill out all the Fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const { message, username,role } = data;

                if ((message === 'Login successful' && username) && ( message === 'Login successful' && role)) {
                    if(role === 'admin'){
                        Navigate(`/dashboard/admin/${username}`);
                    }
                    else{
                        Navigate(`/dashboard/${username}/${userid}`);
                    }
                    
                console.log('Login Successful');
                } else {
                    console.log('Login Failed');
                    setError('Login Failed');
                }
            } else {
                console.log('Login Failed');
                setError('Login Failed');
            }
        } catch (error) {
            console.error('Error Logging in:', error);
            setError('Error Logging in. Please try again later.');
        }
    };

    return (
        <div className='login'>
            <img src={Logo} alt="" width="300px"/>
            <h1>Login to the Portal</h1>
            <form action='' onSubmit={handleSubmit}>
                <div>
                    <input type='text' placeholder='Enter your UserId' onChange={(e) => setUserId(e.target.value)} />
                </div>
                <div>
                    <input type='password' placeholder='Enter your Password' onChange={(e) => SetPassword(e.target.value)} />
                </div>
                {error && <div>{error}</div>}
                <div>
                    <button type='Submit'>Login</button>
                </div>
                <h3 onClick={()=>Navigate('/signin')} style={{cursor: "pointer"}}>New User?</h3>
            </form>
        </div>
    );
}
