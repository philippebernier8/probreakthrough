import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const { userId, matchId, videoBuffer, fileName } = await request.json();

    // Générer un nom de fichier unique
    const uniqueFileName = `${userId}/${matchId}/${Date.now()}-${fileName}`;

    // Upload vers S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: uniqueFileName,
        Body: Buffer.from(videoBuffer),
        ContentType: 'video/mp4',
      })
    );

    // Créer l'entrée dans la base de données
    const video = await prisma.video.create({
      data: {
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`,
        status: 'UPLOADED',
        matchId,
      },
    });

    // Ajouter à la file d'analyse
    await prisma.analysisQueue.create({
      data: {
        videoId: video.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, videoId: video.id });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
} 