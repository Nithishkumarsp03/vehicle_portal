import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, TextField } from '@mui/material';

const DriverSelect = ({ value, onChange }) => {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/driverdata", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch drivers");
                }
                const data = await response.json();
                setDrivers(data); // Assuming data is an array of drivers [{ ID, NAME, PHONENUMBER }, ...]
            } catch (error) {
                console.error("Error fetching drivers:", error);
            }
        };

        fetchDrivers();
    }, []); // Empty dependency array ensures useEffect runs only once on component mount

    useEffect(() => {
        if (value) {
            const driver = drivers.find(driver => `${driver.NAME}-${driver.PHONENUMBER}` === value);
            setSelectedDriver(driver || null);
        }
    }, [value, drivers]);

    const handleDriverChange = (event, newValue) => {
        setSelectedDriver(newValue);
        if (newValue) {
            const formattedDriver = `${newValue.NAME}-${newValue.PHONENUMBER}`;
            onChange(formattedDriver); // Pass the formatted driver info to the parent component
        } else {
            onChange(''); // Handle case where the selection is cleared
        }
    };

    return (
        <Autocomplete
            value={selectedDriver}
            onChange={handleDriverChange}
            options={drivers}
            getOptionLabel={(option) => `${option.NAME} - ${option.PHONENUMBER}`}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Search drivers"
                    variant="outlined"
                    style={{ width: "180px", height: "40px", fontSize: "15px" }}
                />
            )}
            renderOption={(props, option) => (
                <li {...props}>
                    {option.NAME} - {option.PHONENUMBER}
                </li>
            )}
        />
    );
};

DriverSelect.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default DriverSelect;
