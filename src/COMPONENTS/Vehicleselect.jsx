import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, TextField } from '@mui/material';

const VehicleSelect = ({ value, onChange }) => {
    const [vehicle, setvehicle] = useState([]);
    const [selectedVehicle, setselectedVehicle] = useState(null);

    useEffect(() => {
        const fetchvehicle = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/vehicledata", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch vehicle");
                }
                const data = await response.json();
                setvehicle(data); // Assuming data is an array of vehicle [{ ID, NAME, NUMBER }, ...]
            } catch (error) {
                console.error("Error fetching vehicle:", error);
            }
        };

        fetchvehicle();
    }, []); // Empty dependency array ensures useEffect runs only once on component mount

    useEffect(() => {
        if (value) {
            const driver = vehicle.find(driver => `${driver.NAME}-${driver.NUMBER}` === value);
            setselectedVehicle(driver || null);
        }
    }, [value, vehicle]);

    const handleVehicleChange = (event, newValue) => {
        setselectedVehicle(newValue);
        if (newValue) {
            const formattedVehicle = `${newValue.NAME}-${newValue.NUMBER}`;
            onChange(formattedVehicle); // Pass the formatted driver info to the parent component
        } else {
            onChange(''); // Handle case where the selection is cleared
        }
    };

    return (
        <Autocomplete
            value={selectedVehicle}
            onChange={handleVehicleChange}
            options={vehicle}
            getOptionLabel={(option) => `${option.NAME} - ${option.NUMBER}`}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Search Vehicle"
                    variant="outlined"
                    style={{ width: "180px", height: "40px", fontSize: "15px" }}
                />
            )}
            renderOption={(props, option) => (
                <li {...props}>
                    {option.NAME} - {option.NUMBER}
                </li>
            )}
        />
    );
};

VehicleSelect.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default VehicleSelect;
