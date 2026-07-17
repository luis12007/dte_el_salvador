import { useEffect, useState } from 'react';
import SupportChatService from '../services/SupportChatService';

const useSupportNotifications = (token, userId) => {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token || !userId) {
      return;
    }

    const checkUnreadMessages = async () => {
      try {
        const response = await SupportChatService.getUnreadCount(token, userId);
        const count = response?.unread_count || 0;
        setUnreadCount(count);
        setHasUnreadMessages(count > 0);
      } catch (error) {
        console.error('Error al verificar notificaciones de soporte:', error);
      }
    };

    // Verificar inmediatamente
    checkUnreadMessages();

    // Verificar cada 5 segundos
    const intervalId = setInterval(checkUnreadMessages, 5000);

    return () => clearInterval(intervalId);
  }, [token, userId]);

  return { hasUnreadMessages, unreadCount };
};

export default useSupportNotifications;
