import { NextRequest, NextResponse } from 'next/server';

// Mock storage for messages (in production, this would be a database)
let messages: any[] = [
  // Conversation 1 - Coach Martinez
  {
    id: '1_1',
    content: 'Hi Philippe! How are you doing today?',
    senderId: '1',
    receiverId: 'user@example.com',
    conversationId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true
  },
  {
    id: '1_1a',
    content: 'I hope you had a good weekend!',
    senderId: '1',
    receiverId: 'user@example.com',
    conversationId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
    isRead: true
  },
  {
    id: '1_1b',
    content: 'Ready for our training session this week?',
    senderId: '1',
    receiverId: 'user@example.com',
    conversationId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: true
  },
  {
    id: '1_1b',
    content: 'I hope you had a good weekend!',
    senderId: '1',
    receiverId: 'user@example.com',
    conversationId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7),
    isRead: true
  },
  {
    id: '1_1c',
    content: 'Ready for our training session this week?',
    senderId: '1',
    receiverId: 'user@example.com',
    conversationId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    isRead: true
  },
  {
    id: '1_1d',
    content: 'Absolutely! I\'ve been practicing the drills you showed me.',
    senderId: 'user@example.com',
    receiverId: '1',
    conversationId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    isRead: true
  },
  {
    id: '1_1e',
    content: 'That\'s great to hear! Consistency is key.',
    senderId: '1',
    receiverId: 'user@example.com',
    conversationId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    isRead: true
  },
  {
    id: '1_1f',
    content: 'I\'m doing great, Coach! Ready for our session.',
    senderId: 'user@example.com',
    receiverId: '1',
    conversationId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true
  },
  {
    id: '1_2',
    content: 'I\'m doing great, Coach! Ready for our session.',
    senderId: 'user@example.com',
    receiverId: '1',
    conversationId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    isRead: true
  },
  {
    id: '1_3',
    content: 'Perfect! Let\'s work on your shooting technique today.',
    senderId: '1',
    receiverId: 'user@example.com',
    conversationId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    isRead: true
  },
  {
    id: '1_4',
    content: 'Great session today! Your technique is improving.',
    senderId: '1',
    receiverId: 'user@example.com',
    conversationId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false
  },
  {
    id: '1_5',
    content: 'Thanks Coach! I felt much more confident today.',
    senderId: 'user@example.com',
    receiverId: '1',
    conversationId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    isRead: false
  },

  // Conversation 2 - Coach Johnson
  {
    id: '2_1',
    content: 'Philippe, I\'ve reviewed your latest performance.',
    senderId: '2',
    receiverId: 'user@example.com',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 15),
    isRead: true
  },
  {
    id: '2_1a',
    content: 'I\'ve been following your progress closely.',
    senderId: '2',
    receiverId: 'user@example.com',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14),
    isRead: true
  },
  {
    id: '2_1b',
    content: 'Your dedication is impressive.',
    senderId: '2',
    receiverId: 'user@example.com',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 13),
    isRead: true
  },
  {
    id: '2_1c',
    content: 'Thank you for the kind words, Coach.',
    senderId: 'user@example.com',
    receiverId: '2',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    isRead: true
  },
  {
    id: '2_1d',
    content: 'I\'m always striving to improve.',
    senderId: 'user@example.com',
    receiverId: '2',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 11),
    isRead: true
  },
  {
    id: '2_1e',
    content: 'That\'s exactly what I like to hear.',
    senderId: '2',
    receiverId: 'user@example.com',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
    isRead: true
  },
  {
    id: '2_1f',
    content: 'Your progress over the last month has been impressive.',
    senderId: '2',
    receiverId: 'user@example.com',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9),
    isRead: true
  },
  {
    id: '2_1g',
    content: 'I can see the improvement in your positioning.',
    senderId: '2',
    receiverId: 'user@example.com',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    isRead: true
  },
  {
    id: '2_1h',
    content: 'When can we schedule the next training session?',
    senderId: 'user@example.com',
    receiverId: '2',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7),
    isRead: true
  },
  {
    id: '2_1i',
    content: 'How about tomorrow at 3 PM?',
    senderId: '2',
    receiverId: 'user@example.com',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    isRead: true
  },
  {
    id: '2_1b',
    content: 'Your progress over the last month has been impressive.',
    senderId: '2',
    receiverId: 'user@example.com',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    isRead: true
  },
  {
    id: '2_1c',
    content: 'Thank you Coach! I\'ve been working hard on my technique.',
    senderId: 'user@example.com',
    receiverId: '2',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    isRead: true
  },
  {
    id: '2_1d',
    content: 'I can see the improvement in your positioning.',
    senderId: '2',
    receiverId: 'user@example.com',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    isRead: true
  },
  {
    id: '2_2',
    content: 'When can we schedule the next training session?',
    senderId: 'user@example.com',
    receiverId: '2',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true
  },
  {
    id: '2_3',
    content: 'How about tomorrow at 3 PM?',
    senderId: '2',
    receiverId: 'user@example.com',
    conversationId: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    isRead: true
  },

  // Conversation 3 - Coach Williams
  {
    id: '3_1',
    content: 'Philippe, I\'ve finished analyzing your video.',
    senderId: '3',
    receiverId: 'user@example.com',
    conversationId: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    isRead: true
  },
  {
    id: '3_2',
    content: 'Your video analysis is ready for review.',
    senderId: '3',
    receiverId: 'user@example.com',
    conversationId: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    isRead: false
  },
  {
    id: '3_3',
    content: 'I can see several areas where we can improve your positioning.',
    senderId: '3',
    receiverId: 'user@example.com',
    conversationId: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    isRead: false
  },

  // Conversation 4 - Athlete Sarah
  {
    id: '4_1',
    content: 'Hey Philippe! I watched your last game.',
    senderId: '4',
    receiverId: 'user@example.com',
    conversationId: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
    isRead: true
  },
  {
    id: '4_2',
    content: 'You were amazing! How do you stay so focused?',
    senderId: '4',
    receiverId: 'user@example.com',
    conversationId: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5),
    isRead: true
  },
  {
    id: '4_3',
    content: 'Thanks Sarah! It\'s all about preparation and mindset.',
    senderId: 'user@example.com',
    receiverId: '4',
    conversationId: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: true
  },
  {
    id: '4_4',
    content: 'Thanks for the training tips!',
    senderId: 'user@example.com',
    receiverId: '4',
    conversationId: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
    isRead: true
  }
];

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const userEmail = 'user@example.com';

    // Get messages for this conversation
    const conversationMessages = messages.filter(msg => msg.conversationId === conversationId);

    // Mark messages as read for this user
    messages = messages.map(msg => 
      msg.conversationId === conversationId && msg.receiverId === userEmail
        ? { ...msg, isRead: true }
        : msg
    );

    return NextResponse.json({ 
      messages: conversationMessages,
      conversationId 
    });
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 