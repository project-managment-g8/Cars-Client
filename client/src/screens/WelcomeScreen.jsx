import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';
import FeedbackForm from '../components/FeedbackForm';
import EventList from '../components/eventList';
import EventForm from '../components/eventForm';
import { useAuth } from '../context/AuthContext';
import '../assets/style/welcomeScreen.css';
import apiBaseUrl from '../constants';

axios.defaults.withCredentials = true;

const WelcomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);  // Add savedPosts state
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/posts` ,{ withCredentials: true });
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/events`);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    const fetchSavedPosts = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/posts/saved/${user._id}`, { withCredentials: true });
        setSavedPosts(data);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      }
    };
    fetchPosts();
    fetchEvents();
    fetchSavedPosts();
  }, []);

  const submitFeedback = async (content) => {
    try {
      await axios.post(`${apiBaseUrl}/api/feedback`, { content });
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
      const { data } = await axios.post(`${apiBaseUrl}/api/posts/post`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPosts([...posts, data]);
      setShowPostForm(false);
      alert('Post submitted successfully');
    } catch (error) {
      alert('Error submitting post');
    }
  };

  const editPost = async (postId, updatedPost) => {
    try {
      const { data } = await axios.put(`${apiBaseUrl}/api/posts/${postId}`, updatedPost, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPosts((prevPosts) => prevPosts.map((p) => (p._id === postId ? data : p)));
      alert('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post');
    }
  };

  const likePost = async (id) => {
    try {
      const { data } = await axios.put(`${apiBaseUrl}/api/posts/${id}/like`);
      setPosts((prevPosts) => prevPosts.map((post) => (post._id === id ? data : post)));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/posts/${id}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };
  const sharePost = async (postId) => {
    try {
      const { data } = await axios.post(`${apiBaseUrl}/api/posts/${postId}/share`);
      setPosts((prevPosts) => [...prevPosts, data]);
      alert('Post shared successfully');
    } catch (error) {
      console.error('Error sharing post:', error);
      alert('Error sharing post');
    }
  };
  const addEvent = async (newEvent) => {
    const formData = new FormData();
    formData.append('title', newEvent.title);
    formData.append('description', newEvent.description);
    formData.append('date', newEvent.date);
    formData.append('image', newEvent.img);

    try {
      const { data } = await axios.post(`${apiBaseUrl}/api/events`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEvents([...events, data]);
      setShowEventForm(false);
      alert('Event submitted successfully');
    } catch (error) {
      alert('Error submitting event');
    }
  };

  const editEvent = async (eventId, updatedEvent) => {
    try {
      const { data } = await axios.put(`${apiBaseUrl}/api/events/${eventId}`, updatedEvent, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEvents((prevEvents) => prevEvents.map((e) => (e._id === eventId ? data : e)));
      alert('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event');
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/events/${eventId}`);
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
      alert('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
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
        <PostList
          posts={posts}
          user={user}
          likePost={likePost}
          deletePost={deletePost}
          editPost={editPost}
          sharePost={sharePost}
          savedPosts={savedPosts}
          setSavedPosts={setSavedPosts}
          showButtons={true}
        />
      </div>
      <div className="content">
        <h1>
          Events
          <button onClick={() => setShowEventForm(!showEventForm)} className="add-btn">
            +
          </button>
        </h1>
        {showEventForm && <EventForm addEvent={addEvent} />}
        <EventList events={events} user={user} editEvent={editEvent} deleteEvent={deleteEvent} />
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