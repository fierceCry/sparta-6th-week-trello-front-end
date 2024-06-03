import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainPage.scss';

const MainPage = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    imageUrl: '',
    regionId: 1, // 카테고리 값을 regionId로 설정
  });
  const navigate = useNavigate();

  useEffect(() => {
    // 액세스 토큰 확인
    const accessToken = localStorage.getItem('accessToken');

    // 액세스 토큰이 없으면 로그인 페이지로 이동
    if (!accessToken) {
      navigate('/sign-in');
      return;
    }

    // fetchPosts 함수 내부에서 accessToken 가져오기
    const fetchPosts = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(
          `http://127.0.0.1:3095/posts/posts?sort=${sortOrder}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const postsData = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];
        setAllPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    // 게시글 데이터 가져오는 함수 호출
    fetchPosts();
  }, [navigate, sortOrder]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await axios.delete('http://127.0.0.1:3095/auth/sign-out', {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      alert('로그아웃에 성공했습니다.');
      navigate('/sign-in');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  const handleSortToggle = () => {
    const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newSortOrder);
  };

  const handleCreateFormToggle = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({
      ...newPost,
      [name]: value,
    });
  };

  const handleCreatePost = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const { title, content, imageUrl, regionId } = newPost;
      const response = await axios.post(
        'http://127.0.0.1:3095/posts/posts',
        { title, content, imageUrl, regionId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.message === '게시글 생성에 성공하였습니다.') {
        alert('게시글이 생성되었습니다.');
        setShowCreateForm(false);
        setNewPost({ title: '', content: '', imageUrl: '', regionId: '' });
        // 생성 후에 필요한 경우에만 조회
        fetchPosts(); // fetchPosts 직접 호출
      }
    } catch (error) {
      console.error('게시글 생성 중 오류 발생:', error);
      alert('게시글 생성 중 오류가 발생했습니다.');
    }
  };

  // 서버에서 게시글 데이터를 가져오는 비동기 함수 정의
  const fetchPosts = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `http://127.0.0.1:3095/posts/posts?sort=${sortOrder}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const postsData = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];
      setAllPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div className="main-page-container">
      <header className="main-header">
        <h1 className="site-title">만규와 아이들</h1>
        <div className="links">
          <Link to="/mypage">Go to My Page</Link>
          <button onClick={handleSortToggle}>
            {sortOrder === 'desc' ? 'Sort Desc' : 'Sort Asc'}
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <ul className="posts-grid">
        {allPosts.map((post) => (
          <li className="post-card" key={post.postId}>
            <Link to={`/post/${post.postId}`} className="post-link">
              {post.imageUrl && (
                <img
                  src={
                    Array.isArray(post.imageUrl)
                      ? post.imageUrl[0]
                      : post.imageUrl
                  }
                  alt={post.title}
                  className="post-image"
                />
              )}
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>by {post.author}</small>
            </Link>
          </li>
        ))}
      </ul>
      {showCreateForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCreateFormToggle}>
              &times;
            </span>
            <h2>Create a New Post</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newPost.title}
              onChange={handleInputChange}
            />
            <textarea
              name="content"
              placeholder="Content"
              value={newPost.content}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={newPost.imageUrl}
              onChange={handleInputChange}
            />
            <select
              name="category"
              value={newPost.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              <option value="수도권">수도권</option>
              <option value="충청권">충청권</option>
              <option value="호남권">호남권</option>
              <option value="영남권">영남권</option>
              <option value="강원권">강원권</option>
              <option value="제주권">제주권</option>
            </select>
            <button onClick={handleCreatePost}>Create Post</button>
          </div>
        </div>
      )}
      <button onClick={handleCreateFormToggle}>Create a New Post</button>
    </div>
  );
};

export default MainPage;
