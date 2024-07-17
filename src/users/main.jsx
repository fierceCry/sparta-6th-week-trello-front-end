import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './main.scss';
import { exampleCreatedBoards, exampleInvitedBoards } from '../main.data/main.data'

const MyPage = () => {
  const [createdBoards, setCreatedBoards] = useState([]);
  const [invitedBoards, setInvitedBoards] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // API 호출
    axiosInstance.get('/api/v1/users/boards')
      .then((response) => {
        const { createdBoards, invitedBoards } = response.data;
        console.log(createdBoards)
        console.log(invitedBoards)
        setCreatedBoards(createdBoards);
        setInvitedBoards(invitedBoards);
      })
      .catch((error) => {
        console.error('Error fetching boards:', error);
        // 에러 처리 (예: 토큰이 유효하지 않은 경우 로그인 페이지로 리다이렉트)
        // 여기서는 간단히 콘솔에 에러를 출력합니다.

        // 더미 데이터 (필요한 경우 주석 해제)
        // setCreatedBoards(exampleCreatedBoards);
        // setInvitedBoards(exampleInvitedBoards);
      });
  }, []);

  return (
    <div className="my-page">
      <div>
        <img
          src="https://reviewinsight-contents.s3.ap-northeast-2.amazonaws.com/software/images/16774894122748o8dv.png"
          alt="Trello Logo"
          className="logo"
        />
      </div>
      <div className="profile-icon">
        <Link to="/user/my">
          {' '}
          {/* 프로필 페이지로 이동하는 Link */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/59/59170.png"
            alt="Profile"
          />
        </Link>
      </div>

      <div className="content">
        <div className="board-section">
          <h2>내가 생성한 보드</h2>
          <div className="board-container">
            {createdBoards.map((board) => (
              <div key={board.boardId} className="board-item">
                <Link to={`/board/${board.boardId}`}>
                  <img
                    src={board.backgroundImageUrl}
                    alt={`Board ${board.boardId}`}
                    className="board"
                  />
                </Link>

                <div className="board-name">{board.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="board-section">
          <h2>초대 받은 보드</h2>
          <div className="board-container">
            {invitedBoards.map((board) => (
              <div key={board.id} className="board-item">
                <Link to={`/board/${board.boardId}`}>
                  <img
                    src={board.backgroundImageUrl}
                    alt={`Board ${board.boardId}`}
                    className="board"
                  />
                </Link>

                <div className="board-name">{board.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
