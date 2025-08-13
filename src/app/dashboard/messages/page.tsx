'use client';
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useSocket } from '@/hooks/useSocket';
import Notification from '@/components/ui/Notification';
import Link from 'next/link';


type Message = {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  createdAt: string;
  read: boolean;
  sender: {
    name: string;
    email: string;
  };
  property?: {
    id: string;
    title: string;
  };
};

type Conversation = {
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
};

export default function MessagesPage() {
  const { user, isLoading: userLoading } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const handleNewMessage = useCallback((data: any) => {
    const { message, sender } = data;
    if (message.senderId === selectedUserId) {
      setMessages(prev => [...prev, message]);
      markMessageAsRead(message.id);
    } else {
      setNotification(`New message from ${sender.name}`);
    }
    fetchConversations();
  }, [selectedUserId]);

  useSocket(handleNewMessage);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      setError('Failed to load conversations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
      markMessagesAsRead(userId);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    }
  };

  const markMessagesAsRead = async (userId: string) => {
    try {
      await fetch(`/api/messages/read?userId=${userId}`, { method: 'POST' });
      fetchConversations(); // Refresh unread counts
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/read`, { method: 'POST' });
      fetchConversations(); // Refresh unread counts
    } catch (err) {
      console.error('Failed to mark message as read:', err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !newMessage.trim()) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: selectedUserId,
          content: newMessage.trim(),
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const message = await response.json();
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      fetchConversations();
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && !userLoading) {
      fetchConversations();
    }
  }, [user, userLoading]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  const formatMessageDate = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (userLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your messages</p>
          <Link
            href="/api/auth/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {conversations.map((conversation) => (
            <button
              key={conversation.userId}
              onClick={() => setSelectedUserId(conversation.userId)}
              className={`w-full p-4 text-left hover:bg-gray-50 border-b transition-colors ${
                selectedUserId === conversation.userId ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{conversation.userName}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {formatMessageDate(conversation.updatedAt)}
                  {conversation.unreadCount > 0 && (
                    <span className="ml-2 bg-blue-600 text-white px-2 py-1 rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}

          {conversations.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No conversations yet
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedUserId ? (
          <>
            {/* Message Header */}
            <div className="p-4 bg-white border-b">
              <h3 className="font-semibold">
                {conversations.find(c => c.userId === selectedUserId)?.userName}
              </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === user.sub ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.senderId === user.sub
                        ? 'bg-blue-600 text-white'
                        : 'bg-white'
                    }`}
                  >
                    {message.property && (
                      <Link
                        href={`/listings/${message.property.id}`}
                        className={`block text-sm mb-1 ${
                          message.senderId === user.sub
                            ? 'text-blue-100'
                            : 'text-blue-600'
                        } hover:underline`}
                      >
                        Re: {message.property.title}
                      </Link>
                    )}
                    <p>{message.content}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {formatMessageDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>

      {/* Notifications */}
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}