import React, { useContext } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import './css/CarCard.css'; // Import CSS for CarCard

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext); 

  const handleBookingClick = () => {
    navigate('/booking', {
      state: {
        carId: car._id,
        carModel: car.carModel,
        pricePerHour: car.pricePerHour,
        image: car.image,
      },
    });
  };

  const handleReviewClick = () => {
    navigate('/review', {
      state: {
        userId,
        carId: car._id,
        carModel: car.carModel,
        image: car.image,
      },
    });
  };

  return (
    <Card className="styled-card ">
      <CardMedia
        component="img"
        className="card-image"
        image={`https://test-7-l727.onrender.com/${car.image}`}
        alt={car.carModel}
      />
      <CardContent className="card-content">
        <Typography gutterBottom variant="h5" component="div">
          {car.carModel}
        </Typography>
        <Typography>Price Per Hour</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="text.secondary">
            ₹{car.pricePerHour} 
          </Typography>
          <Button variant="contained" color="primary" onClick={handleBookingClick}>
            Book Now
          </Button>
        </Box>
        <Button variant="outlined" color="error" onClick={handleReviewClick}>
          Rate and Review
        </Button>
      </CardContent>
    </Card>
  );
};

export default CarCard;