export interface MockUser {
  id: string;
  name: string;
  email: string;
  position: string;
  school: string;
  level: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface MockMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'video' | 'file';
  fileUrl?: string;
}

export interface MockConversation {
  id: string;
  participants: MockUser[];
  lastMessage: MockMessage;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
}

// Mock users data
export const mockUsers: MockUser[] = [
  {
    id: 'philippe.bernier@email.com',
    name: 'Philippe Bernier',
    email: 'philippe.bernier@email.com',
    position: 'Forward',
    school: 'University of Montreal',
    level: 'University',
    avatar: 'P',
    isOnline: true,
    lastSeen: new Date()
  },
  {
    id: 'john.smith@email.com',
    name: 'John Smith',
    email: 'john.smith@email.com',
    position: 'Head Coach',
    school: 'Montreal Impact Academy',
    level: 'Professional',
    avatar: 'J',
    isOnline: true,
    lastSeen: new Date()
  },
  {
    id: 'marie.dubois@email.com',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    position: 'Team Captain',
    school: 'University of Montreal',
    level: 'University',
    avatar: 'M',
    isOnline: false,
    lastSeen: new Date(Date.now() - 300000) // 5 minutes ago
  },
  {
    id: 'alex.thompson@email.com',
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    position: 'Professional Coach',
    school: 'CF Montreal',
    level: 'Professional',
    avatar: 'A',
    isOnline: true,
    lastSeen: new Date()
  },
  {
    id: 'sarah.wilson@email.com',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    position: 'Technical Director',
    school: 'Ottawa TFC Academy',
    level: 'Professional',
    avatar: 'S',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1800000) // 30 minutes ago
  },
  {
    id: 'mike.johnson@email.com',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    position: 'Scout',
    school: 'Toronto FC',
    level: 'Professional',
    avatar: 'M',
    isOnline: true,
    lastSeen: new Date()
  },
  {
    id: 'lucas.martin@email.com',
    name: 'Lucas Martin',
    email: 'lucas.martin@email.com',
    position: 'Professional Player',
    school: 'Vancouver Whitecaps',
    level: 'Professional',
    avatar: 'L',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: 'emma.white@email.com',
    name: 'Emma White',
    email: 'emma.white@email.com',
    position: 'Team Captain',
    school: 'McGill University',
    level: 'University',
    avatar: 'E',
    isOnline: true,
    lastSeen: new Date()
  },
  {
    id: 'thomas.lee@email.com',
    name: 'Thomas Lee',
    email: 'thomas.lee@email.com',
    position: 'Midfielder',
    school: 'Concordia University',
    level: 'University',
    avatar: 'T',
    isOnline: false,
    lastSeen: new Date(Date.now() - 7200000) // 2 hours ago
  }
];

// Mock messages data
export const mockMessages: MockMessage[] = [
  {
    id: '1',
    content: 'Salut Philippe ! 👋 J\'ai regardé ton profil sur ProBreakthrough et je suis vraiment impressionné par tes performances cette saison. Tes statistiques de buts et tes highlights vidéo montrent un niveau exceptionnel. Serais-tu intéressé par une opportunité avec notre équipe U23 ? Nous cherchons un attaquant avec ton profil technique.',
    senderId: 'john.smith@email.com',
    receiverId: 'philippe.bernier@email.com',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    isRead: false,
    type: 'text'
  },
  {
    id: '2',
    content: 'Merci beaucoup Coach Smith ! 🙏 Je serais très intéressé par cette opportunité. Pouvez-vous me donner plus de détails sur le poste et les conditions ?',
    senderId: 'philippe.bernier@email.com',
    receiverId: 'john.smith@email.com',
    timestamp: new Date(Date.now() - 240000), // 4 minutes ago
    isRead: true,
    type: 'text'
  },
  {
    id: '3',
    content: 'Parfait ! 🎯 Nous cherchons un attaquant pour notre équipe U23. Le poste est disponible dès la saison prochaine (août 2024). Salaire compétitif, entraînements 5x/semaine, et possibilité de progression vers l\'équipe première. Serais-tu disponible pour un essai la semaine prochaine ?',
    senderId: 'john.smith@email.com',
    receiverId: 'philippe.bernier@email.com',
    timestamp: new Date(Date.now() - 180000), // 3 minutes ago
    isRead: false,
    type: 'text'
  },
  {
    id: '4',
    content: 'Salut Philippe ! Comment ça va ? J\'ai vu que tu as eu une excellente saison !',
    senderId: 'marie.dubois@email.com',
    receiverId: 'philippe.bernier@email.com',
    timestamp: new Date(Date.now() - 600000), // 10 minutes ago
    isRead: true,
    type: 'text'
  },
  {
    id: '5',
    content: 'Ça va bien, merci ! Et toi ? Oui, la saison s\'est bien passée. Tu joues toujours à l\'université ?',
    senderId: 'philippe.bernier@email.com',
    receiverId: 'marie.dubois@email.com',
    timestamp: new Date(Date.now() - 540000), // 9 minutes ago
    isRead: false,
    type: 'text'
  },
  {
    id: '6',
    content: 'Philippe, j\'ai regardé tes highlights vidéo sur ton profil. Très impressionnant ! 🚀 Ta technique de frappe et ta vision du jeu sont exactement ce que nous cherchons. Serais-tu disponible pour un essai avec notre équipe première la semaine prochaine ? Nous avons un match amical contre Toronto FC.',
    senderId: 'alex.thompson@email.com',
    receiverId: 'philippe.bernier@email.com',
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    isRead: false,
    type: 'text'
  },
  {
    id: '7',
    content: 'Absolument ! Je serais ravi de faire un essai. Quand exactement ?',
    senderId: 'philippe.bernier@email.com',
    receiverId: 'alex.thompson@email.com',
    timestamp: new Date(Date.now() - 840000), // 14 minutes ago
    isRead: true,
    type: 'text'
  },
  {
    id: '8',
    content: 'Mercredi à 14h au stade Saputo. Tu peux venir ?',
    senderId: 'alex.thompson@email.com',
    receiverId: 'philippe.bernier@email.com',
    timestamp: new Date(Date.now() - 780000), // 13 minutes ago
    isRead: false,
    type: 'text'
  },
  {
    id: '9',
    content: 'Parfait ! Je serai là. Merci pour cette opportunité.',
    senderId: 'philippe.bernier@email.com',
    receiverId: 'alex.thompson@email.com',
    timestamp: new Date(Date.now() - 720000), // 12 minutes ago
    isRead: true,
    type: 'text'
  },
  {
    id: '10',
    content: 'Salut Philippe ! 👋 J\'ai vu ton profil sur ProBreakthrough. Très impressionnant ! Tes recommandations de John Smith et Marie Dubois parlent d\'elles-mêmes. Nous cherchons des talents pour notre académie et ton profil correspond parfaitement à nos critères.',
    senderId: 'sarah.wilson@email.com',
    receiverId: 'philippe.bernier@email.com',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    isRead: true,
    type: 'text'
  },
  {
    id: '11',
    content: 'Merci Sarah ! Comment puis-je vous aider ?',
    senderId: 'philippe.bernier@email.com',
    receiverId: 'sarah.wilson@email.com',
    timestamp: new Date(Date.now() - 1740000), // 29 minutes ago
    isRead: false,
    type: 'text'
  },
  {
    id: '12',
    content: 'Nous cherchons des talents pour notre académie. Serais-tu intéressé ?',
    senderId: 'sarah.wilson@email.com',
    receiverId: 'philippe.bernier@email.com',
    timestamp: new Date(Date.now() - 1680000), // 28 minutes ago
    isRead: false,
    type: 'text'
  }
];

// Generate mock conversations
export const generateMockConversations = (currentUserId: string): MockConversation[] => {
  console.log('Generating conversations for user:', currentUserId);
  console.log('Total mock messages:', mockMessages.length);
  
  const conversations: MockConversation[] = [];
  
  // Group messages by conversation
  const conversationMap = new Map<string, MockMessage[]>();
  
  mockMessages.forEach(message => {
    if (message.senderId === currentUserId || message.receiverId === currentUserId) {
      const otherUserId = message.senderId === currentUserId ? message.receiverId : message.senderId;
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, []);
      }
      conversationMap.get(otherUserId)!.push(message);
    }
  });
  
  console.log('Conversation map size:', conversationMap.size);

  // Create conversations from grouped messages
  conversationMap.forEach((messages, otherUserId) => {
    const otherUser = mockUsers.find(user => user.id === otherUserId);
    const currentUser = mockUsers.find(user => user.id === currentUserId);
    
    if (!otherUser || !currentUser) return;

    // Sort messages by timestamp
    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const lastMessage = messages[messages.length - 1];
    const unreadCount = messages.filter(msg => 
      msg.receiverId === currentUserId && !msg.isRead
    ).length;

    conversations.push({
      id: `conv_${currentUserId}_${otherUserId}`,
      participants: [currentUser, otherUser],
      lastMessage,
      unreadCount,
      isPinned: Math.random() > 0.8, // 20% chance of being pinned
      isArchived: false
    });
  });

  // Sort conversations by last message timestamp
  conversations.sort((a, b) => 
    new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
  );

  return conversations;
};

// Get messages for a specific conversation
export const getConversationMessages = (conversationId: string, currentUserId: string): MockMessage[] => {
  // Parse conversation ID: conv_user1_user2
  const parts = conversationId.split('_');
  if (parts.length !== 3) return [];
  
  const user1 = parts[1];
  const user2 = parts[2];
  const otherUserId = user1 === currentUserId ? user2 : user1;
  
  return mockMessages.filter(message => 
    (message.senderId === currentUserId && message.receiverId === otherUserId) ||
    (message.senderId === otherUserId && message.receiverId === currentUserId)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Get unique filter options
export const getFilterOptions = () => {
  const positions = new Set<string>();
  const levels = new Set<string>();
  const schools = new Set<string>();

  mockUsers.forEach(user => {
    if (user.position) positions.add(user.position);
    if (user.level) levels.add(user.level);
    if (user.school) schools.add(user.school);
  });

  return {
    positions: Array.from(positions).sort(),
    levels: Array.from(levels).sort(),
    schools: Array.from(schools).sort()
  };
}; 