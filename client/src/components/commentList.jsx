// client/src/components/CommentList.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CommentList = ({ comments, forumPostId, updateComments }) => {
  const auth = useSelector((state) => state.auth);

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${auth.user.token}` },
      });
      const { data: updatedComments } = await axios.get(`/api/forum/${forumPostId}/comments`);
      updateComments(forumPostId, updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEdit = async (commentId, content) => {
    try {
      const { data: updatedComment } = await axios.put(`/api/comments/${commentId}`, { content }, {
        headers: { Authorization: `Bearer ${auth.user.token}` },
      });
      const { data: updatedComments } = await axios.get(`/api/forum/${forumPostId}/comments`);
      updateComments(forumPostId, updatedComments);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <div className="comment-list">
      {comments.map(comment => (
        <Comment key={comment._id} comment={comment} forumPostId={forumPostId} handleDelete={handleDelete} handleEdit={handleEdit} />
      ))}
    </div>
  );
};

const Comment = ({ comment, forumPostId, handleDelete, handleEdit }) => {
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