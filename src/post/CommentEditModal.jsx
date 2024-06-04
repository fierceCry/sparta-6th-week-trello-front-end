import React from 'react';
import './CommentEditModal.scss';

const CommentEditModal = ({ comment, onSave, onCancel }) => {
  const [updatedComment, setUpdatedComment] = React.useState(comment.comment);

  const handleSave = () => {
    onSave(updatedComment);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Comment</h3>
          <button className="close-button" onClick={handleCancel}>
            취소
          </button>
        </div>
        <div className="modal-body">
          <textarea
            value={updatedComment}
            onChange={(e) => setUpdatedComment(e.target.value)}
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

export default CommentEditModal;
