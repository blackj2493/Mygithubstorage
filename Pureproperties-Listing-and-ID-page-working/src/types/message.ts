// src/types/message.ts
export interface Message {
    id: string;
    content: string;
    createdAt: string;
    sender: {
      id: string;
      name: string;
      email: string;
    };
    recipient: {
      id: string;
      auth0Id: string;
    };
  }