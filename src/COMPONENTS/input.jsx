import React, { useState } from 'react'
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/joy/Input';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './input.css';

export default function Form() {

    const Navigate = useNavigate();
    const {username, userid} = useParams();
    const [startingplace, setStartingPlace] = useState('');
    const [endingplace, setEndingPlace] = useState('');
    const [fromDatetime, setFromDateTime] = useState('');
    const [toDatetime, setToDateTime] = useState('');
    const [purpose, setPurpose] = useState('');
    const [typeoftrip, setTypeofTrip] = useState('');
    const [passengers, setPassengers] = useState('');
    const [error, setError] = useState('');

    const handlesubmit = async (e) => {
      e.preventDefault();
  
      try {
          const response = await fetch('http://localhost:8000/api/input', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  username,
                  userid,
                  fromDatetime,
                  toDatetime,
                  startingplace,
                  endingplace,
                  purpose,
                  typeoftrip,
                  passengers
              }),
          });
  
          if (response.ok) {
              setStartingPlace('');
              setEndingPlace('');
              setFromDateTime('');
              setToDateTime('');
              setPurpose('');
              setTypeofTrip('');
              setPassengers('');
              Navigate(`/dashboard/${username}/${userid}`);
              setError('Your request has been Submitted and it is waiting for Approval');
              console.log("Inserted")
          } else {
              console.log("Failed to insert");
              setError('Failed');
          }
      } catch (error) {
          console.error('Error signing in:', error);
          setError('Error from Server. Please try again');
      }
  };
  


  return (
    <div>
        <div className="input-overlay"></div>
        <form onSubmit={handlesubmit}>
          <div className="input-container">
          <FormControl className='scroll'>
            <h2>Requisition Form</h2>
            <br />
            <div className="startingDetails">
              <label>
                <h3>Starting Place</h3>
                <select
                className='dropdown'
                onChange={(e) => setStartingPlace(e.target.value)}
                >
                <option disabled selected hidden>Your Choice</option>
                <option>BIT</option>
                <option>COIMBATORE</option>
                <option>CHENNAI</option>
                </select>

                
              </label>

              <label>
                <h3>Time</h3>
                <Input type="datetime-local" className='time' onChange={(e) => setFromDateTime(e.target.value)} />
              </label>

            </div>

            <br />
            <div className="endingDetails">
              <label>
                <h3>Destination</h3>
                  <select
                    className='dropdown'
                    onChange={(e) => setEndingPlace(e.target.value)}
                  >
                    <option disabled selected hidden>Your Choice</option>
                    <option>BIT</option>
                    <option>BIT</option>
                    <option>BIT</option>
                  </select>
                
              </label>

              <label>
                <h3>Time</h3>
                <Input type="datetime-local" className='time' onChange={(e) => setToDateTime(e.target.value)} placeholder="Enter the starting time" />
              </label>
            </div>

            <br />
            <div>
              <h3>Purpose of Visit</h3>
              <Input
                type="text"
                onChange={(e) => setPurpose(e.target.value)}
                className="purpose"
                placeholder="Industry or Company name"
              />
            </div>

            <br />
            
              <h3>Type Of Trip</h3>
              <FormLabel id="demo-radio-buttons-group-label"></FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={typeoftrip}
                onChange={(e) => setTypeofTrip(e.target.value)}
                >
                <FormControlLabel
                    control={<Radio value="official" />}
                    label="Official"
                />
                <FormControlLabel
                    control={<Radio value="project" />}
                    label="Project"
                />
             </RadioGroup>


              <div className='Number of Passengers'>
                <h3>No of Passengers</h3>
                <br />
                <Input
                    type="number"
                    onChange={(e) => setPassengers(e.target.value)}
                    className="purpose"
                    placeholder="No of passengers"
                />
              </div>

              <div className="btn">
              <button type='submit'>
                Submit
              </button>
              {error && <h4 className='error'>{error}</h4>}
            </div>
            </FormControl>

            
          </div>
        </form>
      </div>
  )
}
