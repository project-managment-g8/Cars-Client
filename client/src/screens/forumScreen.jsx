import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ForumPostList from '../components/ForumPostList';
import ForumPostForm from '../components/ForumPostForm';
import { useSelector } from 'react-redux';
import '../assets/style/Forum.css';
import '../assets/style/form.css';
import apiBaseUrl from '../constants';
axios.defaults.withCredentials = true;

const Forum = () => {
  const [forumPosts, setForumPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const auth = useSelector((state) => state.auth);

  const fetchForumPosts = async (category = '') => {
    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/forum`, {
        params: { category },
      });
      console.log("Forum - Fetched Posts:", data);
      setForumPosts(data);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
    }
  };

  useEffect(() => {
    fetchForumPosts();
  }, []);

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    fetchForumPosts(e.target.value);
  };

  return (
    <div className="form-container">
      <h1>Forum</h1>
      <p>Welcome to the forum. Here you can ask questions and give advice to other users.</p>
      {auth.isAuthenticated && (
        <>
          <button className="toggle-form-button" onClick={toggleFormVisibility}>
            {showForm ? 'Close' : 'Add Post'}
          </button>
          {showForm && <ForumPostForm fetchForumPosts={fetchForumPosts} />}
        </>
      )}
      <div>
        <label htmlFor="category-filter">Filter by category: </label>
        <select
          id="category-filter"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">All</option>
          <option value="Recommendation">Recommendation</option>
          <option value="Advice">Advice</option>
          <option value="Question">Question</option>
          <option value="Problem">Problem</option>
        </select>
      </div>
      <ForumPostList forumPosts={forumPosts} setForumPosts={setForumPosts} fetchForumPosts={fetchForumPosts} />
    </div>
  );
};

export default Forum;