import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser, setUser } from '../slices/authSlice';
import UploadForm from '../components/uploadForm';
import '../assets/style/profileScreen.css';

const ProfileScreen = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [img, setImg] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const dispatch = useDispatch();
  const { user: loggedInUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/${userId}`, { withCredentials: true });
        setProfileUser(data);
        setUserName(data.userName);
        setEmail(data.email);
        setImg(data.img);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    if (profileUser) {
      setUserName(profileUser.userName);
      setEmail(profileUser.email);
      setImg(profileUser.img);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/users/profile', { userName, email, img }, {
        withCredentials: true,
      });
      setProfileUser(response.data);
      alert('Success');
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
      await axios.put('/api/users/change-password', { oldPassword, newPassword }, {
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
      await axios.delete('/api/users/profile', {
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
      const response = await axios.put(`/api/users/follow/${profileUser._id}`, {}, { withCredentials: true });
      alert('Followed successfully');
      setProfileUser({ ...profileUser, following: response.data.following });
      dispatch(setUser({ ...loggedInUser, following: response.data.following }));
    } catch (error) {
      console.error('Error following user:', error);
      if (error.response && error.response.status === 401) {
        alert('Unauthorized. Please log in again.');
      } else {
        alert('Error following user');
      }
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await axios.put(`/api/users/unfollow/${profileUser._id}`, {}, { withCredentials: true });
      alert('Unfollowed successfully');
      setProfileUser({ ...profileUser, following: response.data.following });
      dispatch(setUser({ ...loggedInUser, following: response.data.following }));
    } catch (error) {
      console.error('Error unfollowing user:', error);
      if (error.response && error.response.status === 401) {
        alert('Unauthorized. Please log in again.');
      } else {
        alert('Error unfollowing user');
      }
    }
  };
  const handleImageError = (e) => {
    e.target.src = '/defaultprofile.png';
  };
  const isFollowing = loggedInUser?.following?.some(followedUserId => followedUserId.toString() === profileUser?._id.toString());
  console.log('loggedInUser:', loggedInUser);
  console.log('profileUser:', profileUser);
  console.log('isFollowing:', isFollowing);

  return (
    <div className="profile-container">
      {profileUser ? (
        <>
          <h1>{profileUser.userName}</h1>
          <p>Email: {profileUser.email}</p>
          <img 
            src={`/api/uploads/${profileUser.img}`} 
            alt="Profile" 
            className="profile-pic"
            onError={handleImageError}
          />
          <p>Following: {profileUser.following.length}</p>
          <ul>
            {profileUser.following.map(followedUser => (
              <li key={followedUser._id}>
                <Link to={`/profile/${followedUser._id}`}>{followedUser.userName}</Link>
              </li>
            ))}
          </ul>

          {loggedInUser && loggedInUser._id !== profileUser._id && (
            <>
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
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfileScreen;