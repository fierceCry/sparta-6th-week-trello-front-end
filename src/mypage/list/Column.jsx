import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { PlusCircle } from 'lucide-react';
import { fetchBoard, updateListOrder, updateCardOrder, createList } from '../../services/api';
import Column from '../Column/Column';
import Header from '../Header/Header';
import useAuth from '../../hooks/useAuth';
import useNotifications from '../../hooks/useNotifications';
import './Board.scss';

const Board = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, fetchNotifications } = useNotifications();

  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBoardData();
  }, [id]);

  const loadBoardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBoard(id);
      setBoard(data.board);
      setColumns(data.columns);
      setColumnOrder(data.columnOrder);
    } catch (err) {
      setError('Failed to load board data. Please try again later.');
      console.error('Error fetching board data:', err);
    }
    setIsLoading(false);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'column') {
      const newColumnOrder = Array.from(columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      setColumnOrder(newColumnOrder);

      try {
        await updateListOrder(id, draggableId, destination.index);
      } catch (error) {
        console.error('Error updating list order:', error);
        setColumnOrder(columnOrder);
      }
    } else if (type === 'card') {
      const startColumn = columns[source.droppableId];
      const finishColumn = columns[destination.droppableId];

      if (startColumn === finishColumn) {
        const newCards = Array.from(startColumn.cards);
        newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...startColumn,
          cards: newCards,
        };

        setColumns({ ...columns, [newColumn.id]: newColumn });

        try {
          await updateCardOrder(startColumn.id, draggableId, destination.index);
        } catch (error) {
          console.error('Error updating card order:', error);
          setColumns(columns);
        }
      } else {
        const startCards = Array.from(startColumn.cards);
        startCards.splice(source.index, 1);
        const newStartColumn = {
          ...startColumn,
          cards: startCards,
        };

        const finishCards = Array.from(finishColumn.cards);
        finishCards.splice(destination.index, 0, draggableId);
        const newFinishColumn = {
          ...finishColumn,
          cards: finishCards,
        };

        setColumns({
          ...columns,
          [newStartColumn.id]: newStartColumn,
          [newFinishColumn.id]: newFinishColumn,
        });

        try {
          await updateCardOrder(finishColumn.id, draggableId, destination.index);
        } catch (error) {
          console.error('Error updating card order:', error);
          setColumns(columns);
        }
      }
    }
  };

  const addNewList = async () => {
    if (newListTitle.trim() === '') return;
    try {
      const newList = await createList(id, newListTitle);
      setColumns({ ...columns, [newList.id]: newList });
      setColumnOrder([...columnOrder, newList.id]);
      setNewListTitle('');
    } catch (err) {
      console.error('Error adding new list:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="board" style={{ backgroundImage: `url(${board.backgroundImage})` }}>
      <Header
        title={board.title}
        onInvite={() => navigate('/members/permission')}
        onNotifications={fetchNotifications}
        notifications={notifications}
        user={user}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="board-columns"
            >
              {columnOrder.map((columnId, index) => {
                const column = columns[columnId];
                return <Column key={column.id} column={column} index={index} />;
              })}
              {provided.placeholder}
              <div className="add-list">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Enter list title..."
                />
                <button onClick={addNewList}>
                  <PlusCircle size={16} />
                  Add List
                </button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Board;