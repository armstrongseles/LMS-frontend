import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Alert, CircularProgress, Button, Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system'; // For custom styling

// Custom container styling
const Container = styled('div')({
  padding: '20px',
  backgroundColor: '#f9f9f9',
  minHeight: '100vh',
});

// Card styling for each course
const CourseCard = styled(Card)({
  margin: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const CourseImage = styled(CardMedia)({
  height: 140,
});

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        if (userId) {
          const response = await axios.get(`http://localhost:4000/api/enrollment/${userId}`);
          if (Array.isArray(response.data)) {
            setEnrolledCourses(response.data);
          } else {
            setError("Unexpected response format");
          }
        } else {
          setError("User ID is not available");
        }
      } catch (err) {
        setError("Failed to fetch enrolled courses");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [userId]);

  const handleStartAssessment = (courseId) => {
    navigate(`/course/${courseId}/test`);
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
        Enrolled Courses
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {enrolledCourses.length === 0 ? (
        <Typography>No courses enrolled yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {enrolledCourses.map(({ courseId, marksObtained, totalMarks, status }, index) => (
            <Grid item xs={12} sm={6} md={4} key={courseId?._id || index}>
              <CourseCard>
                {courseId.photo && <CourseImage image={courseId.photo} title={courseId.title} />}
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {courseId.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {courseId.description}
                  </Typography>
                  <Typography>Status: {status}</Typography>
                  <Typography>Marks Obtained: {marksObtained} / {totalMarks}</Typography>
                </CardContent>

                <CardContent>
                  {/* Display Start Assessment button only if status is not completed */}
                  {status !== 'Completed' && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleStartAssessment(courseId._id)}
                      fullWidth
                    >
                      Start Assessment
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

export default EnrolledCourses;
