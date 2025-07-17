import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    // For now, we'll use a mock user email since auth is disabled
    const userEmail = 'user@example.com';

    // Mock data for now - in production this would come from the database
    const mockConversations = [
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
      }
    ];

    return NextResponse.json({ conversations: mockConversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 