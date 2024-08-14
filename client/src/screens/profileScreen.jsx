import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser, setUser } from '../slices/authSlice';
import UploadForm from '../components/uploadForm';
import PostList from '../components/PostList';
import ForumPostList from '../components/ForumPostList';
import EventList from '../components/eventList';
import '../assets/style/profileScreen.css';
import apiBaseUrl from '../constants';
axios.defaults.withCredentials = true;

const ProfileScreen = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('');
  const [title,setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [img, setImg] = useState('');
  const [posts, setPosts] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [likedForumPosts, setLikedForumPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const dispatch = useDispatch();
  const { user: loggedInUser } = useSelector((state) => state.auth);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/users/${userId}`, { withCredentials: true });
      setProfileUser(data);
      setUserName(data.userName);
      setTitle(data.title);
      setEmail(data.email);
      setImg(data.img);

      // Fetch user's posts
      const { data: userPosts } = await axios.get(`${apiBaseUrl}/api/posts/user/${userId}`, { withCredentials: true });
      setPosts(userPosts);

      // Fetch user's forum posts
      const { data: userForumPosts } = await axios.get(`${apiBaseUrl}/api/forum/user/${userId}`, { withCredentials: true });
      setForumPosts(userForumPosts);

      // Fetch user's liked posts
      const { data: userLikedPosts } = await axios.get(`${apiBaseUrl}/api/posts/liked/${userId}`, { withCredentials: true });
      setLikedPosts(userLikedPosts);

      // Fetch user's liked forum posts
      const { data: userLikedForumPosts } = await axios.get(`${apiBaseUrl}/api/forum/liked/${userId}`, { withCredentials: true });
      setLikedForumPosts(userLikedForumPosts);

      // Fetch user's events
      const { data: userEvents } = await axios.get(`${apiBaseUrl}/api/events/user/${userId}`, { withCredentials: true });
      setEvents(userEvents);
      
      const { data: userSavedPosts } = await axios.get(`${apiBaseUrl}/api/posts/saved/${userId}`, { withCredentials: true });
      setSavedPosts(userSavedPosts);
    
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleModerator = async () => {
    alert('Moderator button clicked');
    try {
      const response = await axios.put(`${apiBaseUrl}/api/users/make-moderator/${profileUser._id}`, {}, {
        withCredentials: true,
      });
      setProfileUser(response.data.user); // Ensure profile user state is updated correctly
      alert('User role updated to moderator');
    } catch (error) {
      console.error('Error updating user role:', error);
      if (error.response && error.response.status === 401) {
        alert('Unauthorized. Please log in again.');
      }
    }
  };

  const handleUnmakeModerator = async () => {
    try {
      const response = await axios.put(`${apiBaseUrl}/api/users/unmake-moderator/${profileUser._id}`, {}, {
        withCredentials: true,
      });
      setProfileUser(response.data.user); // Ensure profile user state is updated correctly
      alert('User role updated to user');
    } catch (error) {
      console.error('Error updating user role:', error);
      if (error.response && error.response.status === 401) {
        alert('Unauthorized. Please log in again.');
      }
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    if (profileUser) {
      setUserName(profileUser.userName);
      setTitle(profileUser.title);
      setEmail(profileUser.email);
      setImg(profileUser.img);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiBaseUrl}/api/users/profile`, { userName,title, email, img }, {
        withCredentials: true,
      });
      setProfileUser(response.data);
      alert('Profile updated successfully');
      dispatch(setUser(response.data));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response && error.response.status === 401) {
        alert('Unauthorized. Please log in again.');
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match');
      return;
    }
    try {
      await axios.put(`${apiBaseUrl}/api/users/change-password`, { oldPassword, newPassword }, {
        withCredentials: true,
      });
      alert('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.response && error.response.status === 401) {
        alert('Unauthorized. Please log in again.');
      } else {
        alert('Error updating password');
      }
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      return;
    }
    try {
      await axios.delete(`${apiBaseUrl}/api/users/profile`, {
        withCredentials: true,
      });
      alert('Account deleted successfully');
      dispatch(clearUser());
      navigate("/");
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await axios.put(`${apiBaseUrl}/api/users/follow/${profileUser._id}`, {}, { withCredentials: true });
      alert('Followed successfully');
      dispatch(setUser({ ...loggedInUser, following: response.data.following }));
    } catch (error) {
      console.error('Error following user:', error.response ? error.response.data : error.message);
      alert('Error following user');
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await axios.put(`${apiBaseUrl}/api/users/unfollow/${profileUser._id}`, {}, { withCredentials: true });
      alert('Unfollowed successfully');
      dispatch(setUser({ ...loggedInUser, following: response.data.following }));
    } catch (error) {
      console.error('Error unfollowing user:', error.response ? error.response.data : error.message);
      alert('Error unfollowing user');
    }
  };

  const handleImageError = (e) => {
    e.target.src = '/uploads/defaultprofile.png';
  };

  const isFollowing = loggedInUser?.following?.some(followedUser => followedUser._id === profileUser?._id);

  return (
    <div className="profile-container">
      {profileUser ? (
        <>
          <h1>{profileUser.userName}</h1>
          <h2>{profileUser.title}</h2>
          <p>Email: {profileUser.email}</p>
          <img
            src={`${apiBaseUrl}/api/uploads/${profileUser.img}`}
            alt="Profile"
            className="profile-pic"
            onError={handleImageError}
          />
          <p>Following: {profileUser.following?.length || 0}</p>
          <ul>
            {profileUser.following?.map(followedUser => (
              <li key={followedUser._id}>
                <Link to={`/profile/${followedUser._id}`}>{followedUser.userName}</Link>
              </li>
            ))}
          </ul>

          {loggedInUser && loggedInUser._id !== profileUser._id && (
            <>
              {loggedInUser.role === 'admin' && (
                profileUser.role === 'moderator' ? (
                  <button onClick={handleUnmakeModerator}>Unmake Moderator</button>
                ) : (
                  <button onClick={handleModerator}>Make Moderator</button>
                )
              )}
              {isFollowing ? (
                <button onClick={handleUnfollow}>Unfollow</button>
              ) : (
                <button onClick={handleFollow}>Follow</button>
              )}
            </>
          )}

          {loggedInUser && loggedInUser._id === profileUser._id && (
            <>
              {isEditing ? (
                <>
                  <div className="form-group">
                    <label>User Name:</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Title:</label>
                    <input
                      type="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Profile Image URL:</label>
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => setImg(e.target.value)}
                    />
                  </div>
                  <UploadForm setImg={setImg} />
                  <button onClick={handleSubmit}>Save</button>
                  <button type="button" onClick={handleCancelClick}>Cancel</button>

                  <div className="form-group">
                    <label>Old Password:</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password:</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password:</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>
                  <button onClick={handlePasswordChange}>Change Password</button>
                  <button type="button" onClick={handleDeleteUser}>Delete Account</button>
                </>
              ) : (
                <button onClick={handleEditClick}>Edit Profile</button>
              )}
            </>
          )}

          {/* Display user's posts */}
          <h2>Posts</h2>
          <PostList posts={posts} user={loggedInUser} showButtons = {false} />

          {/* Display user's forum posts */}
          <h2>Forum Posts</h2>
          <ForumPostList forumPosts={forumPosts} setForumPosts={setForumPosts} fetchForumPosts={fetchUser} showButtons={false} />
          
          {/* Display user's liked posts */}
          <h2>Liked Posts</h2>
          <PostList posts={likedPosts} user={loggedInUser} showButtons = {false} />
          
          {/* Display user's liked forum posts */}
          <h2>Liked Forum Posts</h2>
          <ForumPostList forumPosts={likedForumPosts} setForumPosts={setForumPosts} fetchForumPosts={fetchUser}  showButtons = {false} />

          {/* Display user's events */}
          <h2>Events</h2>
          <EventList events={events} user={loggedInUser} showButtons = {false} />

          {/* Display saved posts */}
          <h2>Saved Posts</h2>
          <PostList posts={savedPosts} user={loggedInUser} setSavedPosts={setSavedPosts} showButtons={false} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfileScreen;