// src/types/next.d.ts
import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export {};

declare global {
  namespace Express {
    interface Request {
      socket: {
        server: NetServer & {
          io?: SocketIOServer;
        };
      };
    }
  }
}