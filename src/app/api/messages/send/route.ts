import { NextRequest, NextResponse } from 'next/server';

// Mock storage for messages (in production, this would be a database)
let messages: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { content, receiverId, conversationId } = await request.json();
    
    if (!content || !receiverId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Mock user email since auth is disabled
    const senderId = 'user@example.com';

    const message = {
      id: Date.now().toString(),
      content,
      senderId,
      receiverId,
      conversationId,
      timestamp: new Date(),
      isRead: false
    };

    // Store message in mock storage
    messages.push(message);
    console.log('Message sent:', message);

    return NextResponse.json({ 
      success: true, 
      message 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// New endpoint to mark messages as read
export async function PUT(request: NextRequest) {
  try {
    const { conversationId, userId } = await request.json();
    
    if (!conversationId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Mark all messages in conversation as read for this user
    messages = messages.map(msg => 
      msg.conversationId === conversationId && msg.receiverId === userId
        ? { ...msg, isRead: true }
        : msg
    );

    return NextResponse.json({ 
      success: true, 
      updatedCount: messages.filter(msg => msg.conversationId === conversationId && msg.receiverId === userId).length
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 