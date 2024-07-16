import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserProfilePage.scss';

const OtherUserProfilePage = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 네비게이션 기능 추가
  const [userData, setUserData] = useState({
    imageUrl: 'https://i.namu.wiki/i/Bbq0E9hXYyrXbL4TnIE__vtQ2QwiZ3i40NZSLiX_a6S0ftYCndVZjf4vlruWur4I3Z0o7CZuFrRMl2CKxyk30w.webp',
    name: 'User Name',
    age: 'User Age',
    selfIntroduction: 'This is a user self-introduction.',
    signInDay: 'Sign-In Date',
    lastLogin: 'Last Login Date',
  });

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleProfileClick = () => {
    navigate('/mypage-board'); // 클릭 시 mypage-board 경로로 이동
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Detailed-Profile</h1>
        <div className="profile-icon">
          <img
            src="https://cdn-icons-png.flaticon.com/512/59/59170.png"
            alt="Profile Icon"
          />
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-image-container" onClick={handleProfileClick}>
          <img
            src={userData.imageUrl}
            alt="Profile"
            className="profile-image"
          />
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <span className="label">name:</span>
            <span className="value">{userData.name}</span>
          </div>
          <div className="profile-detail">
            <span className="label">age:</span>
            <span className="value">{userData.age}</span>
          </div>
          <div className="profile-detail">
            <span className="label">self-introduction:</span>
            <span className="value">{userData.selfIntroduction}</span>
          </div>
          <div className="profile-detail">
            <span className="label">Sign-In Day:</span>
            <span className="value">{userData.signInDay}</span>
          </div>
          <div className="profile-detail">
            <span className="label">last Login:</span>
            <span className="value">{userData.lastLogin}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfilePage;
