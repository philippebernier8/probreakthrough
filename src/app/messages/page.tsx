'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import MessageNotification from '@/components/MessageNotification';
import { 
  generateMockConversations, 
  getConversationMessages, 
  getFilterOptions,
  MockConversation,
  MockMessage,
  MockUser
} from '@/utils/mockData';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  isRead: boolean;
  type?: 'text' | 'image' | 'video' | 'file';
  fileUrl?: string;
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    position?: string;
    school?: string;
    level?: string;
    lastSeen?: Date;
  }[];
  lastMessage: Message;
  unreadCount: number;
  isPinned?: boolean;
  isArchived?: boolean;
}

interface FilterOptions {
  position: string;
  level: string;
  school: string;
  onlineOnly: boolean;
  unreadOnly: boolean;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<MockConversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<MockConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<MockConversation | null>(null);
  const [messages, setMessages] = useState<MockMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    position: '',
    level: '',
    school: '',
    onlineOnly: false,
    unreadOnly: false
  });
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch conversations from mock data
  const fetchConversations = async (search = '') => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentUserId = session?.user?.email || 'philippe.bernier@email.com';
      console.log('Fetching conversations for user:', currentUserId);
      
      const mockConversations = generateMockConversations(currentUserId);
      console.log('Generated conversations:', mockConversations.length, mockConversations);
      
      setConversations(mockConversations);
      applyFilters(mockConversations, search, filters);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to conversations
  const applyFilters = (conversations: MockConversation[], search: string, filterOptions: FilterOptions) => {
    let filtered = conversations.filter(conversation => {
      // Search filter
      const matchesSearch = !search || conversation.participants.some(participant =>
        participant.name.toLowerCase().includes(search.toLowerCase()) ||
        participant.position?.toLowerCase().includes(search.toLowerCase()) ||
        participant.school?.toLowerCase().includes(search.toLowerCase())
      );

      // Position filter
      const matchesPosition = !filterOptions.position || conversation.participants.some(participant =>
        participant.position === filterOptions.position
      );

      // Level filter
      const matchesLevel = !filterOptions.level || conversation.participants.some(participant =>
        participant.level === filterOptions.level
      );

      // School filter
      const matchesSchool = !filterOptions.school || conversation.participants.some(participant =>
        participant.school === filterOptions.school
      );

      // Online only filter
      const matchesOnline = !filterOptions.onlineOnly || conversation.participants.some(participant =>
        participant.isOnline
      );

      // Unread only filter
      const matchesUnread = !filterOptions.unreadOnly || conversation.unreadCount > 0;

      return matchesSearch && matchesPosition && matchesLevel && matchesSchool && matchesOnline && matchesUnread;
    });

    // Sort conversations: pinned first, then by unread count, then by last message time
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
    });

    setFilteredConversations(filtered);
  };

  // Update online status
  const updateOnlineStatus = () => {
    const now = new Date();
    const onlineThreshold = 5 * 60 * 1000; // 5 minutes

    const updatedConversations = conversations.map(conversation => ({
      ...conversation,
      participants: conversation.participants.map(participant => ({
        ...participant,
        isOnline: participant.lastSeen ? 
          (now.getTime() - new Date(participant.lastSeen).getTime()) < onlineThreshold : 
          false
      }))
    })) as MockConversation[];

    setConversations(updatedConversations);
    applyFilters(updatedConversations, searchQuery, filters);
  };

  useEffect(() => {
    fetchConversations(searchQuery);
    
    // Vérifier s'il y a une nouvelle conversation à créer
    const newConversationData = localStorage.getItem('newConversation');
    if (newConversationData) {
      try {
        const conversationData = JSON.parse(newConversationData);
        console.log('Nouvelle conversation détectée:', conversationData);
        
        // Créer une nouvelle conversation avec l'athlète
        const newConversation: MockConversation = {
          id: `conv_${Date.now()}`,
          participants: [
            {
              id: session?.user?.email || 'philippe.bernier@email.com',
              name: 'Philippe Bernier',
              email: session?.user?.email || 'philippe.bernier@email.com',
              avatar: '/images/AntoineCoupland.png',
              isOnline: true,
              position: 'Forward',
              school: 'University of Montreal',
              level: 'Professional',
              lastSeen: new Date()
            },
            {
              id: conversationData.athleteId,
              name: conversationData.athleteName,
              email: `${conversationData.athleteName.toLowerCase().replace(' ', '.')}@email.com`,
              avatar: conversationData.athleteImage || '',
              isOnline: false,
              position: conversationData.athletePosition,
              school: conversationData.athleteClub,
              level: 'Professional',
              lastSeen: new Date(Date.now() - 300000) // 5 minutes ago
            }
          ],
          lastMessage: {
            id: `msg_${Date.now()}`,
            content: 'Start a conversation with this athlete',
            senderId: session?.user?.email || 'philippe.bernier@email.com',
            receiverId: conversationData.athleteId,
            timestamp: new Date(),
            isRead: false,
            type: 'text'
          },
          unreadCount: 0,
          isPinned: false,
          isArchived: false
        };
        
        // Ajouter la nouvelle conversation à la liste
        setConversations(prev => [newConversation, ...prev]);
        setFilteredConversations(prev => [newConversation, ...prev]);
        
        // Sélectionner automatiquement cette conversation
        setSelectedConversation(newConversation);
        
        // Nettoyer le localStorage
        localStorage.removeItem('newConversation');
        
      } catch (error) {
        console.error('Erreur lors de la création de la nouvelle conversation:', error);
        localStorage.removeItem('newConversation');
      }
    }
  }, [searchQuery]);

  useEffect(() => {
    applyFilters(conversations, searchQuery, filters);
  }, [filters, conversations, searchQuery]);

  // Update online status every minute
  useEffect(() => {
    const interval = setInterval(updateOnlineStatus, 60000);
    return () => clearInterval(interval);
  }, [conversations, searchQuery, filters]);

  // Real-time polling for new messages
  useEffect(() => {
    const startPolling = () => {
      pollingIntervalRef.current = setInterval(() => {
        fetchConversations(searchQuery);
      }, 5000); // Poll every 5 seconds
    };

    startPolling();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [searchQuery]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = 0;
    }
  };

  useEffect(() => {
    // Simple auto-scroll to bottom when messages change
    if (messages.length > 0) {
      scrollToBottom();
    }
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
        const message: MockMessage = {
          ...data.message,
          timestamp: new Date(data.message.timestamp),
          type: 'text'
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');

        // Update conversation's last message
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, lastMessage: message, unreadCount: 0 }
            : conv
        ));

        // Trigger immediate refresh for real-time feel
        setTimeout(() => fetchConversations(searchQuery), 1000);
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Load messages when conversation is selected
  const loadConversationMessages = async (conversation: MockConversation) => {
    setSelectedConversation(conversation);
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const currentUserId = session?.user?.email || 'philippe.bernier@email.com';
      console.log('Loading conversation:', conversation.id, 'for user:', currentUserId);
      
      // Vérifier s'il y a des messages d'exemple dans localStorage
      const exampleMessagesData = localStorage.getItem('exampleMessages');
      if (exampleMessagesData) {
        const exampleMessages = JSON.parse(exampleMessagesData);
        if (exampleMessages[conversation.id]) {
          console.log('Found example messages for conversation:', conversation.id);
          setMessages(exampleMessages[conversation.id]);
          setIsLoading(false);
          return;
        }
      }
      
      // Sinon, utiliser les messages mock
      const conversationMessages = getConversationMessages(conversation.id, currentUserId);
      console.log('Found messages:', conversationMessages.length, conversationMessages);
      
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
    } finally {
      setIsLoading(false);
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

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterOptions, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      position: '',
      level: '',
      school: '',
      onlineOnly: false,
      unreadOnly: false
    });
  };

  // Toggle conversation pin
  const togglePinConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, isPinned: !conv.isPinned } : conv
    ));
  };

  // Archive conversation
  const archiveConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, isArchived: true } : conv
    ));
  };

  // Get unique values for filter options
  const filterOptions = getFilterOptions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar - Conversations List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  PB
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">Philippe Bernier</h1>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const otherParticipant = conversation.participants.find(p => p.id !== session?.user?.email);
                return (
                  <div
                    key={conversation.id}
                    onClick={() => loadConversationMessages(conversation)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                      selectedConversation?.id === conversation.id ? 'bg-red-50 border-r-2 border-r-red-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {otherParticipant?.name.charAt(0)}
                        </div>
                        {otherParticipant?.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">{otherParticipant?.name}</h3>
                          <span className="text-xs text-gray-500">{formatTime(conversation.lastMessage.timestamp)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage.content}</p>
                          {conversation.unreadCount > 0 && (
                            <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate">{otherParticipant?.position} • {otherParticipant?.school}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Content - Messages */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedConversation.participants.find(p => p.id !== session?.user?.email)?.name.charAt(0)}
                      </div>
                      {selectedConversation.participants.find(p => p.id !== session?.user?.email)?.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {selectedConversation.participants.find(p => p.id !== session?.user?.email)?.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.participants.find(p => p.id !== session?.user?.email)?.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwnMessage = message.senderId === session?.user?.email;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          isOwnMessage 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-red-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Messages</h2>
                <p className="text-gray-600 mb-6">Send private messages to athletes and coaches</p>
                <button 
                  onClick={() => {
                    // Créer des conversations d'exemple pour tester
                    const exampleConversations = [
                      {
                        id: 'conv_1',
                        participants: [
                          {
                            id: session?.user?.email || 'philippe.bernier@email.com',
                            name: 'Philippe Bernier',
                            email: session?.user?.email || 'philippe.bernier@email.com',
                            avatar: '/images/AntoineCoupland.png',
                            isOnline: true,
                            position: 'Forward',
                            school: 'University of Montreal',
                            level: 'Professional',
                            lastSeen: new Date()
                          },
                          {
                            id: 'coach.smith@email.com',
                            name: 'Coach Smith',
                            email: 'coach.smith@email.com',
                            avatar: '',
                            isOnline: true,
                            position: 'Head Coach',
                            school: 'Montreal Impact Academy',
                            level: 'Professional',
                            lastSeen: new Date()
                          }
                        ],
                        lastMessage: {
                          id: 'msg_1',
                          content: 'Great performance in the last game!',
                          senderId: 'coach.smith@email.com',
                          receiverId: session?.user?.email || 'philippe.bernier@email.com',
                          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
                          isRead: false,
                          type: 'text' as const
                        },
                        unreadCount: 1,
                        isPinned: false,
                        isArchived: false
                      },
                      {
                        id: 'conv_2',
                        participants: [
                          {
                            id: session?.user?.email || 'philippe.bernier@email.com',
                            name: 'Philippe Bernier',
                            email: session?.user?.email || 'philippe.bernier@email.com',
                            avatar: '/images/AntoineCoupland.png',
                            isOnline: true,
                            position: 'Forward',
                            school: 'University of Montreal',
                            level: 'Professional',
                            lastSeen: new Date()
                          },
                          {
                            id: 'marie.dubois@email.com',
                            name: 'Marie Dubois',
                            email: 'marie.dubois@email.com',
                            avatar: '',
                            isOnline: false,
                            position: 'Team Captain',
                            school: 'University of Montreal',
                            level: 'University',
                            lastSeen: new Date(Date.now() - 1800000) // 30 minutes ago
                          }
                        ],
                        lastMessage: {
                          id: 'msg_2',
                          content: 'Are you coming to practice tomorrow?',
                          senderId: session?.user?.email || 'philippe.bernier@email.com',
                          receiverId: 'marie.dubois@email.com',
                          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
                          isRead: true,
                          type: 'text' as const
                        },
                        unreadCount: 0,
                        isPinned: false,
                        isArchived: false
                      },
                      {
                        id: 'conv_3',
                        participants: [
                          {
                            id: session?.user?.email || 'philippe.bernier@email.com',
                            name: 'Philippe Bernier',
                            email: session?.user?.email || 'philippe.bernier@email.com',
                            avatar: '/images/AntoineCoupland.png',
                            isOnline: true,
                            position: 'Forward',
                            school: 'University of Montreal',
                            level: 'Professional',
                            lastSeen: new Date()
                          },
                          {
                            id: 'alex.thompson@email.com',
                            name: 'Alex Thompson',
                            email: 'alex.thompson@email.com',
                            avatar: '',
                            isOnline: true,
                            position: 'Professional Coach',
                            school: 'CF Montreal',
                            level: 'Professional',
                            lastSeen: new Date()
                          }
                        ],
                        lastMessage: {
                          id: 'msg_3',
                          content: 'Your video analysis is ready!',
                          senderId: 'alex.thompson@email.com',
                          receiverId: session?.user?.email || 'philippe.bernier@email.com',
                          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
                          isRead: false,
                          type: 'text' as const
                        },
                        unreadCount: 1,
                        isPinned: false,
                        isArchived: false
                      }
                    ];
                    
                    // Créer des messages d'exemple pour chaque conversation
                    const exampleMessages = {
                      'conv_1': [
                        {
                          id: 'msg_1_1',
                          content: 'Hi Coach Smith!',
                          senderId: session?.user?.email || 'philippe.bernier@email.com',
                          receiverId: 'coach.smith@email.com',
                          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
                          isRead: true,
                          type: 'text' as const
                        },
                        {
                          id: 'msg_1_2',
                          content: 'Hello Philippe! How are you doing?',
                          senderId: 'coach.smith@email.com',
                          receiverId: session?.user?.email || 'philippe.bernier@email.com',
                          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
                          isRead: true,
                          type: 'text' as const
                        },
                        {
                          id: 'msg_1_3',
                          content: 'I\'m doing great! Just finished my training session.',
                          senderId: session?.user?.email || 'philippe.bernier@email.com',
                          receiverId: 'coach.smith@email.com',
                          timestamp: new Date(Date.now() - 900000), // 15 minutes ago
                          isRead: true,
                          type: 'text' as const
                        },
                        {
                          id: 'msg_1_4',
                          content: 'Great performance in the last game!',
                          senderId: 'coach.smith@email.com',
                          receiverId: session?.user?.email || 'philippe.bernier@email.com',
                          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
                          isRead: false,
                          type: 'text' as const
                        }
                      ],
                      'conv_2': [
                        {
                          id: 'msg_2_1',
                          content: 'Hey Marie!',
                          senderId: session?.user?.email || 'philippe.bernier@email.com',
                          receiverId: 'marie.dubois@email.com',
                          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
                          isRead: true,
                          type: 'text' as const
                        },
                        {
                          id: 'msg_2_2',
                          content: 'Hi Philippe! What\'s up?',
                          senderId: 'marie.dubois@email.com',
                          receiverId: session?.user?.email || 'philippe.bernier@email.com',
                          timestamp: new Date(Date.now() - 5400000), // 1.5 hours ago
                          isRead: true,
                          type: 'text' as const
                        },
                        {
                          id: 'msg_2_3',
                          content: 'Are you coming to practice tomorrow?',
                          senderId: session?.user?.email || 'philippe.bernier@email.com',
                          receiverId: 'marie.dubois@email.com',
                          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
                          isRead: true,
                          type: 'text' as const
                        }
                      ],
                      'conv_3': [
                        {
                          id: 'msg_3_1',
                          content: 'Hello Alex!',
                          senderId: session?.user?.email || 'philippe.bernier@email.com',
                          receiverId: 'alex.thompson@email.com',
                          timestamp: new Date(Date.now() - 10800000), // 3 hours ago
                          isRead: true,
                          type: 'text' as const
                        },
                        {
                          id: 'msg_3_2',
                          content: 'Hi Philippe! I\'ve been analyzing your recent games.',
                          senderId: 'alex.thompson@email.com',
                          receiverId: session?.user?.email || 'philippe.bernier@email.com',
                          timestamp: new Date(Date.now() - 9000000), // 2.5 hours ago
                          isRead: true,
                          type: 'text' as const
                        },
                        {
                          id: 'msg_3_3',
                          content: 'Your video analysis is ready!',
                          senderId: 'alex.thompson@email.com',
                          receiverId: session?.user?.email || 'philippe.bernier@email.com',
                          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
                          isRead: false,
                          type: 'text' as const
                        }
                      ]
                    };
                    
                    // Sauvegarder les messages dans localStorage pour les récupérer plus tard
                    localStorage.setItem('exampleMessages', JSON.stringify(exampleMessages));
                    
                    // Ajouter les conversations d'exemple
                    setConversations(exampleConversations);
                    setFilteredConversations(exampleConversations);
                    
                    // Sélectionner la première conversation
                    setSelectedConversation(exampleConversations[0]);
                    
                    // Charger les messages de la première conversation
                    setMessages(exampleMessages['conv_1']);
                  }}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Send a message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 