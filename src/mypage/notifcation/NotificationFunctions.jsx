import { useState } from 'react';
import axios from 'axios';

export const useNotificationFunctions = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/notification`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          limit: 10,
        }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return {
    showNotifications,
    notifications,
    toggleNotifications,
    fetchNotifications
  };
};