'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import MessageNotification from '@/components/MessageNotification';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  }[];
  lastMessage: Message;
  unreadCount: number;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations from API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/messages/conversations');
        if (response.ok) {
          const data = await response.json();
          setConversations(data.conversations);
        } else {
          console.error('Failed to fetch conversations');
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const receiverId = selectedConversation.participants.find(p => p.id !== session?.user?.email)?.id || '';
    
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          receiverId,
          conversationId: selectedConversation.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const message: Message = {
          ...data.message,
          timestamp: new Date(data.message.timestamp)
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');

        // Update conversation's last message
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, lastMessage: message, unreadCount: 0 }
            : conv
        ));
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[80vh]">
            {/* Conversations List */}
            <div className="lg:col-span-1 border-r border-gray-200 bg-gray-50">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600 mt-1">Connect with coaches and athletes</p>
              </div>
              
              <div className="overflow-y-auto h-full">
                                 {conversations.map((conversation) => {
                   const otherParticipant = conversation.participants.find(p => p.id !== session?.user?.email);
                   return (
                     <div
                       key={conversation.id}
                       onClick={() => setSelectedConversation(conversation)}
                       className={`p-4 cursor-pointer transition-colors duration-200 hover:bg-gray-100 ${
                         selectedConversation?.id === conversation.id ? 'bg-red-50 border-r-4 border-red-600' : ''
                       }`}
                     >
                       <div className="flex items-center space-x-3">
                         <div className="relative">
                           <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                             {otherParticipant?.name.charAt(0)}
                           </div>
                           {otherParticipant?.isOnline && (
                             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                           )}
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between">
                             <h3 className="text-sm font-semibold text-gray-900 truncate">
                               {otherParticipant?.name}
                             </h3>
                             <span className="text-xs text-gray-500">
                               {formatTime(conversation.lastMessage.timestamp)}
                             </span>
                           </div>
                           <p className="text-sm text-gray-600 truncate mt-1">
                             {conversation.lastMessage.content}
                           </p>
                           {conversation.unreadCount > 0 && (
                             <div className="mt-2">
                               <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                 {conversation.unreadCount}
                               </span>
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
                   );
                 })}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-200 bg-white">
                                         <div className="flex items-center space-x-3">
                       <div className="relative">
                         <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                           {selectedConversation.participants.find(p => p.id !== session?.user?.email)?.name.charAt(0)}
                         </div>
                         {selectedConversation.participants.find(p => p.id !== session?.user?.email)?.isOnline && (
                           <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                         )}
                       </div>
                       <div>
                         <h2 className="text-lg font-semibold text-gray-900">
                           {selectedConversation.participants.find(p => p.id !== session?.user?.email)?.name}
                         </h2>
                         <p className="text-sm text-gray-500">
                           {selectedConversation.participants.find(p => p.id !== session?.user?.email)?.isOnline ? 'Online' : 'Offline'}
                         </p>
                       </div>
                     </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                                         {messages.map((message) => {
                       const isOwnMessage = message.senderId === session?.user?.email;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? 'bg-red-600 text-white'
                                : 'bg-white text-gray-900 border border-gray-200'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-red-100' : 'text-gray-500'}`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-gray-200 bg-white">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 