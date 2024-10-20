import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Alert, CircularProgress, Button, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material'; // Import MUI components
import { styled } from '@mui/system'; // For custom styling

// Custom styled container
const Container = styled('div')({
  padding: '20px',
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
});

const CourseCard = styled(Card)({
  margin: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const CourseImage = styled(CardMedia)({
  height: 140,
});

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://lms-backend-7-m7iv.onrender.com/api/courses');
        setCourses(response.data);
      } catch (err) {
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    const fetchEnrolledCourses = async () => {
      if (userId) {
        try {
          const response = await axios.get(`https://lms-backend-7-m7iv.onrender.com/api/enrolledCourses/${userId}`);
          const enrolledCourseIds = response.data.map(course => course._id);
          setEnrolledCourses(enrolledCourseIds);
        } catch (err) {
          console.error("Failed to fetch enrolled courses:", err);
        }
      }
    };

    fetchCourses();
    fetchEnrolledCourses();
  }, [userId]);

  const handleEnroll = async (courseId, price) => {
    setEnrolling(courseId);
  
    try {
      if (!userId) {
        throw new Error('User ID is not available');
      }
  
      const { data } = await axios.post('https://lms-backend-7-m7iv.onrender.com/api/enroll', { courseId, userId });
      navigate('/payment', { state: { orderId: data.orderId, courseId, amount: price, userId } });
    } catch (error) {
      console.error("Failed to enroll:", error);
      alert(error.response?.data?.error || "Enrollment failed, please try again.");
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Course List
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {courses.length === 0 ? (
        <Typography>No courses available for enrollment at the moment.</Typography>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} md={6} lg={4} key={course._id}>
              <CourseCard>
                {course.photo && (
                  <CourseImage image={course.photo} title={course.title} />
                )}
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {course.description}
                  </Typography>
                  <Typography variant="h6">Price: ${course.price}</Typography>
                </CardContent>
                <CardContent>
                  {enrolledCourses.includes(course._id) ? (
                    <Button variant="contained" color="primary" disabled>
                      Enrolled
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => handleEnroll(course._id, course.price)} 
                      disabled={enrolling === course._id}
                    >
                      {enrolling === course._id ? 'Enrolling...' : 'Enroll'}
                    </Button>
                  )}
                </CardContent>
              </CourseCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CourseList;
