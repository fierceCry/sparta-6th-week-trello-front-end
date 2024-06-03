import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostDetailPage.scss';

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

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setAccessToken(token);
        const fetchPostData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:3095/posts/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPost(response.data.data);
                setPostContent(response.data.data.content);
                if (response.data.data.comment) {
                    setComments(response.data.data.comment);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPostData();
    }, [postId]);

    const handleChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newComment = {
            comment: comment,
        };
        try {
            const response = await axios.post(`http://127.0.0.1:3095/posts/comment/${postId}`, newComment, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setComments([...comments, response.data.data]);
            setComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handlePostLike = async () => {
        try {
            await axios.patch(`http://127.0.0.1:3095/posts/likes/${postId}`, null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setPostLiked(!postLiked);
        } catch (error) {
            console.error('Error toggling post like:', error);
        }
    };

    const handleCommentLike = async (commentId) => {
        try {
            await axios.patch(`http://127.0.0.1:3095/posts/likes/${postId}/${commentId}`, null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.commentId === commentId
                        ? { ...comment, liked: !comment.liked }
                        : comment
                )
            );
        } catch (error) {
            console.error('Error adding comment like:', error);
        }
    };

    const handleCommentEdit = (commentId) => {
        setEditingComment(commentId);
    };

    const handleCommentSave = async (commentId) => {
        try {
            const updatedComment = comments.find((comment) => comment.commentId === commentId);
            const updatedCommentText = updatedComment.comment;
    
            // 서버에 새로운 댓글 텍스트 전송
            const response = await axios.patch(`http://127.0.0.1:3095/posts/comments/${postId}/${commentId}`, { comment: updatedCommentText }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(response);
            setEditingComment(null);
        } catch (error) {
            console.log(error.response.data.message)
            if (error.response.data.message === '댓글을 수정할 수 있는 권한이 없습니다.') {
                alert('댓글을 수정할 수 있는 권한이 없습니다.');
            } else {
                console.error('Error updating comment:', error);
            }
        }
    };
    
    const handleCommentDelete = async (commentId) => {
        try {
            await axios.delete(`http://127.0.0.1:3095/posts/comments/${postId}/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setComments(comments.filter((comment) => comment.commentId !== commentId));
        } catch (error) {
            console.log(error.response.data.message)
            console.log(error.response.data.message === '댓글을 삭제할 수 있는 권한이 없습니다.')
            if (error.response.data.message === '댓글을 삭제할 수 있는 권한이 없습니다.') {
                alert('댓글을 삭제할 수 있는 권한이 없습니다.');
            } else {
                console.error('Error deleting comment:', error);
            }
        }
    };
    

    const handlePostEdit = () => {
        setEditingPost(true);
    };

    const handlePostSave = async () => {
        try {
            await axios.patch(`http://127.0.0.1:3095/posts/${postId}`, { content: postContent }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setEditingPost(false);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handlePostDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:3095/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            navigate('/'); // Redirect to home page after deletion
        } catch (error) {
            console.error('Error deleting post:', error);
        }
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
            <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
                {post.nickname && <small className="post-author">by {post.nickname}</small>}
                <button className="like-button" onClick={handlePostLike}>
                    {postLiked ? 'Unlike' : 'Like'}
                </button>
                <button className="edit-button" onClick={handlePostEdit}>Edit</button>
                <button className="delete-button" onClick={handlePostDelete}>Delete</button>
            </div>
            <div className="post-content">
                {editingPost ? (
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                    />
                ) : (
                    <>
                        {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="post-image" />}
                        <p>{post.content}</p>
                    </>
                )}
                {editingPost && <button onClick={handlePostSave}>Save</button>}
            </div>

            <div className="comments">
                <h3>Comments</h3>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.commentId}>
                            {editingComment === comment.commentId ? (
                                <>
                                    <textarea
                                        value={comment.comment}
                                        onChange={(e) =>
                                            setComments(comments.map((c) =>
                                                c.commentId === comment.commentId
                                                    ? { ...c, comment: e.target.value }
                                                    : c
                                            ))
                                        }
                                    />
                                    <button onClick={() => handleCommentSave(comment.commentId)}>Save</button>
                                </>
                            ) : (
                                <>
                                    <p>{comment.nickname}</p>
                                    <p>{comment.comment}</p>
                                    <button
                                        className="like-button"
                                        onClick={() => handleCommentLike(comment.commentId)}
                                        style={{ color: comment.liked ? 'blue' : 'black' }}
                                    >
                                        {comment.liked ? 'Unlike' : 'Like'}
                                    </button>
                                    <button onClick={() => handleCommentEdit(comment.commentId)}>Edit</button>
                                    <button onClick={() => handleCommentDelete(comment.commentId)}>Delete</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={comment} onChange={handleChange} />
                    <button type="submit">Add Comment</button>
                </form>
            </div>
        </div>
    );
};

export default PostDetailPage;
