import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyPage.scss';

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    imageUrl: '',
    nickname: '',
    oneLiner: '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://127.0.0.1:3095/profile/my', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response.data.userProfile);
        setUser(response.data.userProfile);
        setEditedProfile({
          imageUrl: response.data.userProfile.imageUrl,
          nickname: response.data.userProfile.nickname,
          oneLiner: response.data.userProfile.oneLiner,
          currentPassword: '',
          newPassword: '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async () => {
    try {
      console.log(editedProfile)
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(
        'http://127.0.0.1:3095/profile/update',
        editedProfile,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowModal(false);
      // 프로필 업데이트 성공 시 추가 작업 수행
    } catch (error) {
      console.error('Error updating profile:', error);
      // 프로필 업데이트 실패 시 에러 처리
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-page">
      <div className="profile">
        <img src={user.imageUrl} alt="Profile" className="profile-image" />
        <h2 className="nickname">{user.nickname}</h2>
        <div className="follow-counts">
          <span className="follower-count">팔로워 {user.followerCount}명</span>
          <span className="following-count">팔로잉 {user.followingCount}명</span>
        </div>
        <p className="one-liner">{user.oneLiner}</p>
        <button className="settings-button" onClick={handleModalOpen}>
          설정
        </button>
      </div>
      <div className="posts-grid">
        {user.posts.map((post) => (
          <div key={post.id} className="post-card">
            <img src={post.imageUrl} alt="Post" className="post-image" />
            <h3 className="post-title">{post.title}</h3>
            <p className="post-content">{post.content}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleModalClose}>
              &times;
            </span>
            <h2>프로필 설정</h2>
            <div className="form-group">
              <label htmlFor="imageUrl">프로필 이미지</label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={editedProfile.imageUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={editedProfile.nickname}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="oneLiner">한줄 소개</label>
              <input
                type="text"
                id="oneLiner"
                name="oneLiner"
                value={editedProfile.oneLiner}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="currentPassword">현재 비밀번호</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={editedProfile.currentPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">새로운 비밀번호</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={editedProfile.newPassword}
                onChange={handleInputChange}
              />
            </div>
            <button className="update-button" onClick={handleProfileUpdate}>
              프로필 업데이트
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;


