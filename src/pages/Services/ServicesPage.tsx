import React from 'react';
import NavBar from '../../components/common/NavBar';
import './ServicesPage.css';

const ServicesPage: React.FC = () => {
  return (
    <>
      <div className="services-page">
        <h1>Services</h1>
        <p>Manage church services and events here.</p>
        {/* Placeholder for services list */}
        <div className="placeholder">
          <p>Service management features coming soon...</p>
        </div>
      </div>
      <NavBar />
    </>
  );
};

export default ServicesPage;
