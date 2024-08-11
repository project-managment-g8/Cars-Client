// client/src/components/PostForm.jsx
import React, { useState } from 'react';
import UploadForm from './uploadForm';
import '../assets/style/form.css';

const PostForm = ({ addPost }) => {
  const [newPost, setNewPost] = useState({ content: '', img: null });

  const handlePostChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (filePath) => {
    setNewPost({ ...newPost, img: filePath });
  };

  const submitPost = (e) => {
    e.preventDefault();
    addPost(newPost);
    setNewPost({ content: '', img: null });
  };

  return (
    <div className="form-container">
      <input
        type="text"
        name="content"
        value={newPost.content}
        onChange={handlePostChange}
        placeholder="New post content"
      />
      <UploadForm setImg={handleFileUpload} />
      <button onClick={submitPost}>Add Post</button>
    </div>
  );
};

export default PostForm;