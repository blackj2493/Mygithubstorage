import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { getSession } from '@auth0/nextjs-auth0';

export interface ServerWithIO extends NetServer {
  io?: SocketIOServer;
}

export type NextApiResponseWithSocket = NextApiRequest & {
  socket: {
    server: ServerWithIO;
  };
};

export const initializeSocket = (server: NetServer): SocketIOServer => {
  const serverWithIO = server as ServerWithIO;
  
  if (!serverWithIO.io) {
    console.log('Initializing socket.io server...');
    const io = new SocketIOServer(serverWithIO);

    io.on('connection', async (socket) => {
      try {
        const session = await getSession();
        if (session?.user) {
          socket.join(session.user.sub); // Join user's room
          console.log(`User ${session.user.sub} connected`);
        }
      } catch (error) {
        console.error('Socket connection error:', error);
      }

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    serverWithIO.io = io;
  }
  
  return serverWithIO.io;
};