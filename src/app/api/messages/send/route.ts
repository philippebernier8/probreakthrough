import { NextRequest, NextResponse } from 'next/server';

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
      timestamp: new Date(),
      isRead: false
    };

    // In production, this would save to the database
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