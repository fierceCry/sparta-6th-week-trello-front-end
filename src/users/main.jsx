import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // React Router의 Link import
import axios from 'axios';
import './main.scss';

const MyPage = () => {
  const [createdBoards, setCreatedBoards] = useState([]);
  const [invitedBoards, setInvitedBoards] = useState([]);

  useEffect(() => {
    // 예시 데이터를 포함한 단일 API 호출
    axios
      .get('/api/boards')
      .then((response) => {
        const { createdBoards, invitedBoards } = response.data;
        setCreatedBoards(createdBoards);
        setInvitedBoards(invitedBoards);
      })
      .catch((error) => {
        console.error('Error fetching boards:', error);

        // 예시 데이터
        const exampleCreatedBoards = [
          {
            id: 1,
            name: 'Board 1',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 2,
            name: 'Board 2',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 3,
            name: 'Board 3',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 4,
            name: 'Board 4',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 5,
            name: 'Board 5',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 6,
            name: 'Board 6',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 7,
            name: 'Board 7',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 8,
            name: 'Board 8',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 9,
            name: 'Board 9',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 10,
            name: 'Board 10',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 11,
            name: 'Board 11',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 12,
            name: 'Board 12',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
        ];

        setCreatedBoards(exampleCreatedBoards);

        const exampleInvitedBoards = [
          {
            id: 12,
            name: 'Board 12',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 13,
            name: 'Board 13',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 14,
            name: 'Board 14',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 15,
            name: 'Board 15',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 16,
            name: 'Board 16',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 17,
            name: 'Board 17',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 18,
            name: 'Board 18',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 19,
            name: 'Board 19',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 20,
            name: 'Board 20',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 21,
            name: 'Board 21',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 22,
            name: 'Board 22',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
          {
            id: 23,
            name: 'Board 23',
            imageUrl:
              'https://png.pngtree.com/thumb_back/fw800/background/20231219/pngtree-pink-pastel-background-with-pink-aesthetic-sky-image_15522922.png',
          },
        ];
        setInvitedBoards(exampleInvitedBoards);
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
              <div key={board.id} className="board-item">
                <Link to={`/board/${board.id}`}>
                  <img
                    src={board.imageUrl}
                    alt={`Board ${board.id}`}
                    className="board"
                  />
                </Link>

                <div className="board-name">{board.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="board-section">
          <h2>초대 받은 보드</h2>
          <div className="board-container">
            {invitedBoards.map((board) => (
              <div key={board.id} className="board-item">
                <Link to={`/board/${board.id}`}>
                  <img
                    src={board.imageUrl}
                    alt={`Board ${board.id}`}
                    className="board"
                  />
                </Link>

                <div className="board-name">{board.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
