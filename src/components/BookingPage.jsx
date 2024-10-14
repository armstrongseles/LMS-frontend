import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box,Grid } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import "../components/css/BookingPage.css";
import Header from './Header';
import Navbar from './Navbar';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { carId, carModel, pricePerHour, image } = location.state || {};

  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [totalHours, setTotalHours] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateTotal = () => {
    const hours = endDate.diff(startDate, 'hour');
    setTotalHours(hours);
    setTotalPrice(hours * pricePerHour);
  };

  const handleProceedToPay = () => {
    navigate('/payment', { state: { totalPrice, carId } });
  };

  return (
    <>
      <Grid container spacing={7}>
  <Grid item xs={12}>
    <Header/>
  </Grid>
  <Grid item xs={12}>
    <Navbar/>
  </Grid>
</Grid>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="container booking-container">
          {!carModel ? (
            <Box>
              <Typography variant="h4" style={{color:"white"}}>Please select a car</Typography>
              <Button variant="contained" onClick={() => navigate('/cars')} style={{ marginTop: '20px' }}>
                Go to Home Page
              </Button>
            </Box>
          ) : (
            <Box className="booking">
              <Typography variant="h5" className="text-center"  style={{color:"white"}}>Booking Details</Typography>
              <Typography variant="h6" className="text-center"  style={{color:"Gold"}}>{carModel}</Typography>
              <Box className="row booking-details">
                <Box className="col-md-6 booking-left">
                  <img src={`https://test-7-l727.onrender.com/${image}`} alt={carModel} className="car-image img-fluid rounded" />
                </Box>
                <Box className="col-md-6 booking-right" style={{color:"white"}}>
                  <DateTimePicker
                    label="Start Date and Time"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" className='mt-5' />}
                  />
                  <DateTimePicker
                    className='mt-3'
                    label="End Date and Time"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                  />
                  <Button variant="contained" color="primary" onClick={calculateTotal} className="mt-3">
                    Calculate Total
                  </Button>
                  {totalHours > 0 && (
            <Box className="total-details mt-3 text-center">
              <Typography variant="h6" style={{color:"white"}}>Total Hours: {totalHours}</Typography>
              <Typography variant="h6"  style={{color:"white"}}>Total Price: ₹{totalPrice.toFixed(2)}</Typography>
              <Button variant="contained" color="primary" onClick={handleProceedToPay}>
                Proceed to Pay
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => navigate('/cars')} className="ml-2">
                Cancel Booking
              </Button>
            </Box>
          )}
                </Box>
              </Box>
            </Box>
          )}
        </div>
      </LocalizationProvider>
    </>
  );
};

export default BookingPage;
