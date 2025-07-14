import { NextResponse } from 'next/server';

// Données simulées pour le développement
const mockStats = {
  totalVideos: 15,
  averageAccuracy: 85,
  averageSpeed: 78,
  averageTechnique: 82,
  progressOverTime: [
    {
      date: '2024-02-01',
      accuracy: 75,
      speed: 70,
      technique: 72
    },
    {
      date: '2024-02-15',
      accuracy: 80,
      speed: 75,
      technique: 78
    },
    {
      date: '2024-03-01',
      accuracy: 85,
      speed: 78,
      technique: 82
    }
  ],
  recentAnalyses: [
    {
      date: '2024-03-01',
      videoName: 'Training Session #3',
      accuracy: 85,
      speed: 78,
      technique: 82
    },
    {
      date: '2024-02-15',
      videoName: 'Match Highlights',
      accuracy: 80,
      speed: 75,
      technique: 78
    },
    {
      date: '2024-02-01',
      videoName: 'Practice Drills',
      accuracy: 75,
      speed: 70,
      technique: 72
    }
  ]
};

export async function GET() {
  try {
    // TODO: Récupérer les vraies statistiques depuis la base de données
    return NextResponse.json(mockStats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
} 