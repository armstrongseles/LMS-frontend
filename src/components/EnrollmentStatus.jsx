// src/components/EnrollmentStatus.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EnrollmentStatus = ({ userId }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get(`https://lms-backend-7-m7iv.onrender.com/api/enrollment/${userId}`);
        setEnrollments(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Enrollment Status</h2>
      {enrollments.length === 0 ? (
        <p>No enrollments found.</p>
      ) : (
        <ul>
          {enrollments.map((enrollment) => (
            <li key={enrollment._id}>
              <h3>{enrollment.courseId.title}</h3>
              <p>{enrollment.courseId.description}</p>
              <p>Status: {enrollment.completed ? 'Completed' : 'In Progress'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EnrollmentStatus;
