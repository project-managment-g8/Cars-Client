// client/src/components/FeedbackForm.jsx
import React, { useState } from 'react';
import '../assets/style/form.css';

const FeedbackForm = ({ submitFeedback }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    submitFeedback(feedback);
    setFeedback('');
  };

  return (
    <div className="form-container">
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Write your feedback here..."
      />
      <button onClick={handleSubmit}>Submit Feedback</button>
    </div>
  );
};

export default FeedbackForm;