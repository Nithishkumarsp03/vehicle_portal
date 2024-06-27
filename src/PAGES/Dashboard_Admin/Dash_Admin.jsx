import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Approval from '../../COMPONENTS/Approval';
import Approved from '../../COMPONENTS/Approved';
import Cancelled from '../../COMPONENTS/Cancelled';
import Management from '../../COMPONENTS/Management';
import Driver from '../../COMPONENTS/Driver';
import './admin.css';

export default function DashAdmin() {
  const { username } = useParams();
  const Navigate = useNavigate();
  const [approval, setApproval] = useState(false);
  const [cancel, setCancelled] = useState(false);
  const [management, setManagement] = useState(false);
  const [driver, setDriver] = useState(false);
  const [showNavBar, setShowNavBar] = useState(false);
  const navbarRef = useRef(null); // Ref for the NavBar

  const handleHome = () => {
    setApproval(false);
    setDriver(false);
    setCancelled(false);
    setManagement(false);
  };

  const handleApproval = () => {
    setApproval(true);
    setDriver(false);
    setCancelled(false);
    setManagement(false);
  };

  const handleCancelled = () => {
    setApproval(false);
    setDriver(false);
    setCancelled(true);
    setManagement(false);
  };

  const handleManagement = () => {
    setApproval(false);
    setDriver(false);
    setCancelled(false);
    setManagement(true);
  };

  const handleDriver = () => {
    setApproval(false);
    setDriver(true);
    setCancelled(false);
    setManagement(false);
  };

  const toggleNavBar = () => {
    setShowNavBar(!showNavBar);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNavBar && navbarRef.current &&!navbarRef.current.contains(event.target)) {
        setShowNavBar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNavBar]);

  return (
    <div className='dashboard'>
      <div className={`NavBar ${showNavBar? 'open' : ''}`} ref={navbarRef}>
        <h3 onClick={() => Navigate(`/dashboard/admin/${username}`)}>
          <i className='fa-solid fa-car-rear'></i>VehiclePortal
        </h3>
        <div className='items'>
          <li onClick={handleHome}>Home</li>
          <li onClick={handleApproval}>Approval</li>
          <li onClick={handleCancelled}>Cancelled</li>
          <li onClick={handleManagement}>
            Vehicle
            <br />
            Management
          </li>
          <li onClick={handleDriver}>DriverManagement</li>
          <li onClick={() => Navigate('/login')}>Log out</li>
        </div>
      </div>
      <div className='component'>
        <h2>Welcome {username},</h2>
        <div className='tags'>
          {management? (
            <Management />
          ) : approval? (
            <Approval />
          ) : cancel? (
            <Cancelled />
          ) : driver? (
            <Driver />
          ) : (
            <Approved />
          )}
        </div>
      </div>
      <div className='menu-icon' onClick={toggleNavBar}>
        <i className={`fa-solid fa-bars ${showNavBar? 'open' : ''}`}></i>
      </div>
    </div>
  );
}
