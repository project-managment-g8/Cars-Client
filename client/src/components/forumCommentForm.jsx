// client/src/components/forumCommentForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import apiBaseUrl from '../constants';
import '../assets/style/form.css';
const CommentForm = ({ forumPostId, updateComments }) => {
  const [content, setContent] = useState('');
  const auth = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: newComment } = await axios.post(`${apiBaseUrl}/api/forumComments/${forumPostId}/comments`, { content, forumPostId }, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      });
      setContent('');
      const { data: comments } = await axios.get(`${apiBaseUrl}/api/forumComments/${forumPostId}/comments`);
      updateComments(forumPostId, comments);
    } catch (error) {
      console.error('Error creating comment:', error); // Log the error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment"
        required
      />
      <button type="submit">Post Comment</button>
    </form>
  );
};

export default CommentForm;