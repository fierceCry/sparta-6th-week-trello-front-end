import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './MyPage.scss';

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    imageUrl: '',
    nickname: '',
    oneLiner: '',
  });
  const [editedPassword, setEditedPassword] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
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
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileModalOpen = () => {
    setShowProfileModal(true);
  };

  const handleProfileModalClose = () => {
    setShowProfileModal(false);
  };

  const handlePasswordModalOpen = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleMyPageImageClick = () => {
    fileInputRef.current.click();
  };

  const handleExternalImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = () => {
    // 파일 입력이 변경될 때 호출되는 함수
    const file = fileInputRef.current.files[0];
    setSelectedFile(file);
    handleProfileUpdateSave();
  };

  const handleProfileUpdateSave = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('imageUrl', selectedFile);
  
        const accessToken = localStorage.getItem('accessToken');
        await axios.post(
          'http://127.0.0.1:3095/profile/profileupload',
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setUser(prevUser => ({
          ...prevUser,
          imageUrl: URL.createObjectURL(selectedFile)
        }));
  
        setShowProfileModal(false);
      } else {
        throw new Error('이미지를 업로드하지 않았습니다.');
      }
    } catch (error) {
      console.error('프로필 업데이트 중 오류 발생:', error.message);
      if (error.message === '이미지를 업로드하지 않았습니다.') {
        alert('이미지를 업로드하지 않았습니다.');
      } else {
        alert('프로필 업데이트 중 오류 발생:')
      }
    }
  };
  
  
  

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('nickname', editedProfile.nickname);
      formData.append('oneLiner', editedProfile.oneLiner);

      const accessToken = localStorage.getItem('accessToken');
      await axios.put('http://127.0.0.1:3095/profile/profileupload', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setShowProfileModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
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
    }
  };

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
          onClick={handleExternalImageClick}
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileInputChange} // 파일 입력 변경 이벤트에 연결
        />

        <h2 className="nickname">{user.nickname}</h2>
        <div className="follow-counts">
          <span className="follower-count">팔로워 {user.followerCount}명</span>
          <span className="following-count">
            팔로잉 {user.followingCount}명
          </span>
        </div>
        <p className="one-liner">{user.oneLiner}</p>
        <button className="settings-button" onClick={handleProfileModalOpen}>
          프로필 설정
        </button>
        <button className="password-button" onClick={handlePasswordModalOpen}>
          비밀번호 변경
        </button>
      </div>
      {/* <div className="posts-grid">
        {user.posts.map((post) => (
          <div key={post.id} className="post-card">
            <img src={post.imageUrl} alt="Post" className="post-image" />
            <h3 className="post-title">{post.title}</h3>
            <p className="post-content">{post.content}</p>
          </div>
        ))}
      </div> */}

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

