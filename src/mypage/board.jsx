import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusCircle, Edit2, Trash2, X } from 'lucide-react';
import axios from 'axios';
import CardDetailModal from './CardDetailModal';
import './board.scss';

function TrelloWebsite() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [boardTitle, setBoardTitle] = useState('');
  const [columns, setColumns] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  const [addingCardToColumn, setAddingCardToColumn] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const columnsRef = useRef(columns);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchBoardData();

  }, [id]);

  const fetchBoardData = async () => {
    setIsLoading(true);
    setError(null);
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
  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;
    console.log(result)
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
  
    if (type === 'column') {
      const newColumnOrder = Array.from(columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
  
      setColumnOrder(newColumnOrder);
  
      try {
        const token = localStorage.getItem('accessToken');
        await axios.patch(
          `${process.env.REACT_APP_API_URL}/api/v1/boards/${id}/lists/${draggableId}/order`,
          { 
            newPositionId: destination.index,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setColumns(prevColumns => {
          const updatedColumns = {...prevColumns};
          newColumnOrder.forEach((columnId, index) => {
            updatedColumns[columnId] = {
              ...updatedColumns[columnId],
              orderIndex: index
            };
          });
          return updatedColumns;
        });
      } catch (error) {
        console.error('Error updating list order:', error);
        setColumnOrder(columnOrder);
      }
    }   if (type === 'task') {
      const startColumn = columns[source.droppableId];
      const finishColumn = columns[destination.droppableId];
  
      if (startColumn === finishColumn) {
        // 같은 리스트 내에서 카드 이동
        const newTasks = Array.from(startColumn.tasks);
        const [movedTask] = newTasks.splice(source.index, 1);
        newTasks.splice(destination.index, 0, movedTask);
  
        const newColumn = {
          ...startColumn,
          tasks: newTasks,
        };
  
        setColumns(prevColumns => ({
          ...prevColumns,
          [newColumn.id]: newColumn,
        }));
  
        try {
          await updateCardOrder(startColumn.id, movedTask.id, destination.index);
        } catch (error) {
          console.error('Error updating card order within the same list:', error);
          setColumns(columns); // 에러 시 원래 상태로 복구
        }
      } else {
        // 다른 리스트로 카드 이동
        const startTasks = Array.from(startColumn.tasks);
        const [movedTask] = startTasks.splice(source.index, 1);
        const newStartColumn = {
          ...startColumn,
          tasks: startTasks,
        };
  
        const finishTasks = Array.from(finishColumn.tasks);
        finishTasks.splice(destination.index, 0, movedTask);
        const newFinishColumn = {
          ...finishColumn,
          tasks: finishTasks,
        };
  
        setColumns(prevColumns => ({
          ...prevColumns,
          [newStartColumn.id]: newStartColumn,
          [newFinishColumn.id]: newFinishColumn,
        }));
  
        try {
          await updateCardOrder(finishColumn.id, movedTask.id, destination.index);
        } catch (error) {
          console.error('Error updating card order between different lists:', error);
          setColumns(columns); // 에러 시 원래 상태로 복구
        }
      }
    }
  };

  const updateCardOrder = async (listId, cardId, newIndex) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/lists/${listId}/cards/${cardId}/order`,
        { 
          newPositionId: newIndex,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchBoardData();
    } catch (error) {
      console.error('Error updating card order:', error);
      fetchBoardData();
    }
  };

  const startAddingCard = (columnId) => {
    setAddingCardToColumn(columnId);
    setNewCardTitle('');
  };

  const cancelAddingCard = () => {
    setAddingCardToColumn(null);
    setNewCardTitle('');
  };

  const addNewCard = async (columnId) => {
    if (newCardTitle.trim() === '') return;
  
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/lists/${columnId}/cards`,
        {
          cardTitle: newCardTitle,
          content: '',
          backgroundColor: 'white',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newTask = response.data.data;
      console.log('New task created:', newTask);
  
      setColumns((prevColumns) => {
        const newColumns = { ...prevColumns };
        newColumns[columnId] = {
          ...newColumns[columnId],
          tasks: [...newColumns[columnId].tasks, newTask],
        };
        console.log('Updated columns:', newColumns);
        return newColumns;
      });
  
      setAddingCardToColumn(null);
      setNewCardTitle('');
    } catch (err) {
      console.error('Error adding new card:', err);
    }
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetail = () => {
    setSelectedTask(null);
  };

  const updateTask = async (updatedTask) => {
    try {
      await axios.put(`/api/v1/cards/${updatedTask.id}`, updatedTask);
      setColumns((prevColumns) => {
        const newColumns = { ...prevColumns };
        for (let columnId in newColumns) {
          newColumns[columnId].tasks = newColumns[columnId].tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          );
        }
        return newColumns;
      });
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/v1/cards/${taskId}`);
      setColumns((prevColumns) => {
        const newColumns = { ...prevColumns };
        for (let columnId in newColumns) {
          newColumns[columnId].tasks = newColumns[columnId].tasks.filter(
            (task) => task.id !== taskId
          );
        }
        return newColumns;
      });
      closeTaskDetail();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleBoardInvite = () => {
    navigate('/members/permission');
  };

  const handleMain = () => {
    navigate('/main');
  };

  const addNewList = async () => {
    if (newListTitle.trim() === '') return;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/boards/${id}/lists`,
        {
          title: newListTitle,
        }
      );
      console.log('Server response:', response.data);
      const newColumnId =
        response.data.id || response.data.listId || Date.now().toString();
      const newColumn = {
        id: newColumnId.toString(),
        title: response.data.title || newListTitle,
        tasks: [],
      };
      setColumns((prevColumns) => ({
        ...prevColumns,
        [newColumn.id]: newColumn,
      }));
      setColumnOrder((prevOrder) => [...prevOrder, newColumn.id]);
      setNewListTitle('');
    } catch (err) {
      console.error('Error adding new list:', err);
    }
  };

  const deleteList = async (listId) => {
    try {
      await axios.delete(`/api/v1/lists/${listId}`);
      setColumns((prevColumns) => {
        const newColumns = { ...prevColumns };
        delete newColumns[listId];
        return newColumns;
      });
      setColumnOrder((prevOrder) => prevOrder.filter((id) => id !== listId));
    } catch (err) {
      console.error('Error deleting list:', err);
    }
  };

  const startEditingList = (listId) => {
    setEditingListId(listId);
  };

  const finishEditingList = async (listId) => {
    try {
      await axios.put(`/api/v1/lists/${listId}`, {
        title: columns[listId].title,
      });
      setEditingListId(null);
    } catch (err) {
      console.error('Error updating list title:', err);
    }
  };

  const updateListTitle = (listId, newTitle) => {
    setColumns((prevColumns) => ({
      ...prevColumns,
      [listId]: {
        ...prevColumns[listId],
        title: newTitle,
      },
    }));
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log("boardId", id)
      console.log(token)
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/notification/event`,
        { boardId: Number(id) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params:{
            limit: 10
          }
        }
      );
      
      setNotifications(response.data);
    } catch (error) {
      console.error('Error response:', error.response.data);
    }
  };
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="trello-board" style={{ backgroundImage: `url(${board})` }}>
      <header className="navbar">
        <div className="title" onClick={handleMain}>
          {boardTitle}
        </div>
        <div className="buttons">
          <button src="https://cdn.icon-icons.com/icons2/1863/PNG/512/notifications-active_118870.png" onClick={fetchNotifications}>알림</button>
          <button onClick={handleBoardInvite}>Board Invite</button>
          <button>Board Update</button>
          <button>Board Delete</button>
          <button>Board Create</button>
        </div>
      </header>

      <main className="board-container">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
          >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="columns-container"
              >
                {columnOrder.map((columnId, index) => {
                  const column = columns[columnId];
                  if (!column) {
                    console.error('Column not found:', columnId);
                    return null;
                  }
                  return (
                    <Draggable
                      key={column.id.toString()}
                      draggableId={column.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="column"
                        >
                          {editingListId === column.id ? (
                            <input
                              type="text"
                              value={column.title}
                              onChange={(e) =>
                                updateListTitle(column.id, e.target.value)
                              }
                              onBlur={() => finishEditingList(column.id)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter')
                                  finishEditingList(column.id);
                              }}
                              autoFocus
                            />
                          ) : (
                            <h3>
                              {column.title}
                              <button
                                className="icon-button"
                                onClick={() => startEditingList(column.id)}
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                className="icon-button"
                                onClick={() => deleteList(column.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </h3>
                          )}
                        
                          <Droppable
                            droppableId={column.id.toString()}
                            type="task"
                          >
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`task-list ${
                                  snapshot.isDraggingOver ? 'dragging-over' : ''
                                }`}
                              >
                                {column.tasks.map((task, index) => {
                                  if (task && task.id) {
                                    return (
                                      <Draggable
                                        key={task.id.toString()}
                                        draggableId={task.id.toString()}
                                        index={index}
                                      >
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`task ${
                                              snapshot.isDragging
                                                ? 'dragging'
                                                : ''
                                            }`}
                                            onClick={() => openTaskDetail(task)}
                                            style={{
                                              backgroundColor:
                                                task.backgroundColor,
                                            }}
                                          >
                                            <h4>{task.cardTitle}</h4>
                                            {task.cardDeadLine && (
                                              <p>
                                                {new Date(
                                                  task.cardDeadLine
                                                ).toLocaleDateString()}
                                              </p>
              
                                            )}
                                          </div>
                                        )}
                                      </Draggable>
                                    );
                                  }
                                  // task가 유효하지 않거나 id가 없는 경우 null을 반환
                                  return null;
                                })}

                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                          {addingCardToColumn === column.id ? (
                            <div className="add-card-form">
                              <input
                                type="text"
                                value={newCardTitle}
                                onChange={(e) =>
                                  setNewCardTitle(e.target.value)
                                }
                                placeholder="Enter card title..."
                                autoFocus
                              />
                              <div className="add-card-actions">
                                <button onClick={() => addNewCard(column.id)}>
                                  Add Card
                                </button>
                                <button
                                  className="icon-button"
                                  onClick={cancelAddingCard}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              className="add-task-btn"
                              onClick={() => startAddingCard(column.id)}
                            >
                              <PlusCircle size={16} />
                              Add a card
                            </button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="add-list">
          <input
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Enter list title..."
          />
          <button onClick={addNewList}>Add List</button>
        </div>
      </main>

      <footer className="footer">
        <p>
          Current Date:{' '}
          {new Date().toLocaleDateString('ko-KR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </footer>

      {selectedTask && (
        <CardDetailModal
          isOpen={!!selectedTask}
          onClose={closeTaskDetail}
          task={selectedTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}

export default TrelloWebsite;
