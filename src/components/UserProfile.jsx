// src/components/UserProfile.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <p>Email: {user.email}</p>
      ) : (
        <p>No user is logged in</p>
      )}
    </div>
  );
};

export default UserProfile;
