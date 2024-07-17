import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const fetchBoardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/api/v1/boards/${id}`);
        const { board, boardTitle, lists } = response.data;

        setBoard(board);
        setBoardTitle(boardTitle);
        const columnsData = {};
        const columnsOrder = [];

        lists.forEach((list) => {
          if (list && list.id) {
            columnsData[list.id] = {
              id: list.id,
              title: list.title,
              tasks: list.cards || [],
            };
            columnsOrder.push(list.id);
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

    fetchBoardData();
  }, [id]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      setColumnOrder(newColumnOrder);
      await updateListOrder(newColumnOrder);
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newTasks = Array.from(start.tasks);
      newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, start.tasks[source.index]);

      const newColumn = {
        ...start,
        tasks: newTasks,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });

      // Here you would update the card order within the list
      // await updateCardOrder(newColumn.id, newTasks.map(task => task.id));
    } else {
      const startTasks = Array.from(start.tasks);
      startTasks.splice(source.index, 1);
      const newStart = {
        ...start,
        tasks: startTasks,
      };

      const finishTasks = Array.from(finish.tasks);
      finishTasks.splice(destination.index, 0, start.tasks[source.index]);
      const newFinish = {
        ...finish,
        tasks: finishTasks,
      };

      setColumns({
        ...columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      });

      // Here you would update the card order for both lists
      // await updateCardOrder(newStart.id, startTasks.map(task => task.id));
      // await updateCardOrder(newFinish.id, finishTasks.map(task => task.id));
    }
  };

  const updateListOrder = async (newOrder) => {
    try {
      const token = localStorage.getItem('accessToken');
      const sourceIndex = columnOrder.findIndex(id => id === newOrder[0]);
      const destinationIndex = newOrder.length - 1;
  
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/v1/boards/${id}/lists/${sourceIndex}/order`,
        { 
          newPositionId: destinationIndex
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('List order updated successfully');
    } catch (error) {
      console.error('Error updating list order:', error);
      // 오류 발생 시 원래 순서로 되돌리기
      setColumnOrder(columnOrder);
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
