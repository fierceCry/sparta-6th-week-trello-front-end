import { useState } from 'react';
import axios from 'axios';

export const useBoardFunctions = (id) => {
  const [board, setBoard] = useState(null);
  const [boardTitle, setBoardTitle] = useState('');

  const fetchBoardData = async () => {
    // setIsLoading(true);
    // setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { board, boardTitle, lists } = response.data;

      setBoard(board);
      setBoardTitle(boardTitle);
      
      lists.sort((a, b) => a.orderIndex - b.orderIndex);
      
      const columnsData = {};
      const columnsOrder = lists.map(list => list.id.toString());

      lists.forEach((list) => {
        if (list && list.id) {
          const sortedCards = (list.cards || []).sort((a, b) => a.orderIndex - b.orderIndex);
          columnsData[list.id] = {
            id: list.id,
            title: list.title,
            tasks: sortedCards,
            orderIndex: list.orderIndex,
          };
        }
      });

      setColumns(columnsData);
      setColumnOrder(columnsOrder);
    } catch (err) {
      setError('Failed to load board data. Please try again later.');
      console.error('Error fetching board data:', err);
    }
    setIsLoading(false);
  };

  const handleBoardInvite = () => {
    navigate('/members/permission');
  };

  const handleMain = () => {
    navigate('/main');
  };



  return { board, boardTitle, fetchBoardData, handleBoardInvite, handleMain };
};
