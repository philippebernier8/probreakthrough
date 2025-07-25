import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Récupérer les vidéos de l'utilisateur connecté
    const analysisVideos = await prisma.video.findMany({
      where: {
        OR: [
          { matchId: user.id }, // Vidéos avec userId
          { matchId: null }     // Vidéos sans userId (pour compatibilité)
        ]
      },
      orderBy: {
        id: 'desc' // Trier par ID décroissant (plus récent en premier)
      }
    });

    console.log('User ID:', user.id);
    console.log('Found videos:', analysisVideos.length);
    console.log('Videos:', analysisVideos);

    // Transformer les données pour correspondre à l'interface attendue
    const mockAnalysisVideos = analysisVideos.map(video => ({
      id: video.id,
      filename: video.url.split('/').pop() || 'video.mp4',
      uploadDate: new Date().toISOString(), // Utiliser la date actuelle car createdAt n'existe pas encore
      status: video.status.toLowerCase(),
      progress: video.status === 'COMPLETED' ? 100 : video.status === 'PROCESSING' ? 50 : 0,
      videoUrl: video.url,
      comments: [],
      likes: 0,
      shares: 0,
      isPublic: true,
      results: {
        accuracy: Math.floor(Math.random() * 30) + 70,
        speed: Math.floor(Math.random() * 30) + 70,
        technique: Math.floor(Math.random() * 30) + 70
      }
    }));

    // Vidéos YouTube vides pour l'instant
    const youtubeVideos: any[] = [];

    return NextResponse.json({
      youtubeVideos,
      analysisVideos: mockAnalysisVideos
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { type, data } = await request.json();

    if (type === 'youtube') {
      // Pour l'instant, retourner une réponse simulée
      return NextResponse.json({ 
        success: true, 
        video: {
          id: Date.now().toString(),
          title: data.title,
          youtubeUrl: data.youtubeUrl,
          thumbnailUrl: data.thumbnailUrl
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid video type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
} 