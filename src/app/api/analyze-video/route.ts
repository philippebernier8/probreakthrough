import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import { writeFile, readFile, unlink } from 'fs/promises';

// Configuration AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-3',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'probreakthrough-videos';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as File;
    
    if (!video) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Générer un ID unique pour la vidéo
    const videoId = uuidv4();
    const videoBuffer = Buffer.from(await video.arrayBuffer());

    // Compresser la vidéo
    const tempInputPath = `/tmp/${videoId}-input.mp4`;
    const tempOutputPath = `/tmp/${videoId}.mp4`;
    await writeFile(tempInputPath, videoBuffer);

    const compressedVideoBuffer = await new Promise<Buffer>((resolve, reject) => {
      ffmpeg()
        .input(tempInputPath)
        .outputOptions([
          '-c:v libx264',
          '-crf 28',
          '-preset faster',
          '-c:a aac',
          '-b:a 128k'
        ])
        .toFormat('mp4')
        .on('end', async () => {
          try {
            const buffer = await readFile(tempOutputPath);
            resolve(buffer);
          } catch (err) {
            reject(err);
          }
        })
        .on('error', reject)
        .save(tempOutputPath);
    });

    // Upload vers S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${videoId}.mp4`,
        Body: compressedVideoBuffer,
        ContentType: 'video/mp4'
      })
    );

    // Simuler l'analyse (à remplacer par votre vrai modèle d'analyse)
    const results = {
      accuracy: Math.floor(Math.random() * 30) + 70,
      speed: Math.floor(Math.random() * 30) + 70,
      technique: Math.floor(Math.random() * 30) + 70
    };

    // Supprimer la vidéo de S3 après l'analyse
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${videoId}.mp4`
      })
    );

    await unlink(tempInputPath);
    await unlink(tempOutputPath);

    return NextResponse.json({
      id: videoId,
      ...results
    });

  } catch (error) {
    console.error('Error processing video:', error);
    return NextResponse.json(
      { error: 'Failed to process video' },
      { status: 500 }
    );
  }
} 