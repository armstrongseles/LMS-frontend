import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Assuming you have AuthContext for user ID

const Assessment = ({ course }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [status, setStatus] = useState('Ongoing');
  const { userId } = useContext(AuthContext); // Get userId from context

  // Handle answer selection
  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer,
    });
  };

  // Submit the assessment and calculate score
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const totalQuestions = course.assessments.length;
    let correctAnswers = 0;

    // Calculate the score by comparing user's answers with the correct ones
    course.assessments.forEach((assessment) => {
      if (userAnswers[assessment._id] === assessment.answer) {
        correctAnswers++;
      }
    });

    const marksObtained = correctAnswers;
    const totalMarks = totalQuestions;
    const percentage = (marksObtained / totalMarks) * 100;

    // Determine if the course is completed based on the percentage
    const newStatus = percentage >= 50 ? 'Completed' : 'Ongoing';
    setStatus(newStatus);

    // Display the score
    setScore({ marksObtained, totalMarks });

    // Save the result to the backend (update the user's enrollment with the marks)
    try {
      await axios.post(`http://localhost:4000/api/enrollment/${course._id}/submit-assessment`, {
        userId, // Use userId from context
        marksObtained,
        totalMarks,
        status: newStatus, // Save new status (Completed/Ongoing) based on the score
      });
    } catch (error) {
      console.error("Error submitting the assessment:", error);
    }
  };

  // Check if the user has completed the assessment
  const isCompleted = status === 'Completed';

  return (
    <div>
      <h1>{course.title} - Assessment</h1>
      <form onSubmit={handleSubmit}>
        {course.assessments.map((assessment) => (
          <div key={assessment._id}>
            <p>{assessment.question}</p>
            {assessment.options.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name={assessment._id}
                  value={option}
                  onChange={() => handleAnswerChange(assessment._id, option)}
                  disabled={isCompleted} // Disable options if completed
                />
                {option}
              </label>
            ))}
          </div>
        ))}
        <button type="submit" disabled={isCompleted}>Submit Assessment</button> {/* Disable if completed */}
      </form>

      {score && (
        <div>
          <p>Marks: {score.marksObtained}/{score.totalMarks}</p>
          <p>Status: {status}</p> {/* Display the current status */}
        </div>
      )}
    </div>
  );
};

export default Assessment;
