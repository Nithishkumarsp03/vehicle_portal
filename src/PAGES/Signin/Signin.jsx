import React, { useState } from 'react';
import Logo from '../Login/Logo.jpeg'
import { useNavigate } from 'react-router-dom'
import './signin.css'


export default function Signin() {

  const navigate = useNavigate()
  const [userid, SetUserid] = useState('');
  const [password, SetPassword] = useState('');
  const [name, SetName] = useState('');
  const [email, SetEmail] = useState('');
  const [number, SetNumber] = useState('');
  const [design, SetDesign] = useState('');
  

  const handleSubmit = async (e) =>{
    e.preventDefault();

    if(userid === '' || password === '' || name === '' || email === '' || number === '' || design === ''){
        return;
    }

    try{
        const response = await fetch('http://localhost:8000/api/signin',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userid, password, name, email, number, design}),
        });

        if (response.ok){
            navigate('/');
            console.log("Login Succesuful");
        }
        else{
            console.log("Failed to Signin");
            
        }
    }
    catch (error) {
        console.error('Error signing in:', error);
        
    }

  };


  return (
    <div>
        <div className="login">
        <img src={Logo} alt="" width="300px"/>
          <h1>Signin to the Portal</h1>
          
          <form action="" onSubmit={handleSubmit}>
              <div>
                  <input type="text" placeholder='Enter your UserId' value={userid} onChange={(e)=>SetUserid(e.target.value)}/>
              </div>
              <div>
                  <input type="password" placeholder='Enter your Password' value={password} onChange={(e)=>SetPassword(e.target.value)}/>
              </div>
              <div>
                  <input type="text" placeholder='Enter your FullName' value={name} onChange={(e)=>SetName(e.target.value)}/>
              </div>
              <div>
                  <input type="email" placeholder='Enter your Email' value={email} onChange={(e)=>SetEmail(e.target.value)}/>
              </div>
              <div>
                  <input type="number" placeholder='Enter your PhoneNumber' value={number} onChange={(e)=>SetNumber(e.target.value)}/>
              </div>
              <div>
                  <input type="text" placeholder='Enter your Designation' value={design} onChange={(e)=>SetDesign(e.target.value)}/>
              </div>
              
              <div><button type='Submit' >Login</button></div>
              {/* onClick={() => Navigate('/')}  */}
              
          </form>
        </div>
    </div>
  )
}
