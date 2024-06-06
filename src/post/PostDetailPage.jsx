import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostDetailPage.scss';
import './MainPage.scss';
import CommentEditModal from './CommentEditModal';
import goodplace from '../img/Preview.png';
import logoupload from '../img/upload.png';
import PostEditModal from './PostEditModal';

const PostDetailPage = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [postLiked, setPostLiked] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editingPost, setEditingPost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAccessToken(token);
    fetchPostData();
  }, [postId]);

  const fetchPostData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data.data)
      setPost(response.data.data);
      setPostContent(response.data.data.content);
      setPostTitle(response.data.data.title);
      setLikeCount(response.data.data.likes);
      setPostLiked(response.data.data.isLikedByUser);
    } catch (error) {
      console.log(error.response.data);
      console.error('Error fetching post:', error);
      alert('게시글 상세페이지 오류');
    }
  };

  const fetchComments = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts/comments/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const fetchedComments = response.data.data.map(comment => ({
        ...comment,
        liked: comment.isLikedByUser,
      }));
      setComments(fetchedComments);
      setShowAllComments(true);
    } catch (error) {
      console.log(error.response.data);
      console.error('Error fetching all comments:', error);
    }
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComment = { comment: comment };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/comment/${postId}`,
        newComment,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setComments([...comments, response.data.data]);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handlePostLike = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/posts/likes/${postId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPostLiked(!postLiked);
      setLikeCount((prevCount) => (postLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error('Error toggling post like:', error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/posts/likes/${postId}/${commentId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.commentId === commentId
            ? {
                ...comment,
                liked: !comment.liked,
                likeCount: comment.liked ? comment.likeCount - 1 : comment.likeCount + 1,
              }
            : comment
        )
      );
    } catch (error) {
      console.error('Error adding comment like:', error);
    }
  };

  const handleCommentEdit = (comment) => {
    setEditingComment(comment);
    setIsCommentModalOpen(true);
  };

  const handleCommentEditCancel = () => {
    setEditingComment(null);
    setIsCommentModalOpen(false);
  };

  const handleCommentEditSave = async (updatedComment) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/posts/comments/${postId}/${editingComment.commentId}`,
        { comment: updatedComment },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.commentId === editingComment.commentId
            ? { ...comment, comment: updatedComment }
            : comment
        )
      );
      setEditingComment(null);
      setIsCommentModalOpen(false);
    } catch (error) {
      console.log(error.response.data.message);
      if (
        error.response.data.message === '댓글을 수정할 수 있는 권한이 없습니다.'
      ) {
        alert('댓글을 수정할 수 있는 권한이 없습니다.');
      } else {
        console.error('Error updating comment:', error);
      }
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/posts/comments/${postId}/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setComments(comments.filter((comment) => comment.commentId !== commentId));
    } catch (error) {
      console.log(error.response.data.message);
      if (error.response.data.message === '댓글을 삭제할 수 있는 권한이 없습니다.') {
        alert('댓글을 삭제할 수 있는 권한이 없습니다.');
      } else {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const handlePostEdit = () => {
    setEditingPost(true);
    setIsPostModalOpen(true);
  };

  const handlePostSave = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/posts/${postId}`,
        { title: postTitle, content: postContent },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setEditingPost(false);
      setIsPostModalOpen(false);
    } catch (error) {
      console.log(error.response.data.message);
      if (error.response.data.message === '접근 권한이 없습니다.') {
        alert('수정할 접근 권한이 없습니다.');
      } else {
        console.error('Error updating post:', error);
      }
    }
  };

  const handlePostDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      navigate('/main');
    } catch (error) {
      console.log(error.response.data.message);
      if (error.response.data.message === '접근 권한이 없습니다.') {
        alert('접근 권한이 없습니다.');
      } else {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handlePostEditCancel = () => {
    setEditingPost(false);
    setIsPostModalOpen(false);
  };

  const handleShowAllComments = async () => {
    fetchComments();
  };

  const handleNicknameClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleLogoClick = () => {
    navigate('/main');
  };

  if (!post) {
    return (
      <div className="post-detail-container">
        <h2 className="post-title">Post not found</h2>
      </div>
    );
  }
  return (
    <div className="post-detail-container">
      <img id="logos" src={goodplace} alt="logo" onClick={handleLogoClick} />
      <div className="post-header">
        <h2 className="post-title">{post.title}</h2>
        {post.nickname && (
          <small
            className="post-author">
           <span onClick={() => handleNicknameClick(post.userId)}
           className="post-nickname">    
            {post.nickname}</span>
          </small>
        )}
        <button className="like-button" onClick={handlePostLike}>
          {postLiked ? '💗' : '🤍'}
        </button>
        <button className="edit-button" onClick={handlePostEdit}>
          Edit
        </button>
        <button className="delete-button" onClick={handlePostDelete}>
          Delete
        </button>
      </div>
      <div className="post-content">
        {editingPost ? (
          <>
            <input
              className="post-edit-title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
            <textarea
              className="post-content-title"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <button onClick={handlePostSave}
            className="post-save">Save</button>
          </>
        ) : (
          <>
            {Array.isArray(post.imageUrl) ? (
              <div className="post-images">
                {post.imageUrl.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={post.title}
                    className="post-image"
                  />
                ))}
              </div>
            ) : (
              post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="post-image"
                />
              )
            )}
            <p>{post.content}</p>
          </>
        )}
      </div>
  
      <div className="comments">
        <h3>Comments</h3>
        <ul>
          {showAllComments && comments.map((comment) => (
            <li key={comment.commentId}>
              <p className="nickname">{comment.nickname}</p>
              <p>{comment.comment}</p>
              <button
                className="like-button"
                onClick={() => handleCommentLike(comment.commentId)}
                style={{ color: comment.liked ? 'blue' : 'black' }}
              >
                {comment.liked ? '💗' : '🤍'}
              </button>
              <button className="Edit-button" onClick={() => handleCommentEdit(comment)}>Edit</button>
              <button className="Delete-button" onClick={() => handleCommentDelete(comment.commentId)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
        {!showAllComments && (
          <button className="moreComments" onClick={handleShowAllComments}>댓글 더보기</button>
        )}
        <form onSubmit={handleSubmit}>
          <input type="text" value={comment} onChange={handleChange} />
          <button type="submit">
            <img id="logo2" src={logoupload} alt="logo" />
          </button>
        </form>
      </div>
  
      {isCommentModalOpen && (
        <CommentEditModal
          comment={editingComment}
          onSave={handleCommentEditSave}
          onCancel={handleCommentEditCancel}
        />
      )}
    </div>
  );
  
};

export default PostDetailPage;
