import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserProfilePage.scss';

const OtherUserProfilePage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response.data.data)
        setUserData(response.data.data);
        setIsFollowing(response.data.data.isFollowing);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleFollowClick = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/profile/follows/${userId}`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        setIsFollowing(true);
        setUserData(prevData => ({
          ...prevData,
          isFollowing: true,

          // ...prevData,
          followers: prevData.followers + 1,

        }));
      }
    } catch (error) {
      console.error(`Error following user:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollowClick = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/profile/follows/${userId}`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setIsFollowing(false);
        setUserData(prevData => ({
          ...prevData,
          isFollowing: false,

          ...prevData,
          followers: prevData.followers - 1,

        }));
      }
    } catch (error) {
      console.error(`Error unfollowing user:`, error);
    } finally {
      setLoading(false);
    }
  };


  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-page">
      <div className="profile">
        <img
          src={userData.imageUrl}
          alt="Profile"
          className="profile-image"
        />
        <h2 className="nickname">{userData.nickname}</h2>
        <div className="follow-counts">
          <span className="follower-count">팔로워 {userData.followers}명</span>
          <span className="following-count">팔로잉 {userData.following}명</span>
        </div>
        {isFollowing ? (
          <button
            className={`follow-button following`}
            onClick={handleUnfollowClick}
            disabled={loading}
          >
            언팔로우
          </button>
        ) : (
          <button
            className={`follow-button`}
            onClick={handleFollowClick}
            disabled={loading}
          >
            팔로우
          </button>
        )}
        <p className="one-liner">{userData.oneLiner}</p>
      </div>

      <div className="posts-grid">
        {userData.posts.map((post, index) => (
          <div
            key={index}
            className="post-card"
            onClick={() => handlePostClick(post.postId)}
          >
            <img
              src={Array.isArray(post.imageUrl) ? post.imageUrl[0] : post.imageUrl}
              alt={`Post ${index}`}
              className="post-image"
            />
            <div className="post-info">
              <h3 className="post-title">{post.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherUserProfilePage;
