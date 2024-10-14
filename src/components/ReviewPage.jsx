import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ReviewPage = () => {
  const { courseId } = useParams();
  const [review, setReview] = useState('');
  
  const submitReview = async () => {
    try {
      await axios.post(`/api/courses/${courseId}/review`, { review });
      alert('Review submitted successfully');
    } catch (error) {
      console.error('Error submitting review', error);
    }
  };

  return (
    <div>
      <h2>Leave a Review</h2>
      <textarea 
        value={review} 
        onChange={(e) => setReview(e.target.value)} 
        placeholder="Write your review here"
      />
      <button onClick={submitReview}>Submit Review</button>
    </div>
  );
};

export default ReviewPage;
