import React from 'react';
import NavBar from '../../components/common/NavBar';
import './UsersPage.css';

const UsersPage: React.FC = () => {
  return (
    <>
      <div className="users-page">
        <h1>Users</h1>
        <p>Manage church members and users here.</p>
        {/* Placeholder for user list */}
        <div className="placeholder">
          <p>User management features coming soon...</p>
        </div>
      </div>
      <NavBar />
    </>
  );
};

export default UsersPage;
