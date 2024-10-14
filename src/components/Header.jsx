import React, { useState, useEffect } from 'react';
import { Typography, AppBar, Toolbar } from '@mui/material';
import './css/Header.css'; // Import CSS for Header styles

const Header = () => {
  const [headerText, setHeaderText] = useState('AutoShare');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHeaderText('AutoShare');
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AppBar
      position="absolute" 
      className="header"
      elevation={0}
      style={{
        backgroundColor: 'transparent',
        top: 0, 
        left: 0,
        width: '100%', 
        zIndex: 1300, 
      }}
    >
      <Toolbar style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
        <Typography variant="h4" className="header-text" data-text={headerText}>
          {headerText}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;