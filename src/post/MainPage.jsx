import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainPage.scss';

const MainPage = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // 정렬 순서 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    // 액세스 토큰 확인
    const accessToken = localStorage.getItem('accessToken');

    // 액세스 토큰이 없으면 로그인 페이지로 이동
    if (!accessToken) {
      navigate('/sign-in');
      return;
    }

    // axios 인스턴스 생성
    const axiosInstance = axios.create({
      baseURL: 'http://127.0.0.1:3095',
      headers: {
        Authorization: `Bearer ${accessToken}`, // 액세스 토큰을 요청 헤더에 포함
      },
    });

    // 서버에서 게시글 데이터를 가져오는 비동기 함수 정의
    const fetchPosts = async () => {
      try {
        // 서버에 정렬 순서에 따라 게시글 요청
        const response = await axiosInstance.get(`/posts/posts?sort=${sortOrder}`);
        console.log(response.data.data)
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
  }, [navigate, sortOrder]); // sortOrder가 변경될 때마다 다시 호출

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken'); // 로컬 스토리지에서 리프래시 토큰 가져오기
      console.log(refreshToken)
      await axios.delete(
        'http://127.0.0.1:3095/auth/sign-out',
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`, // 리프래시 토큰을 헤더에 담아서 보냄
          },
        }
      );
      // 로그아웃 성공 시의 처리 (예: 로컬 스토리지에서 토큰 제거 등)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/sign-in'); // 로그인 페이지로 이동
    } catch (error) {
      // 로그아웃 실패 시의 처리
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  const handleSortToggle = () => {
    // 내림차순(desc)과 오름차순(asc)을 번갈아가면서 변경
    const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newSortOrder);
  };

  return (
    <div className="main-page-container">
      <header className="main-header">
        <h1 className="site-title">만규와 아이들</h1>
        <div className="links">
          <Link to="/mypage">Go to My Page</Link>
          <button onClick={handleSortToggle}>
            {sortOrder === 'desc' ? 'Sort Desc' : 'Sort Asc'} {/* 정렬 버튼 추가 */}
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <ul className="posts-grid">
        {allPosts.map((post) => (
          <li className="post-card" key={post.postId}> {/* postId로 수정 */}
            <Link to={`/post/${post.postId}`} className="post-link"> {/* postId로 수정 */}
              {/* 이미지를 배열로 받아 처리합니다. */}
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
    </div>
  );
};

export default MainPage;
