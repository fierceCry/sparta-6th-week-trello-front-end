import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import goodplace from '../img/Preview.png';
import mypage from '../img/user.png';
import logout from '../img/logout.png';

const MainPage = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    imageUrl: '',
    regionId: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [currentCategory, setCurrentCategory] = useState('');
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts/posts?sort=${sortOrder}&page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const { data, totalPages } = response.data;
      setTotalPages(totalPages);
      const postsData = Array.isArray(data) ? data : [data];
      setAllPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchCategoryPosts = async (regionId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts/category/${regionId}?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const { data, totalPages } = response.data;
      setTotalPages(totalPages);
      const postsData = Array.isArray(data) ? data : [data];
      setAllPosts(postsData);
    } catch (error) {
      console.error('Error fetching category posts:', error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/sign-in');
      return;
    }
    if (currentCategory) {
      fetchCategoryPosts(currentCategory);
    } else {
      fetchPosts();
    }
  }, [navigate, sortOrder, currentPage, currentCategory]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await axios.delete(`${process.env.REACT_APP_API_URL}/auth/sign-out`, {
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
        `${process.env.REACT_APP_API_URL}/posts/posts`,
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
        setNewPost({ title: '', content: '', imageUrl: '', regionId: 1 });
        fetchPosts();
      }
    } catch (error) {
      console.error('게시글 생성 중 오류 발생:', error);
      alert('게시글 생성 중 오류가 발생했습니다.');
    }
  };

  const handleCategoryFilter = (regionName) => {
    let regionId;
    switch (regionName) {
      case '충청권':
        regionId = 2;
        break;
      case '호남권':
        regionId = 3;
        break;
      case '영남권':
        regionId = 4;
        break;
      case '강원권':
        regionId = 5;
        break;
      case '제주권':
        regionId = 6;
        break;
      default:
        regionId = 1;
    }
    setCurrentCategory(regionId);
    setCurrentPage(1);
  };

  const handleImageInputChange = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files);

    Promise.all(
      fileArray.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
          if (file) {
            reader.readAsDataURL(file);
          }
        });
      })
    ).then((images) => {
      setNewPost((prevState) => ({
        ...prevState,
        imageUrl: images,
      }));
    });
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    console.log(value)
    let regionId = 1;
    switch (value) {
      case '충청권':
        regionId = 2;
        break;
      case '호남권':
        regionId = 3;
        break;
      case '영남권':
        regionId = 4;
        break;
      case '강원권':
        regionId = 5;
        break;
      case '제주권':
        regionId = 6;
        break;
      default:
        regionId = 1;
    }
    setNewPost((prevState) => ({
      ...prevState,
      regionId: regionId,
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="main-page-container">
      <header className="main-header">
        <div className="links">
          <img id="logo" src={goodplace} alt="logo" />
          <Link to="/mypage">
            <img id="user-icon" src={mypage} alt="user" />
          </Link>
          <button id="logout-icon-btn" onClick={handleLogout}>
            <img id="logout-icon" src={logout} alt="logout" />
          </button>
        </div>
      </header>
      <h1 id="site-title-first" className="site-title">뭐 먹고싶어</h1>
      <h1 id="site-title-second" className="site-title">골라</h1>
      <Link src="../img/Eat.jpg"></Link>
      <div id='main-middle-aboutpost'>
        <button className="common-button" onClick={handleCreateFormToggle}>글쓰기</button>
        <h2>지역별로 고르기</h2>
        <div className="category-buttons">
          <button className="region-button" onClick={() => handleCategoryFilter('수도권')}>수도권</button>
          <button className="region-button" onClick={() => handleCategoryFilter('충청권')}>충청권</button>
          <button className="region-button" onClick={() => handleCategoryFilter('호남권')}>호남권</button>
          <button className="region-button" onClick={() => handleCategoryFilter('영남권')}>영남권</button>
          <button className="region-button" onClick={() => handleCategoryFilter('강원권')}>강원권</button>
          <button className="region-button" onClick={() => handleCategoryFilter('제주권')}>제주권</button>
        </div>
        <button className="common-button" onClick={handleSortToggle}>
          {sortOrder === 'desc' ? '오래된순' : '최신순'}
        </button>
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => {
          if (totalPages <= 5) {
            return (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                disabled={index + 1 === currentPage}
              >
                {index + 1}
              </button>
            );
          } else {
            if (currentPage <= 3) {
              if (index < 5) {
                return (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    disabled={index + 1 === currentPage}
                  >
                    {index + 1}
                  </button>
                );
              } else if (index === 5) {
                return <span key={index}>...</span>;
              }
            } else if (currentPage > totalPages - 3) {
              if (index >= totalPages - 5) {
                return (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    disabled={index + 1 === currentPage}
                  >
                    {index + 1}
                  </button>
                );
              } else if (index === totalPages - 6) {
                return <span key={index}>...</span>;
              }
            } else {
              if (index >= currentPage - 3 && index <= currentPage + 1) {
                return (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    disabled={index + 1 === currentPage}
                  >
                    {index + 1}
                  </button>
                );
              } else if (index === currentPage - 4 || index === currentPage + 2) {
                return <span key={index}>...</span>;
              }
            }
          }
          return null;
        })}
      </div>
      <div id="posts-grid-mom">
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
                <small>{post.nickname}</small>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {showCreateForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCreateFormToggle}>
              &times;
            </span>
            <h2 className="modal-header">맛집 추천하기:냠냠:</h2>
            <input className="modal-title"
              type="text"
              name="title"
              placeholder="제목"
              value={newPost.title}
              onChange={handleInputChange}
            />
            <textarea className="modal-content-input"
              type="text"
              name="content"
              placeholder="내용을 작성해주세요"
              value={newPost.content}
              onChange={handleInputChange}
            ></textarea>
            <input
              type="file"
              name="imageUrl"
              placeholder="Image URL"
              onChange={handleImageInputChange}
              multiple
            />
            <select
              name="category"
              value={newPost.regionId}
              onChange={handleCategoryChange}
            >
              <option value="1">수도권</option>
              <option value="2">충청권</option>
              <option value="3">호남권</option>
              <option value="4">영남권</option>
              <option value="5">강원권</option>
              <option value="6">제주권</option>
            </select>
            <button className="modal-btn" onClick={handleCreatePost}>게시글 등록</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
