import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [userId, setUserId] = useState(sessionStorage.getItem('userId'));
  const [sessionTimeout, setSessionTimeout] = useState(null);

  useEffect(() => {
   

    if (token) {
      const timeout = setTimeout(() => {
        logout();
        console.log("Session expired, user logged out.");
      }, 15 * 60 * 1000); // 15 minutes session timeout

      setSessionTimeout(timeout);
    }

    return () => {
      clearTimeout(sessionTimeout);
    };
  }, [token]);

  const login = async (values) => {
    try {
      const response = await axios.post('https://lms-backend-7-m7iv.onrender.com/api/auth/login', values);
      const { token, userId } = response.data;

    
      setToken(token);
      setUserId(userId);
      sessionStorage.setItem('token', token); // Store token in session storage
      sessionStorage.setItem('userId', userId); // Store userId in session storage
    } catch (err) {
      throw new Error(err.response ? err.response.data.error : err.message);
    }
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    sessionStorage.removeItem('token'); // Remove token from session storage
    sessionStorage.removeItem('userId'); // Remove userId from session storage
    clearTimeout(sessionTimeout);
    console.log("User logged out.");
    // Redirect to login if necessary, e.g., using navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
