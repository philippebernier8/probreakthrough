import { NextResponse } from 'next/server';

export async function GET() {
  // Simuler un délai de chargement
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json({
    youtubeVideos: [],
    analysisVideos: []
  });
} 