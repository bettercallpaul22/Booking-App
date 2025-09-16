import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAddAppointment = () => {
    navigate('/add-appointment');
  };

  return (
    <div className="main-page">
      <h1>Welcome to Church Admin</h1>
      <p>Manage your church appointments efficiently.</p>
      <button onClick={handleAddAppointment} className="add-appointment-btn">
        Add New Appointment
      </button>
    </div>
  );
};

export default MainPage;
