import './CardDetailModal.scss';
import React, { useState } from 'react';
import { X, Calendar, Paperclip, MessageSquare, Trash } from 'lucide-react';

const CardDetailModal = ({ isOpen, onClose, task, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(task.title);
  const [date, setDate] = useState(task.date || '');
  const [description, setDescription] = useState(task.description || '');
  const [comments, setComments] = useState(task.comments || []);
  const [newComment, setNewComment] = useState('');

  const handleSave = () => {
    onUpdate({ ...task, title, date, description, comments });
    onClose();
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now(), text: newComment }]);
      setNewComment('');
    }
  };

  const handleFileUpload = (event) => {
    console.log('File uploaded:', event.target.files[0]);
  };

  if (!isOpen) return null;

  return (
    <div className="card-modal-overlay">
      <div className="card-modal-content">
        <div className="card-modal-header">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="card-modal-title"
          />
          <button onClick={onClose} className="card-modal-close">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="card-modal-body">
          <div className="card-modal-date-input">
            <Calendar className="h-4 w-4" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <textarea
            placeholder="카드 설명을 추가하세요..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="card-modal-description"
          />
          <div className="card-modal-comments-section">
            <h4>댓글</h4>
            {comments.map((comment) => (
              <div key={comment.id} className="card-modal-comment">
                {comment.text}
              </div>
            ))}
            <div className="card-modal-add-comment">
              <input
                type="text"
                placeholder="댓글 추가..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleAddComment}>
                <MessageSquare className="h-4 w-4 mr-2" />
                추가
              </button>
            </div>
          </div>
          <div className="card-modal-file-upload">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Paperclip className="h-4 w-4 mr-2" />
              파일 첨부
            </label>
          </div>
        </div>
        <div className="card-modal-footer">
          <button onClick={handleSave} className="card-modal-save-button">
            변경 사항 저장
          </button>
          <button onClick={() => onDelete(task.id)} className="card-modal-delete-button">
            <Trash className="h-4 w-4 mr-2" />
            카드 삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;