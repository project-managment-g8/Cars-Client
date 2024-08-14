// client/src/components/ForumPostForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import apiBaseUrl from '../constants';
import '../assets/style/form.css';
const ForumPostForm = ({ fetchForumPosts }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiBaseUrl}/api/forum`, { title, content });
      setTitle('');
      setContent('');
      fetchForumPosts();
    } catch (error) {
      console.error('Error creating forum post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      >
        <option value="" disabled>Select a category</option>
        <option value="Recommendation">Recommendation</option>
        <option value="Advice">Advice</option>
        <option value="Question">Question</option>
        <option value="Problem">Problem</option>
      </select>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <button type="submit">Post</button>
    </form>
  );
};

export default ForumPostForm;