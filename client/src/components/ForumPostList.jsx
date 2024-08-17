// client/src/components/ForumPostList.jsx
import React, { useState } from 'react';
import CommentList from './forumCommentList.jsx';
import CommentForm from './forumCommentForm.jsx';
import axios from 'axios';
import { useSelector } from 'react-redux';
import apiBaseUrl from '../constants';
axios.defaults.withCredentials = true;

const ForumPostList = ({ forumPosts, setForumPosts, fetchForumPosts , showButtons = true }) => {
  const auth = useSelector((state) => state.auth);
  const [editPost, setEditPost] = useState(null);
  const [editContent, setEditContent] = useState('');

  const updateComments = (forumPostId, comments) => {
    const updatedPosts = forumPosts.map(post =>
      post._id === forumPostId ? { ...post, comments } : post
    );
    setForumPosts(updatedPosts);
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/forum/${postId}`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      });
      setForumPosts(forumPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditPost = (post) => {
    setEditPost(post);
    setEditContent(post.content);
  };

  const handleSaveEdit = async (postId) => {
    try {
      const { data: updatedPost } = await axios.put(`${apiBaseUrl}/api/forum/${postId}`, { content: editContent }, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      });
      setForumPosts(forumPosts.map(post => post._id === postId ? updatedPost : post));
      setEditPost(null);
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const { data: updatedPost } = await axios.put(`${apiBaseUrl}/api/forum/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${auth.user.token}` },
      });
      setForumPosts(forumPosts.map(post => post._id === postId ? updatedPost : post));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleStickPost = async (postId, isSticky) => {
    try {
      const { data: updatedPost } = await axios.put(`${apiBaseUrl}/api/forum/${postId}`, { is_sticky: isSticky }, {
        headers: { Authorization: `Bearer ${auth.user.token}` },
      });
      fetchForumPosts(); // Re-fetch forum posts to update the order
    } catch (error) {
      console.error("Error sticking post:", error);
    }
  };

  return (
    <div className="forum-post-list">
      {forumPosts.length === 0 ? (
        <p>No posts to display</p>
      ) : (
        forumPosts.map(post => (
          <div key={post._id} className="forum-post">
            <h2>{post.title}</h2>
            {editPost && editPost._id === post._id ? (
              <>
                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                {showButtons && (
                  <>
                    <button onClick={() => handleSaveEdit(post._id)}>Save</button>
                    <button onClick={() => setEditPost(null)}>Cancel</button>
                  </>
                )}
              </>
            ) : (
              <>
                <p>{post.content}</p>
                {showButtons && (
                  <>
                    <button onClick={() => handleLikePost(post._id)}>
                      {post.likes.includes(auth.user._id) ? 'Unlike' : 'Like'} ({post.likes.length})
                    </button>
                    {(auth.user._id === post.user._id || auth.user.role === 'moderator' || auth.user.role === 'admin') && (
                      <>
                        <button onClick={() => handleEditPost(post)}>Edit</button>
                        <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                      </>
                    )}
                    {(auth.user.role === 'moderator' || auth.user.role === 'admin') && (
                      <button onClick={() => handleStickPost(post._id, !post.is_sticky)}>
                        {post.is_sticky ? 'Unstick' : 'Stick'}
                      </button>
                    )}
                  </>
                )}
              </>
            )}
            <small>Posted by {post.user.userName} on {new Date(post.createdAt).toLocaleDateString()}</small>
            {showButtons && (
              <>
                <CommentList comments={post.comments} forumPostId={post._id} updateComments={updateComments} />
                <CommentForm forumPostId={post._id} updateComments={updateComments} />
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ForumPostList;