import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-3',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    
    if (!videoFile) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { error: 'Video file too large. Maximum size is 100MB.' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const uniqueFileName = `${user.id}/${timestamp}-${videoFile.name}`;

    // Convertir le fichier en buffer
    const videoBuffer = Buffer.from(await videoFile.arrayBuffer());

    // Upload vers S3 (si configuré)
    let videoUrl = '';
    if (process.env.AWS_BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID) {
      try {
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uniqueFileName,
            Body: videoBuffer,
            ContentType: videoFile.type,
          })
        );
        videoUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
      } catch (s3Error) {
        console.error('S3 upload failed:', s3Error);
        // Fallback: créer une URL temporaire
        videoUrl = `temp://${uniqueFileName}`;
      }
    } else {
      // Pas de S3 configuré, utiliser une URL temporaire
      videoUrl = `temp://${uniqueFileName}`;
    }

    // Créer l'entrée dans la base de données (version simplifiée pour le schéma actuel)
    const video = await prisma.video.create({
      data: {
        url: videoUrl,
        status: 'UPLOADED',
        matchId: user.id, // Utiliser matchId temporairement pour stocker l'userId
      },
    });

    // Ajouter à la file d'analyse
    await prisma.analysisQueue.create({
      data: {
        videoId: video.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ 
      success: true, 
      videoId: video.id,
      videoUrl: videoUrl
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
} 