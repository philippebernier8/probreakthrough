import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Pour le développement, accepter n'importe quel email/mot de passe
    if (email && password) {
      return NextResponse.json({
        token: 'dev_token_123',
        user: {
          id: '1',
          email: email,
          name: 'Test User',
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 