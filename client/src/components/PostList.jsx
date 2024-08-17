import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiBaseUrl from '../constants';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faEdit, faTrash, faSave, faShareSquare } from '@fortawesome/free-solid-svg-icons';
const PostList = ({ posts, user, likePost, deletePost, editPost,sharePost,savedPosts =[] , setSavedPosts , showButtons = true }) => {

  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostContent, setEditingPostContent] = useState("");
  const [editingPostImage, setEditingPostImage] = useState(null);

  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setEditingPostContent(post.content);
    setEditingPostImage(null); // Reset image on edit click
  };

  const handleEditChange = (e) => {
    setEditingPostContent(e.target.value);
  };

  const handleImageChange = (e) => {
    setEditingPostImage(e.target.files[0]);
  };

  const handleEditSubmit = (post) => {
    const updatedPost = new FormData();
    updatedPost.append('content', editingPostContent);
    if (editingPostImage) {
      updatedPost.append('image', editingPostImage);
    }
    editPost(post._id, updatedPost);
    setEditingPostId(null);
  };
  const handleShare = async (post) => {
    await sharePost(post._id);
  };
  const savePost = async (id) => {
    try {
        const response = await axios.put(`${apiBaseUrl}/api/posts/${id}/save`);
        const { message } = response.data;
        if (message === "Post saved") {
            if (setSavedPosts) {
                setSavedPosts(prev => [...prev, posts.find(post => post._id === id)]);
            }
        } else if (message === "Post unsaved") {
            if (setSavedPosts) {
                setSavedPosts(prev => prev.filter(post => post._id !== id));
            }
        }

        alert(message);
    } catch (error) {
        console.error('Error saving post:', error);
        alert('Error saving post');
    }
};
  const isPostSaved = (postId) => {
    console.log("Saved Posts:", savedPosts);
    console.log("Checking Post ID:", postId);
    console.log(savedPosts.some(post => post._id === postId));
    return savedPosts.some(post => post._id === postId);
  };
  return (
    <ul>
      {posts.map((post) => (
        <li key={post._id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <Link to={`/profile/${post.user?._id}`}>
            <strong>{post.user?.userName}</strong>
          </Link>
          {post.sharedFrom && (
            <p>Shared from: <Link to={`/profile/${post.sharedFrom.user?._id}`}>{post.sharedFrom.user?.userName}</Link></p>
          )}
          {editingPostId === post._id ? (
            <>
              <textarea
                value={editingPostContent}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', borderColor: '#ccc', marginBottom: '10px' }}
              />
              <input type="file" onChange={handleImageChange} style={{ marginBottom: '10px' }} />
              <button onClick={() => handleEditSubmit(post)} style={{ marginRight: '10px' }}>Save</button>
              <button onClick={() => setEditingPostId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <p>{post.content}</p>
              {post.image && (
                <img
                  src={`${apiBaseUrl}/api/uploads/${post.image}`}
                  alt="Post"
                  style={{ width: '100%', maxWidth: '600px', borderRadius: '8px', marginTop: '10px' }}
                />
              )}
              <p>Likes: {post.likes.length}</p>
              {showButtons && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => likePost(post._id)}>
                    {post.likes.includes(user._id) ? 'Unlike' : 'Like'} <FontAwesomeIcon icon={faThumbsUp} />
                  </button>
                  {user && post.user && user._id === post.user._id && (
                    <>
                      <button onClick={() => handleEditClick(post)}>Edit <FontAwesomeIcon icon={faEdit} /></button>
                      <button onClick={() => deletePost(post._id)}>Delete <FontAwesomeIcon icon={faTrash} /></button>
                    </>
                  )}
                  <button onClick={() => savePost(post._id)}>
                    {isPostSaved(post._id) ? 'Unsave' : 'Save'} <FontAwesomeIcon icon={faSave} />
                  </button>
                  <button onClick={() => handleShare(post)}>Share <FontAwesomeIcon icon={faShareSquare} /></button>
                </div>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default PostList;