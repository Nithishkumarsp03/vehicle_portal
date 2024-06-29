import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/bit.png';
import './Login.css';

export default function Google() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLoginSuccess = async (response) => {
    const { credential } = response;
    const payload = JSON.parse(atob(credential.split('.')[1]));

    const userProfile = {
      name: payload.name,
      picture: payload.picture,
      email: payload.email,
    };

    console.log(userProfile.name);

    try {
      const response = await fetch('http://localhost:8000/api/google', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
      });

      if (response.ok) {
        const data = await response.json();
        const { message, username, role, userid } = data;

        if (message === 'Login successful' && username && role && userid) {
          if (role === 'admin') {
            navigate(`/dashboard/admin/${username}`);
          } else {
            navigate(`/dashboard/${username}/${userid}`);
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

  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
  };

  return (
    <div className='gsignin'>
    <GoogleOAuthProvider clientId="726273910785-stqg51cb51merm3nefnvla8u9i3sakj0.apps.googleusercontent.com">
      <div className="container">
        <div className="header">
          <p className='welcome'>Welcome Back !</p>
          <h1 className='title'>VEHICLE PORTAL</h1>
          <h3 className='signin'>Sign in with GoogleLogin</h3>
        </div>
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="google">
          <GoogleLogin 
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    </GoogleOAuthProvider>
    </div>
  );
}
