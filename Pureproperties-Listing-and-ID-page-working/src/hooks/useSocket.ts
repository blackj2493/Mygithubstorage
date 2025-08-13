import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Message } from '@/types/message';

export const useSocket = (onNewMessage: (message: Message) => void) => {
  const { user } = useUser();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      socketRef.current = io({
        path: '/api/socket',
      });

      // Listen for new messages
      socketRef.current.on('newMessage', onNewMessage);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, onNewMessage]);

  return socketRef.current;
};