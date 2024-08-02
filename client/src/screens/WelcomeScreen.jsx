// client/src/screens/WelcomeScreen.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';
import FeedbackForm from '../components/FeedbackForm';
import { useAuth } from '../context/AuthContext';
import '../assets/style/welcomeScreen.css';

const WelcomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('/api/posts');
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const submitFeedback = async (content) => {
    try {
      await axios.post('/api/feedback', { content });
      alert('Feedback submitted successfully');
    } catch (error) {
      alert('Error submitting feedback');
    }
  };

  const addPost = async (newPost) => {
    const formData = new FormData();
    formData.append('content', newPost.content);
    formData.append('image', newPost.img);

    try {
      const { data } = await axios.post('/api/posts/post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPosts([...posts, data]);
      setShowPostForm(false);
      alert('Post submitted successfully');
    } catch (error) {
      alert('Error submitting post');
    }
  };

  const likePost = async (id) => {
    try {
      console.log('Liking post with ID:', id);
      const { data } = await axios.put(`/api/posts/${id}/like`);
      setPosts((prevPosts) => prevPosts.map((post) => (post._id === id ? data : post)));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const deletePost = async (id) => {
    try {
      console.log('Attempting to delete post with ID:', id);
      await axios.delete(`/api/posts/${id}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  return (
    <div className="welcome-screen">
      <div className="content">
        <h1>
          Posts
          <button onClick={() => setShowPostForm(!showPostForm)} className="add-btn">
            +
          </button>
        </h1>
        {showPostForm && <PostForm addPost={addPost} />}
        <PostList posts={posts} user={user} likePost={likePost} deletePost={deletePost} />
      </div>
      <div className="feedback-section">
        <h2>
          Feedback
          <button onClick={() => setShowFeedbackForm(!showFeedbackForm)} className="add-btn">
            +
          </button>
        </h2>
        {showFeedbackForm && <FeedbackForm submitFeedback={submitFeedback} />}
      </div>
    </div>
  );
};

export default WelcomeScreen;