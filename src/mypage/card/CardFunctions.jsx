import { useState } from 'react';
import axios from 'axios';

export const useCardFunctions = (
  columns,
  setColumns,
  columnOrder,
  setColumnOrder,
  boardId
) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [addingCardToColumn, setAddingCardToColumn] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState('');
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
  
  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === 'column') {
      const newColumnOrder = Array.from(columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      setColumnOrder(newColumnOrder);

      try {
        const token = localStorage.getItem('accessToken');
        await axios.patch(
          `${process.env.REACT_APP_API_URL}/api/v1/boards/${id}/lists/${source.index}/order`,
          {
            newPositionId: destination.index,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setColumns((prevColumns) => {
          const updatedColumns = { ...prevColumns };
          newColumnOrder.forEach((columnId, index) => {
            updatedColumns[columnId] = {
              ...updatedColumns[columnId],
              orderIndex: index,
            };
          });
          return updatedColumns;
        });
      } catch (error) {
        console.error('Error updating list order:', error);
        setColumnOrder(columnOrder);
      }
    } else if (type === 'task') {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];

      if (sourceColumn === destColumn) {
        const newTasks = Array.from(sourceColumn.tasks);
        const [movedTask] = newTasks.splice(source.index, 1);
        newTasks.splice(destination.index, 0, movedTask);

        const newColumn = {
          ...sourceColumn,
          tasks: newTasks,
        };

        setColumns({
          ...columns,
          [newColumn.id]: newColumn,
        });

        try {
          await updateCardOrder(
            sourceColumn.id,
            movedTask.id,
            destination.index
          );
        } catch (error) {
          console.error(
            'Error updating card order within the same list:',
            error
          );
          // 에러 발생 시 원래 상태로 되돌립니다.
          setColumns(columns);
        }
      } else {
        const sourceTasks = Array.from(sourceColumn.tasks);
        const [movedTask] = sourceTasks.splice(source.index, 1);
        const destTasks = Array.from(destColumn.tasks);
        destTasks.splice(destination.index, 0, movedTask);

        const newSourceColumn = {
          ...sourceColumn,
          tasks: sourceTasks,
        };

        const newDestColumn = {
          ...destColumn,
          tasks: destTasks,
        };

        setColumns({
          ...columns,
          [newSourceColumn.id]: newSourceColumn,
          [newDestColumn.id]: newDestColumn,
        });

        try {
          await updateCardOrder(destColumn.id, movedTask.id, destination.index);
        } catch (error) {
          console.error(
            'Error updating card order between different lists:',
            error
          );
          // 에러 발생 시 원래 상태로 되돌립니다.
          setColumns(columns);
        }
      }
    }
  };

  return {
    selectedTask,
    addingCardToColumn,
    newCardTitle,
    setNewCardTitle,
    startAddingCard,
    cancelAddingCard,
    addNewCard,
    openTaskDetail,
    closeTaskDetail,
    updateTask,
    deleteTask,
    onDragEnd,
  };
};
