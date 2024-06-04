import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyPage.scss';
import { Link, useNavigate } from 'react-router-dom';

const MyPage = () => {
  const [user, setUser] = useState('');
  const [editedProfile, setEditedProfile] = useState({
    nickname: '',
    oneLiner: '',
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editedPassword, setEditedPassword] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [tempProfile, setTempProfile] = useState({
    nickname: '',
    oneLiner: '',
  });
  const [profileError, setProfileError] = useState('');
  const [profileNicknameError, setProfileNicknameError] = useState('');
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get('http://127.0.0.1:3095/profile/my', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(response.data.userProfile);
      setEditedProfile({
        imageUrl: response.data.userProfile.imageUrl,
        nickname: response.data.userProfile.nickname,
        oneLiner: response.data.userProfile.oneLiner,
      });
      setPosts(response.data.userProfile.posts);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleProfileModalOpen = () => {
    setTempProfile({
      nickname: user.nickname,
      oneLiner: user.oneLiner,
    });
    setShowProfileModal(true);
  };
  

  const handleProfileModalClose = () => {
    setShowProfileModal(false);
    setTempProfile({
      nickname: '',
      oneLiner: '',
    });
  };
  
  const handlePasswordModalOpen = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    console.log(name, value);
    setEditedProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPassword((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('imageUrl', file);

      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(
        'http://127.0.0.1:3095/profile/profileupload',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUser((prevUser) => ({
        ...prevUser,
        imageUrl: response.data.imageUrl,
      }));

      setEditedProfile((prevState) => ({
        ...prevState,
        imageUrl: response.data.imageUrl,
      }));

      // alert('프로필 이미지가 업로드되었습니다.');
      await fetchUserData(); // 업데이트된 사용자 데이터 가져오기
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('프로필 이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const data = {
        nickname: editedProfile.nickname,
        oneLiner: editedProfile.oneLiner,
      };

      const accessToken = localStorage.getItem('accessToken');
      await axios.patch('http://127.0.0.1:3095/profile/user', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUser((prevUser) => ({
        ...prevUser,
        nickname: editedProfile.nickname,
        oneLiner: editedProfile.oneLiner,
      }));

      setShowProfileModal(false);
      setShowProfileModal(false);
      setTempProfile({
        nickname: '',
        oneLiner: '',
      });
      alert('프로필 정보를 수정하였습니다.');
    } catch (error) {
         if (
        error.response.data.message === '이미 존재하는 닉네임입니다.'
      ) {
        setProfileNicknameError('이미 존재하는 닉네임입니다.');
      } else {
        setProfileError('프로필 업데이트 중 오류가 발생했습니다.');
      }
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(
        'http://127.0.0.1:3095/profile/update-password',
        editedPassword,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowPasswordModal(false);
    } catch (error) {
      console.error('Error updating password:', error);
      alert('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  // const truncateContent = (content, maxLength) => {
  //   if (content.length <= maxLength) {
  //     return content;
  //   }
  //   return `${content.substring(0, maxLength)}...`;
  // };

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="my-page">
      <div className="profile">
        <img
          src={user.imageUrl}
          alt="Profile"
          className="profile-image"
          onClick={() => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = handleImageUpload;
            fileInput.click();
          }}
        />
        <h2 className="nickname">{user.nickname}</h2>
        <div className="follow-counts">
          <span className="follower-count">팔로워 {user.followerCount}명</span>
          <span className="following-count">
            팔로잉 {user.followingCount}명
          </span>
        </div>
        <p className="one-liner">{user.oneLiner}</p>
        <div className="settings-buttons">
          <button className="settings-button" onClick={handleProfileModalOpen}>
            프로필 설정
          </button>
          <button className="password-button" onClick={handlePasswordModalOpen}>
            비밀번호 변경
          </button>
        </div>
      </div>

      <div className="posts-grid">
        {posts.map((post, index) => (
          <div
            key={index}
            className="post-card"
            onClick={() => handlePostClick(post.postId)}
          >
            <img
              src={post.imageUrl}
              alt={`Post ${index}`}
              className="post-image"
            />
            <div className="post-info">
              <h3 className="post-title">{post.title}</h3>
              {/* <p className="post-content">
                {truncateContent(post.content, 100)}
              </p> */}
              {/* <p className="post-date">{post.createdAt}</p> */}
            </div>
          </div>
        ))}
      </div>

      {showProfileModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleProfileModalClose}>
              &times;
            </span>
            <h2>프로필 설정</h2>
            <div className="form-group">
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={editedProfile.nickname}
                onChange={handleProfileInputChange}
              />
              {profileNicknameError && (
                <div className="error-message">{profileNicknameError}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="oneLiner">한줄 소개</label>
              <input
                type="text"
                id="oneLiner"
                name="oneLiner"
                value={editedProfile.oneLiner}
                onChange={handleProfileInputChange}
              />
              {profileError && (
                <div className="error-message">{profileError}</div>
              )}
            </div>
            <button className="update-button" onClick={handleProfileUpdate}>
              프로필 업데이트
            </button>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handlePasswordModalClose}>
              &times;
            </span>
            <h2>비밀번호 변경</h2>
            <div className="form-group">
              <label htmlFor="currentPassword">현재 비밀번호</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={editedPassword.currentPassword}
                onChange={handlePasswordInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">새로운 비밀번호</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={editedPassword.newPassword}
                onChange={handlePasswordInputChange}
              />
            </div>
            <button className="update-button" onClick={handlePasswordUpdate}>
              비밀번호 변경
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default MyPage;
