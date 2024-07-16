import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusCircle } from 'lucide-react';
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
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    // 여기서 보드 ID를 사용하여 해당 보드의 데이터를 불러오는 API 호출을 할 수 있습니다.
    // 예: fetchBoardData(id).then(data => setColumns(data.columns));
    console.log(`Loading board with ID: ${id}`);
    // 현재는 모든 보드에 대해 동일한 initialColumns를 사용합니다.
    setColumns(initialColumns);
  }, [id]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceTasks = [...sourceColumn.tasks];
      const destTasks = [...destColumn.tasks];
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destTasks
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedTasks = [...column.tasks];
      const [removed] = copiedTasks.splice(source.index, 1);
      copiedTasks.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          tasks: copiedTasks
        }
      });
    }
  };

  const addNewTask = (columnId) => {
    const newTaskId = Math.max(...Object.values(columns).flatMap(column => column.tasks.map(task => parseInt(task.id)))) + 1;
    const newTask = {
      id: newTaskId.toString(),
      title: 'New Task',
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    };
    
    setColumns(prevColumns => ({
      ...prevColumns,
      [columnId]: {
        ...prevColumns[columnId],
        tasks: [...prevColumns[columnId].tasks, newTask]
      }
    }));
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
          {Object.values(columns).map((column) => (
            <div className="column" key={column.id}>
              <h3>{column.title}</h3>
              <Droppable droppableId={column.id}>
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
              <button className="add-task-btn" onClick={() => addNewTask(column.id)}>
                <PlusCircle size={16} />
                Add a card
              </button>
            </div>
          ))}
        </DragDropContext>
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