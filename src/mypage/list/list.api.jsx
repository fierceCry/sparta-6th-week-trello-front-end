export const addNewList = async () => {
  if (newListTitle.trim() === '') return;
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/boards/${id}/lists`,
      {
        title: newListTitle,
      }
    );
    console.log('Server response:', response.data);
    const newColumnId = response.data.id || response.data.listId || Date.now().toString();
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