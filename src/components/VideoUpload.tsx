'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';

interface VideoUploadProps {
  matchId: string;
  onUploadComplete?: (videoId: string) => void;
}

export default function VideoUpload({ matchId, onUploadComplete }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Convertir le fichier en buffer
      const buffer = await file.arrayBuffer();
      
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          fileName: file.name,
          videoBuffer: Array.from(new Uint8Array(buffer)),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload video');
      }

      setUploadProgress(100);
      onUploadComplete?.(data.videoId);
      router.refresh();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [matchId, onUploadComplete, router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi']
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        {uploading ? (
        <div>
            <p className="text-gray-600">Uploading... {uploadProgress}%</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : isDragActive ? (
          <p className="text-blue-500">Déposez la vidéo ici...</p>
        ) : (
          <div>
            <p className="text-gray-600">
              Glissez et déposez une vidéo ici, ou cliquez pour sélectionner
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Formats acceptés: MP4, MOV, AVI
            </p>
          </div>
          )}
        </div>
    </div>
  );
} 