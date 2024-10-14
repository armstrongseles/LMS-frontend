import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import './css/TestPage.css'; // Import the CSS file for styles
import { AuthContext } from '../context/AuthContext'; // Import AuthContext to get userId
import { Alert, Button, CircularProgress } from '@mui/material'; // Import MUI components

const TestPage = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const { course } = location.state || {};
  const [assessments, setAssessments] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState('');
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const [isSubmitting, setIsSubmitting] = useState(false); // To handle form submission state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
  const { userId } = useContext(AuthContext); // Get userId from AuthContext

  // Debug userId
  console.log('User ID:', userId);
  
  // Handle unauthorized access
  if (!userId) {
    return <p>User is not logged in. Please log in to continue.</p>;
  }

  useEffect(() => {
    if (course) {
      setAssessments(course.assessments);
      setTitle(course.title);
    } else {
      const fetchCourse = async () => {
        try {
          setLoading(true); // Set loading to true when fetching starts
          const response = await axios.get(`http://localhost:4000/api/courses/${courseId}`);
          setAssessments(response.data.assessments);
          setTitle(response.data.title);
        } catch (err) {
          console.error(err);
          setError('Failed to load assessments. Please try again later.');
        } finally {
          setLoading(false); // Set loading to false when fetching is done
        }
      };
      fetchCourse();
    }
  }, [course, courseId]);

  const handleAnswerChange = (questionId, option) => {
    const selectedAnswer = option.charAt(0); // Get the first character (A, B, C, or D)
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
    setError(''); // Clear error when an answer is selected
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple form submissions

    // Check if all questions have been answered
    const unanswered = assessments.some((assessment) => !selectedAnswers[assessment._id]);
    if (unanswered) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true); // Set submitting state to true

    let correctAnswersCount = 0;
    assessments.forEach((assessment) => {
      // Compare selected answer with the correct answer
      if (selectedAnswers[assessment._id] === assessment.answer) {
        correctAnswersCount += 1;
      }
    });

    const totalQuestions = assessments.length;
    const percentage = (correctAnswersCount / totalQuestions) * 100;
    const status = percentage >= 50 ? 'Completed' : 'Ongoing';

    // Update state with the score
    setScore(correctAnswersCount);
    setSubmitted(true);

    // Send the score and status to the backend
    try {
      await axios.post(`http://localhost:4000/api/enrollment/${userId}/submit-assessment`, {
        courseId,
        marksObtained: correctAnswersCount * 5,
        status, // Set status to "Completed" or "Ongoing"
      });
    } catch (err) {
      console.error("Error submitting assessment:", err);
      setError('Failed to submit your assessment. Please try again.');
    } finally {
      setIsSubmitting(false); // Set submitting state to false after completion
    }
  };

  const handleRetry = () => {
    // Reset the state to retry the test
    setSelectedAnswers({});
    setScore(0);
    setSubmitted(false);
    setError('');
    setCurrentQuestionIndex(0); // Reset to the first question
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessments.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const currentAssessment = assessments[currentQuestionIndex];

  return (
    <div className="test-page">
      <h1>Assessment for {title}</h1>
      {loading ? (
        <CircularProgress />
      ) : submitted ? (
        <div className="result">
          <h2>Your Score: {score} out of {assessments.length}</h2>
          {score / assessments.length >= 0.5 ? (
            <h3>Status: Completed</h3>
          ) : (
            <h3>Status: Ongoing</h3>
          )}
          <Button variant="contained" color="primary" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      ) : (
        <div>
          {error && <Alert severity="error" className="error-alert">{error}</Alert>} {/* Show alert for errors */}
          {assessments.length === 0 ? (
            <p>No assessments available</p>
          ) : (
            <div className="question-container">
              {/* Display the current question */}
              {currentAssessment && (
                <>
                  <h3>{currentAssessment.question}</h3>
                  <ul>
                    {currentAssessment.options.map((option, index) => (
                      <li key={index}>
                        <label>
                          <input
                            type="radio"
                            name={currentAssessment._id}
                            value={option}
                            onChange={() => handleAnswerChange(currentAssessment._id, option)}
                            checked={selectedAnswers[currentAssessment._id] === option.charAt(0)} // Check based on letter
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0} // Disable "Previous" on the first question
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={currentQuestionIndex === assessments.length - 1} // Disable "Next" on the last question
            >
              Next
            </Button>
          </div>

          {/* Submit Button */}
          {currentQuestionIndex === assessments.length - 1 && (
            <Button
              variant="contained"
              color="primary"
              className="submit-button"
              onClick={handleSubmit}
              disabled={isSubmitting} // Disable button if submitting
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TestPage;
