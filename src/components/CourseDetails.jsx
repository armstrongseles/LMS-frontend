import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    axios.get(`/api/courses/${id}`)
      .then(response => setCourse(response.data))
      .catch(error => console.error(error));
  }, [id]);

  if (!course) return <div>Loading...</div>;

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <h3>Assessments</h3>
      {course.assessments.map(assessment => (
        <div key={assessment._id}>
          <p>{assessment.question}</p>
        </div>
      ))}
      <button>Enroll Now</button> {/* You can add enrollment or payment trigger here */}
    </div>
  );
};

export default CourseDetails;
