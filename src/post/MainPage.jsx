import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../data/data';
import './MainPage.scss';

const MainPage = () => {
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    setAllPosts(posts);
  }, []);

  return (
    <div className="main-page-container">
      <header className="main-header">
        <h1 className="site-title">만규와 아이들</h1>
        <div className="links">
          <Link to="/mypage">Go to My Page</Link>
        </div>
      </header>
      {allPosts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <ul className="posts-grid">
          {allPosts.map(post => (
            <li className="post-card" key={post.id}>
              <Link to={`/post/${post.id}`} className="post-link">
                {/* 이미지를 배열로 받아 처리합니다. */}
                {Array.isArray(post.imageUrl) && post.imageUrl.length > 0 && (
                  <img
                    src={post.imageUrl[0]} // 첫 번째 이미지만 표시합니다.
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
      )}
    </div>
  );
};

export default MainPage;
