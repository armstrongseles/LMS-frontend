// src/components/CoursePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './CoursePage.css'; // Optional: Import CSS for styling

const CoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`https://lms-backend-3-p0u4.onrender.com/api/courses/${courseId}`);
        setCourse(response.data);
      } catch (err) {
        setError("Failed to fetch course data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>; // Added error class for styling

  return (
    <div className="course-page">
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>Price: ${course.price}</p>
      <img src={course.photo} alt={course.title} className="course-image" />

      <h2>Assessments</h2>
      <ul className="assessments-list">
        {course.assessments.map((assessment) => (
          <li key={assessment._id}>
            <p className="question">{assessment.question}</p>
            <ul className="options-list">
              {assessment.options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <Link to={`/course/${courseId}/test`} state={{ course }} className="assessment-link">Take Assessment</Link>
    </div>
  );
};

export default CoursePage;
