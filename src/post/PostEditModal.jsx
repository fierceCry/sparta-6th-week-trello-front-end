// PostEditModal.jsx
import React, { useState } from 'react';
import './CommentEditModal.scss';

const PostEditModal = ({ post, onSave, onCancel }) => {
  const [updatedTitle, setUpdatedTitle] = useState(post.title);
  const [updatedContent, setUpdatedContent] = useState(post.content);

  const handleSave = () => {
    onSave(updatedTitle, updatedContent);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Post</h3>
          <button className="close-button" onClick={handleCancel}>
            취소
          </button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            placeholder="Content"
          />
        </div>
        <div className="modal-footer">
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default PostEditModal;
