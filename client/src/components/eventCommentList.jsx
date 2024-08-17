// client/src/components/eventCommentList.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import apiBaseUrl from '../constants';

const CommentList = ({ comments, eventId, updateComments }) => {
  const auth = useSelector((state) => state.auth);

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/eventComments/${eventId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${auth.user.token}` },
      });
      const { data: updatedComments } = await axios.get(`${apiBaseUrl}/api/eventComments/${eventId}/comments`);
      updateComments(eventId, updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEdit = async (commentId, content) => {
    try {
      await axios.put(`${apiBaseUrl}/api/eventComments/${eventId}/comments/${commentId}`, { content }, {
        headers: { Authorization: `Bearer ${auth.user.token}` },
      });
      const { data: updatedComments } = await axios.get(`${apiBaseUrl}/api/eventComments/${eventId}/comments`);
      updateComments(eventId, updatedComments);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  const handleLike = async (commentId) => {
    try {
      await axios.put(`${apiBaseUrl}/api/eventComments/${eventId}/comments/${commentId}/like`, {}, {
        headers: { Authorization: `Bearer ${auth.user.token}` },
      });
      const { data: updatedComments } = await axios.get(`${apiBaseUrl}/api/eventComments/${eventId}/comments`);
      updateComments(eventId, updatedComments);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };
  return (
    <div className="comment-list">
      {comments.map(comment => (
        console.log(comment.content , comment.userName),
        <Comment key={comment._id} comment={comment} eventId={eventId} handleDelete={handleDelete} handleEdit={handleEdit} handleLike={handleLike} />
      ))}
    </div>
  );
};

const Comment = ({ comment, eventId, handleDelete, handleEdit ,handleLike}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const auth = useSelector((state) => state.auth);

  const saveEdit = async () => {
    await handleEdit(comment._id, editedContent);
    setIsEditing(false);
  };

  return (
    <div className="comment">
      {isEditing ? (
        <>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            required
          />
          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p>{comment.content}</p>
          <small>
            Posted by {comment.user?.userName || 'Unknown'} on {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Invalid Date'}
          </small>
          <button onClick={() => handleLike(comment._id)}>
            {comment.likes && comment.likes.includes(auth.user._id) ? 'Unlike' : 'Like'} ({comment.likes ? comment.likes.length : 0})
          </button>
          {auth.user._id === comment.user?._id && (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => handleDelete(comment._id)}>Delete</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CommentList;