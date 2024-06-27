import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../COMPONENTS/input";
import Data from "../../COMPONENTS/Data";
import "./dashboard.css";

const Dashboard = () => {
  const { username, userid } = useParams();
  const Navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showNavBar, setShowNavBar] = useState(false);
  const navbarRef = useRef(null); // Ref for the NavBar

  const handleHomeClick = () => {
    setShowForm(false);
  };

  const handleBookVehicleClick = () => {
    setShowForm(true);
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
    <>
      <div className="dashboard">
        <div className={`NavBar ${showNavBar? "open" : ""}`} ref={navbarRef}>
          <h3 onClick={() => Navigate(`/dashboard/${username}/${userid}`)}>
            <i class="fa-solid fa-car-rear"></i>VehiclePortal
          </h3>
          <div className="items">
            <li onClick={handleHomeClick}>Home</li>
            <li onClick={handleBookVehicleClick}>Book Vehicle</li>
            <li>Logout</li>
          </div>
        </div>

        <div className="component">
          <div className="tags">{showForm? <Form /> : <Data />}</div>
          <div className="menu-icon" onClick={toggleNavBar}>
            <i className={`fa-solid fa-bars ${showNavBar? "open" : ""}`}></i>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
