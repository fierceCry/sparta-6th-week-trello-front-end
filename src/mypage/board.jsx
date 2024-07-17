import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusCircle, Edit2, Trash2, X } from 'lucide-react';
import CardDetailModal from './CardDetailModal';
import './board.scss';

const initialColumns = {
  'Doing': {
    id: 'Doing',
    title: 'Doing',
    tasks: [
      { id: '1', title: 'Startup Ipsilon Spring', date: '4 Jun' },
    ]
  },
  'To Do': {
    id: 'To Do',
    title: 'To Do',
    tasks: [
      { id: '2', title: 'Board Invite', date: '3 Jun' },
      { id: '3', title: 'Create Pitch Deck', date: '3 Jun' },
      { id: '4', title: 'Ask Client X', date: '3 Jun' },
      { id: '5', title: 'Link', date: '3 Jun' },
    ]
  },
  'Done': {
    id: 'Done',
    title: 'Done',
    tasks: [
      { id: '6', title: 'Develop a Tic toc tac app' },
      { id: '7', title: 'Stay healthy' },
      { id: '8', title: 'Finish Design course' },
    ]
  },
  'Ideas': {
    id: 'Ideas',
    title: 'Ideas',
    tasks: [
      { id: '9', title: 'New e-commerce for desi', date: '27 Jun' },
    ]
  }
};

function TrelloWebsite() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [columns, setColumns] = useState(initialColumns);
  const [columnOrder, setColumnOrder] = useState(Object.keys(initialColumns));
  const [selectedTask, setSelectedTask] = useState(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  const [addingCardToColumn, setAddingCardToColumn] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState('');

  useEffect(() => {
    console.log(`Loading board with ID: ${id}`);
    setColumns(initialColumns);
    setColumnOrder(Object.keys(initialColumns));
  }, [id]);

  const onDragEnd = (result) => {
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

  const addNewCard = (columnId) => {
    if (newCardTitle.trim() === '') return;

    const newTaskId = Math.max(...Object.values(columns).flatMap(column => column.tasks.map(task => parseInt(task.id)))) + 1;
    const newTask = {
      id: newTaskId.toString(),
      title: newCardTitle,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    };
    
    setColumns(prevColumns => ({
      ...prevColumns,
      [columnId]: {
        ...prevColumns[columnId],
        tasks: [...prevColumns[columnId].tasks, newTask]
      }
    }));

    setAddingCardToColumn(null);
    setNewCardTitle('');
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetail = () => {
    setSelectedTask(null);
  };

  const updateTask = (updatedTask) => {
    setColumns(prevColumns => {
      const newColumns = { ...prevColumns };
      for (let columnId in newColumns) {
        newColumns[columnId].tasks = newColumns[columnId].tasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        );
      }
      return newColumns;
    });
  };

  const deleteTask = (taskId) => {
    setColumns(prevColumns => {
      const newColumns = { ...prevColumns };
      for (let columnId in newColumns) {
        newColumns[columnId].tasks = newColumns[columnId].tasks.filter(task => task.id !== taskId);
      }
      return newColumns;
    });
    closeTaskDetail();
  };

  const handleBoardInvite = () => {
    navigate('/members/permission');
  };

  const handleMain = () => {
    navigate('/main');
  };

  const addNewList = () => {
    if (newListTitle.trim() === '') return;
    const newListId = newListTitle.replace(/\s+/g, '-').toLowerCase();
    setColumns(prevColumns => ({
      ...prevColumns,
      [newListId]: {
        id: newListId,
        title: newListTitle,
        tasks: []
      }
    }));
    setColumnOrder(prevOrder => [...prevOrder, newListId]);
    setNewListTitle('');
  };

  const deleteList = (listId) => {
    setColumns(prevColumns => {
      const newColumns = { ...prevColumns };
      delete newColumns[listId];
      return newColumns;
    });
    setColumnOrder(prevOrder => prevOrder.filter(id => id !== listId));
  };

  const startEditingList = (listId) => {
    setEditingListId(listId);
  };

  const finishEditingList = (listId) => {
    setEditingListId(null);
  };

  const updateListTitle = (listId, newTitle) => {
    setColumns(prevColumns => ({
      ...prevColumns,
      [listId]: {
        ...prevColumns[listId],
        title: newTitle
      }
    }));
  };

  return (
    <div className="trello-board">
      <header className="navbar">
        <div className="title" onClick={handleMain}>Trello - Board {id}</div>
        <div className="buttons">
          <button onClick={handleBoardInvite}>Board Invite</button>
          <button>Board Update</button>
          <button>Board Delete</button>
          <button>Board Create</button>
        </div>
      </header>

      <main className="board-container">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="columns-container"
              >
                {columnOrder.map((columnId, index) => {
                  const column = columns[columnId];
                  return (
                    <Draggable key={column.id} draggableId={column.id} index={index}>
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
                              onChange={(e) => updateListTitle(column.id, e.target.value)}
                              onBlur={() => finishEditingList(column.id)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') finishEditingList(column.id);
                              }}
                              autoFocus
                            />
                          ) : (
                            <h3>
                              {column.title}
                              <button className="icon-button" onClick={() => startEditingList(column.id)}>
                                <Edit2 size={16} />
                              </button>
                              <button className="icon-button" onClick={() => deleteList(column.id)}>
                                <Trash2 size={16} />
                              </button>
                            </h3>
                          )}
                          <Droppable droppableId={column.id} type="task">
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                              >
                                {column.tasks.map((task, index) => (
                                  <Draggable key={task.id} draggableId={task.id} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`task ${snapshot.isDragging ? 'dragging' : ''}`}
                                        onClick={() => openTaskDetail(task)}
                                      >
                                        <h4>{task.title}</h4>
                                        {task.date && <p>{task.date}</p>}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                          {addingCardToColumn === column.id ? (
                            <div className="add-card-form">
                              <input
                                type="text"
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                placeholder="Enter card title..."
                                autoFocus
                              />
                              <div className="add-card-actions">
                                <button onClick={() => addNewCard(column.id)}>Add Card</button>
                                <button className="icon-button" onClick={cancelAddingCard}>
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button className="add-task-btn" onClick={() => startAddingCard(column.id)}>
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
        <p>Current Date: {new Date().toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
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