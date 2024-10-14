import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import CarCard from './CarCard';
import { Grid, CircularProgress, TextField, MenuItem, Box, Typography, Button, Snackbar, Container } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './css/CarList.css';
import Header from './Header';

const CarList = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModel, setFilterModel] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchCars = async () => {
      try {
        const response = await axios.get('https://test-7-l727.onrender.com/api/cars');
        setCars(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setLoading(false);
      }
    };

    fetchCars();
  }, [token, navigate]);

  const filteredCars = cars.filter(car => {
    const isTypeMatch = car.carType.toLowerCase().includes(filterModel.toLowerCase());
    const isPriceMatch = (!minPrice || car.pricePerHour >= minPrice) &&
                         (!maxPrice || car.pricePerHour <= maxPrice);
    return isTypeMatch && isPriceMatch;
  });

  const handleLogout = () => {
    logout();
    setOpenSnackbar(true);
    navigate('/login');
  };

  if (loading) {
    return <CircularProgress />;
  }

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
    <div maxWidth="lg" className="container-padding mb-5 mt-5" style={{width:"100%"}}>
      <div className="animated-container mt-5">
        <Typography variant="h4" gutterBottom style={{color:"white"}}>Available Cars</Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>

        <Box mb={2}>
          <TextField
            select
            label="Filter by Car Type"
            value={filterModel}
            onChange={(event) => setFilterModel(event.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            <MenuItem value="">All Type</MenuItem>
            {Array.from(new Set(cars.map(car => car.carType))).map(Type => (
              <MenuItem key={Type} value={Type}>
                {Type}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box mb={2} display="flex" justifyContent="space-between">
          <TextField
            type="number"
            label="Min Price"
            value={minPrice}
            autoComplete="off"
            onChange={(event) => setMinPrice(event.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            type="number"
            label="Max Price"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            margin="normal"
            variant="outlined"
          />
        </Box>

        <Grid container spacing={4}>
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <Grid item xs={12} sm={6} md={4} key={car._id}>
                <CarCard car={car} />
              </Grid>
            ))
          ) : (
            <Typography variant="h6">No cars available at this moment.</Typography>
          )}
        </Grid>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message="You have logged out successfully."
        />
      </div>
    </div>
    </>
  );
};

export default CarList;

