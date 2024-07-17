import { useState } from 'react';
import axios from 'axios';

export const useListFunctions = (boardId) => {
  const [columns, setColumns] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [editingListId, setEditingListId] = useState(null);


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

  return {
    columns,
    columnOrder,
    newListTitle,
    setNewListTitle,
    addNewList,
    deleteList,
    editingListId,
    startEditingList,
    finishEditingList,
    updateListTitle
  };
};
