import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    // For now, we'll use a mock user email since auth is disabled
    const userEmail = 'user@example.com';

    // Mock data for now - in production this would come from the database
    let mockConversations = [
      {
        id: '1',
        participants: [
          { id: '1', name: 'Coach Martinez', avatar: '/avatars/coach1.jpg', isOnline: true },
          { id: userEmail, name: 'You', avatar: '/avatars/user.jpg', isOnline: true }
        ],
        lastMessage: {
          id: '1',
          content: 'Great session today! Your technique is improving.',
          senderId: '1',
          receiverId: userEmail,
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          isRead: false
        },
        unreadCount: 2
      },
      {
        id: '2',
        participants: [
          { id: '2', name: 'Coach Johnson', avatar: '/avatars/coach2.jpg', isOnline: false },
          { id: userEmail, name: 'You', avatar: '/avatars/user.jpg', isOnline: true }
        ],
        lastMessage: {
          id: '2',
          content: 'When can we schedule the next training session?',
          senderId: userEmail,
          receiverId: '2',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          isRead: true
        },
        unreadCount: 0
      },
      {
        id: '3',
        participants: [
          { id: '3', name: 'Coach Williams', avatar: '/avatars/coach3.jpg', isOnline: true },
          { id: userEmail, name: 'You', avatar: '/avatars/user.jpg', isOnline: true }
        ],
        lastMessage: {
          id: '3',
          content: 'Your video analysis is ready for review.',
          senderId: '3',
          receiverId: userEmail,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
          isRead: false
        },
        unreadCount: 1
      },
      {
        id: '4',
        participants: [
          { id: '4', name: 'Athlete Sarah', avatar: '/avatars/athlete1.jpg', isOnline: false },
          { id: userEmail, name: 'You', avatar: '/avatars/user.jpg', isOnline: true }
        ],
        lastMessage: {
          id: '4',
          content: 'Thanks for the training tips!',
          senderId: userEmail,
          receiverId: '4',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          isRead: true
        },
        unreadCount: 0
      }
    ];

    // Filter conversations based on search
    if (search) {
      mockConversations = mockConversations.filter(conv => {
        const otherParticipant = conv.participants.find(p => p.id !== userEmail);
        return otherParticipant?.name.toLowerCase().includes(search.toLowerCase()) ||
               conv.lastMessage.content.toLowerCase().includes(search.toLowerCase());
      });
    }

    return NextResponse.json({ conversations: mockConversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 