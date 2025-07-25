"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Comment {
  id: string;
  text: string;
  timestamp: string;
  author: string;
  likes: number;
  replies: Comment[];
}

interface YouTubeVideo {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  addedDate: string;
  likes: number;
  shares: number;
  isPublic: boolean;
}

interface VideoAnalysis {
  id: string;
  filename: string;
  uploadDate: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  videoUrl?: string;
  comments: Comment[];
  likes: number;
  shares: number;
  isPublic: boolean;
  results?: {
    accuracy: number;
    speed: number;
    technique: number;
  };
}

// Nouvelle interface pour les filtres
interface Filters {
  dateRange: 'all' | 'week' | 'month' | 'year';
  sortBy: 'date' | 'title' | 'accuracy' | 'speed' | 'technique';
  sortOrder: 'asc' | 'desc';
}

// Fonction pour formater les dates de manière cohérente
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export default function MyVideosPage() {
  console.log('🎬 MyVideosPage component rendering...'); // Debug log
  
  const [activeTab, setActiveTab] = useState<'highlights' | 'analysis'>('highlights');
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [videos, setVideos] = useState<VideoAnalysis[]>([]);
  const [currentUpload, setCurrentUpload] = useState<VideoAnalysis | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoAnalysis | null>(null);
  const [newComment, setNewComment] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [filters, setFilters] = useState<Filters>({
    dateRange: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les vidéos depuis l'API au montage de la page
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/videos');
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        const data = await response.json();
        setYoutubeVideos(data.youtubeVideos || []);
        setVideos(data.analysisVideos || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();

    // Nettoyer les URLs des vidéos précédentes
    return () => {
      videos.forEach(video => {
        if (video.videoUrl && video.videoUrl.startsWith('blob:')) {
          URL.revokeObjectURL(video.videoUrl);
        }
      });
    };
  }, []);

  // Move filteredYoutubeVideos callback to the top
  const filteredYoutubeVideos = useCallback(() => {
    let filtered = [...youtubeVideos];

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par date
    const now = new Date();
    if (filters.dateRange !== 'all') {
      filtered = filtered.filter(video => {
        const videoDate = new Date(video.addedDate);
        switch (filters.dateRange) {
          case 'week':
            return now.getTime() - videoDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
          case 'month':
            return now.getTime() - videoDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
          case 'year':
            return now.getTime() - videoDate.getTime() <= 365 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });
    }

    // Trier
    filtered.sort((a, b) => {
      if (filters.sortBy === 'date') {
        return filters.sortOrder === 'desc'
          ? new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
          : new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
      } else {
        return filters.sortOrder === 'desc'
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [youtubeVideos, filters, searchTerm]);

  // Move filteredAnalysisVideos callback to the top
  const filteredAnalysisVideos = useCallback(() => {
    let filtered = [...videos];

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par date
    const now = new Date();
    if (filters.dateRange !== 'all') {
      filtered = filtered.filter(video => {
        const videoDate = new Date(video.uploadDate);
        switch (filters.dateRange) {
          case 'week':
            return now.getTime() - videoDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
          case 'month':
            return now.getTime() - videoDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
          case 'year':
            return now.getTime() - videoDate.getTime() <= 365 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });
    }

    // Trier
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          return filters.sortOrder === 'desc'
            ? new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
            : new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        case 'title':
          return filters.sortOrder === 'desc'
            ? b.filename.localeCompare(a.filename)
            : a.filename.localeCompare(b.filename);
        case 'accuracy':
          return filters.sortOrder === 'desc'
            ? (b.results?.accuracy || 0) - (a.results?.accuracy || 0)
            : (a.results?.accuracy || 0) - (b.results?.accuracy || 0);
        case 'speed':
          return filters.sortOrder === 'desc'
            ? (b.results?.speed || 0) - (a.results?.speed || 0)
            : (a.results?.speed || 0) - (b.results?.speed || 0);
        case 'technique':
          return filters.sortOrder === 'desc'
            ? (b.results?.technique || 0) - (a.results?.technique || 0)
            : (a.results?.technique || 0) - (b.results?.technique || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [videos, filters, searchTerm]);

  // Move onDrop callback to the top with other hooks
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const videoFile = acceptedFiles[0];
    if (!videoFile) return;

    // Vérifier la taille de la vidéo
    if (!checkVideoSize(videoFile)) return;

    // Créer l'URL de prévisualisation
    const videoUrl = URL.createObjectURL(videoFile);

    // Créer un nouvel objet d'analyse
    const newAnalysis: VideoAnalysis = {
      id: Date.now().toString(),
      filename: videoFile.name,
      uploadDate: new Date().toISOString(),
      status: 'uploading',
      progress: 0,
      videoUrl,
      comments: [],
      likes: 0,
      shares: 0,
      isPublic: true
    };

    setCurrentUpload(newAnalysis);

    try {
      // Préparer le FormData pour l'upload
      const formData = new FormData();
      formData.append('video', videoFile);

      // Simuler la progression de l'upload
      const uploadInterval = setInterval(() => {
        setCurrentUpload(prev => {
          if (!prev || prev.progress >= 90) {
            clearInterval(uploadInterval);
            return prev;
          }
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 500);

      // Envoyer la vidéo à l'API d'upload
      const uploadResponse = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(uploadInterval);

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadResult = await uploadResponse.json();

      // Mettre à jour le statut pour montrer que l'analyse est en cours
      setCurrentUpload(prev => prev ? { ...prev, status: 'processing', progress: 90 } : null);

      // Simuler l'analyse (pour l'instant)
      const results = {
        accuracy: Math.floor(Math.random() * 30) + 70,
        speed: Math.floor(Math.random() * 30) + 70,
        technique: Math.floor(Math.random() * 30) + 70
      };

      // Ajouter l'analyse complétée à la liste
      const completedAnalysis: VideoAnalysis = {
        ...newAnalysis,
        id: uploadResult.videoId,
        status: 'completed',
        progress: 100,
        videoUrl: uploadResult.videoUrl || newAnalysis.videoUrl,
        results: results
      };

      setVideos(prev => [...prev, completedAnalysis]);
      setCurrentUpload(null);

      // Recharger les vidéos depuis l'API pour avoir les données persistées
      const videosResponse = await fetch('/api/videos');
      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        setVideos(videosData.analysisVideos || []);
        // Afficher un message de succès
        alert('Vidéo uploadée et sauvegardée avec succès !');
      } else {
        console.warn('Failed to reload videos from API');
        alert('Vidéo uploadée ! Cliquez sur "Sauvegarder les vidéos" pour la persister.');
      }

    } catch (error) {
      console.error('Upload failed:', error);
      setCurrentUpload(prev => prev ? { ...prev, status: 'error' } : null);
    }
  }, []);

  // Add useDropzone hook initialization
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4']
    },
    multiple: false
  });



  // Fonction pour extraire l'ID YouTube d'une URL
  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Fonction pour vérifier la taille de la vidéo (max 100MB)
  const checkVideoSize = (file: File) => {
    const maxSize = 100 * 1024 * 1024; // 100MB en bytes
    if (file.size > maxSize) {
      alert('Video size must be less than 100MB');
      return false;
    }
    return true;
  };

  // Fonction pour sauvegarder explicitement les vidéos
  const handleSaveVideos = async () => {
    console.log('🔄 handleSaveVideos called!'); // Debug log
    try {
      setLoading(true);
      console.log('📊 YouTube videos to save:', youtubeVideos.length);
      
      // Sauvegarder les vidéos YouTube
      if (youtubeVideos.length > 0) {
        for (const video of youtubeVideos) {
          console.log('💾 Saving video:', video.title);
          await fetch('/api/videos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'youtube',
              data: video
            })
          });
        }
      }

      // Recharger les vidéos depuis l'API
      console.log('🔄 Reloading videos from API...');
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        setVideos(data.analysisVideos || []);
        setYoutubeVideos(data.youtubeVideos || []);
        console.log('✅ Videos saved successfully!');
        alert('Vidéos sauvegardées avec succès !');
      } else {
        throw new Error('Failed to reload videos');
      }
    } catch (error) {
      console.error('❌ Save failed:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Videos</h1>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Videos</h1>
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Fonction pour ajouter une vidéo YouTube
  const handleAddYoutubeVideo = () => {
    if (!newYoutubeUrl.trim() || !newVideoTitle.trim()) return;

    const youtubeId = extractYoutubeId(newYoutubeUrl);
    if (!youtubeId) {
      alert('Invalid YouTube URL');
      return;
    }

    const newVideo: YouTubeVideo = {
      id: youtubeId,
      title: newVideoTitle,
      youtubeUrl: newYoutubeUrl,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      addedDate: new Date().toISOString(),
      likes: 0,
      shares: 0,
      isPublic: true
    };

    setYoutubeVideos(prev => {
      const updated = [...prev, newVideo];
      // Synchroniser la vidéo de profil
      try {
        const players = JSON.parse(localStorage.getItem('players') || '[]');
        if (players.length > 0) {
          players[0].highlightVideo = newYoutubeUrl;
          localStorage.setItem('players', JSON.stringify(players));
        }
      } catch (e) { /* ignore */ }
      // Sauvegarder immédiatement dans le localStorage
      localStorage.setItem('youtubeVideos', JSON.stringify(updated));
      return updated;
    });
    setNewYoutubeUrl('');
    setNewVideoTitle('');
  };

  // Fonction pour supprimer une vidéo
  const handleDeleteVideo = (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (video && video.videoUrl) {
      URL.revokeObjectURL(video.videoUrl);
    }
    setVideos(prev => prev.filter(video => video.id !== videoId));
    if (selectedVideo?.id === videoId) {
      setSelectedVideo(null);
    }
  };

  // Fonction pour ajouter un commentaire
  const handleAddComment = (videoId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      timestamp: new Date().toISOString(),
      author: 'Coach', // À remplacer par le nom de l'utilisateur connecté
      likes: 0,
      replies: []
    };

    setVideos(prev => prev.map(video => {
      if (video.id === videoId) {
        return {
          ...video,
          comments: [...video.comments, comment]
        };
      }
      return video;
    }));

    setNewComment('');
  };

  // Ajouter ces nouvelles fonctions
  const handleLikeVideo = (videoId: string, type: 'highlight' | 'analysis') => {
    if (type === 'highlight') {
      setYoutubeVideos(prev => prev.map(video => {
        if (video.id === videoId) {
          return { ...video, likes: (video.likes || 0) + 1 };
        }
        return video;
      }));
    } else {
      setVideos(prev => prev.map(video => {
        if (video.id === videoId) {
          return { ...video, likes: (video.likes || 0) + 1 };
        }
        return video;
      }));
    }
  };

  const handleShareVideo = async (videoId: string, type: 'highlight' | 'analysis') => {
    const video = type === 'highlight' 
      ? youtubeVideos.find(v => v.id === videoId)
      : videos.find(v => v.id === videoId);

    if (!video) return;

    try {
      await navigator.clipboard.writeText(
        type === 'highlight' 
          ? (video as YouTubeVideo).youtubeUrl
          : `${window.location.origin}/shared-videos/${videoId}`
      );
      alert('Link copied to clipboard!');

      // Mettre à jour le compteur de partages
      if (type === 'highlight') {
        setYoutubeVideos(prev => prev.map(v => {
          if (v.id === videoId) {
            return { ...v, shares: (v.shares || 0) + 1 };
          }
          return v;
        }));
      } else {
        setVideos(prev => prev.map(v => {
          if (v.id === videoId) {
            return { ...v, shares: (v.shares || 0) + 1 };
          }
          return v;
        }));
      }
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link');
    }
  };

  const handleToggleVisibility = (videoId: string, type: 'highlight' | 'analysis') => {
    if (type === 'highlight') {
      setYoutubeVideos(prev => prev.map(video => {
        if (video.id === videoId) {
          return { ...video, isPublic: !video.isPublic };
        }
        return video;
      }));
    } else {
      setVideos(prev => prev.map(video => {
        if (video.id === videoId) {
          return { ...video, isPublic: !video.isPublic };
        }
        return video;
      }));
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* TEST ULTRA SIMPLE */}
          <div style={{background: 'red', color: 'white', padding: '20px', marginBottom: '20px', textAlign: 'center'}}>
            <h2>🚨 TEST - SI VOUS VOYEZ CECI, LE CODE FONCTIONNE 🚨</h2>
            <button 
              onClick={() => alert('TEST CLICKED!')}
              style={{background: 'yellow', color: 'black', padding: '10px', fontSize: '16px', fontWeight: 'bold'}}
            >
              CLIQUEZ ICI POUR TESTER
            </button>
          </div>
          
          <h1 className="text-3xl font-bold mb-8">My Videos</h1>

          {/* Tabs */}
          <div className="flex border-b mb-8">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'highlights'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('highlights')}
            >
              Highlights
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'analysis'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('analysis')}
            >
              Analysis
            </button>
          </div>

          {/* BOUTON DE TEST TRÈS VISIBLE */}
          <div className="bg-red-500 text-white p-4 mb-4 text-center">
            <button
              onClick={() => {
                console.log('🔴 BOUTON TEST CLICKED!');
                alert('Bouton de test fonctionne !');
              }}
              className="bg-yellow-400 text-black px-8 py-4 text-xl font-bold rounded-lg border-4 border-black"
            >
              🚨 BOUTON DE TEST - CLIQUEZ ICI 🚨
            </button>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search videos..."
                className="border rounded-lg px-3 py-2"
              />
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as Filters['dateRange'] }))}
                className="border rounded-lg px-3 py-2"
              >
                <option value="all">All time</option>
                <option value="week">Last week</option>
                <option value="month">Last month</option>
                <option value="year">Last year</option>
              </select>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as Filters['sortBy'] }))}
                className="border rounded-lg px-3 py-2"
              >
                <option value="date">Sort by date</option>
                <option value="title">Sort by title</option>
                {activeTab === 'analysis' && (
                  <>
                    <option value="accuracy">Sort by accuracy</option>
                    <option value="speed">Sort by speed</option>
                    <option value="technique">Sort by technique</option>
                  </>
                )}
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as Filters['sortOrder'] }))}
                className="border rounded-lg px-3 py-2"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
            
            {/* Bouton de sauvegarde */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  console.log('🔴 TEST BUTTON CLICKED!');
                  alert('Bouton de test cliqué !');
                }}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 text-lg font-bold"
                style={{ border: '4px solid yellow', fontSize: '18px' }}
              >
                🚨 BOUTON DE TEST - CLIQUEZ ICI 🚨
              </button>
            </div>
            
            {/* Bouton de sauvegarde original */}
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSaveVideos}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ border: '2px solid red' }} // Debug: bordure rouge pour voir le bouton
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Sauvegarder les vidéos
                  </>
                )}
              </button>
            </div>
          </div>

          {activeTab === 'highlights' ? (
            <div>
              {/* Formulaire d'ajout de vidéo YouTube */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-medium mb-4">Add YouTube Highlight</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    placeholder="Video title"
                    className="border rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    value={newYoutubeUrl}
                    onChange={(e) => setNewYoutubeUrl(e.target.value)}
                    placeholder="YouTube URL"
                    className="border rounded-lg px-3 py-2"
                  />
                </div>
                <button
                  onClick={handleAddYoutubeVideo}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Highlight
                </button>
              </div>

              {/* Message when no highlights */}
              {youtubeVideos.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <p>No highlights added yet</p>
                  <p className="text-sm mt-2">Add your first YouTube highlight video</p>
                </div>
              )}

              {/* Liste des highlights YouTube */}
              {activeTab === 'highlights' && (
                <>
                  {youtubeVideos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredYoutubeVideos().map(video => (
                        <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
                          <a
                            href={video.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative aspect-video"
                          >
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg className="w-16 h-16 text-red-600 opacity-90" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                              </svg>
                            </div>
                          </a>
                          <div className="p-4">
                            <h3 className="font-medium mb-2">{video.title}</h3>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>{formatDate(video.addedDate)}</span>
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => handleLikeVideo(video.id, 'highlight')}
                                  className="flex items-center gap-1 hover:text-blue-600"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                  <span>{video.likes || 0}</span>
                                </button>
                                <button
                                  onClick={() => handleShareVideo(video.id, 'highlight')}
                                  className="flex items-center gap-1 hover:text-blue-600"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                  </svg>
                                  <span>{video.shares || 0}</span>
                                </button>
                                <button
                                  onClick={() => handleToggleVisibility(video.id, 'highlight')}
                                  className={`flex items-center gap-1 ${video.isPublic ? 'text-green-600' : 'text-gray-500'} hover:text-green-700`}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  <span>{video.isPublic ? 'Public' : 'Private'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div>
              {/* Zone de dépôt de vidéo */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center mb-8 transition-colors
                  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
              >
                <input {...getInputProps()} />
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-lg text-gray-600">
                  {isDragActive ? "Drop your video here" : "Drag & drop your video here or click to select"}
                </p>
                <p className="text-sm text-gray-500 mt-2">Only MP4 files under 100MB are accepted</p>
              </div>

              {/* Upload en cours */}
              {currentUpload && (
                <div className="mb-8 p-4 bg-white rounded-lg shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{currentUpload.filename}</span>
                    <span className="text-sm text-gray-500">
                      {currentUpload.status === 'uploading' ? 'Uploading...' : 
                       currentUpload.status === 'processing' ? 'Processing...' :
                       currentUpload.status === 'error' ? 'Error!' : 'Completed'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentUpload.status === 'error' ? 'bg-red-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${currentUpload.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Message when no videos */}
              {videos.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <p>No videos uploaded yet</p>
                  <p className="text-sm mt-2">Upload your first video to see the analysis results</p>
                </div>
              )}

              {/* Liste des vidéos analysées */}
              {videos.length > 0 && (
                <div className="grid gap-6">
                  {filteredAnalysisVideos().map(video => (
                    <div key={video.id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">{video.filename}</h3>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            {formatDate(video.uploadDate)}
                          </span>
                          <button
                            onClick={() => setSelectedVideo(selectedVideo?.id === video.id ? null : video)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleLikeVideo(video.id, 'analysis')}
                            className="flex items-center gap-1 hover:text-blue-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{video.likes || 0}</span>
                          </button>
                          <button
                            onClick={() => handleShareVideo(video.id, 'analysis')}
                            className="flex items-center gap-1 hover:text-blue-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span>{video.shares || 0}</span>
                          </button>
                          <button
                            onClick={() => handleToggleVisibility(video.id, 'analysis')}
                            className={`flex items-center gap-1 ${video.isPublic ? 'text-green-600' : 'text-gray-500'} hover:text-green-700`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{video.isPublic ? 'Public' : 'Private'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Prévisualisation vidéo */}
                      {selectedVideo?.id === video.id && video.videoUrl && (
                        <div className="mb-4">
                          <video
                            ref={videoRef}
                            src={video.videoUrl}
                            controls
                            className="w-full rounded-lg"
                          />
                        </div>
                      )}
                      
                      {video.status === 'completed' && video.results && (
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-gray-600">Accuracy</p>
                            <p className="text-2xl font-bold text-blue-600">{video.results.accuracy}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Speed</p>
                            <p className="text-2xl font-bold text-blue-600">{video.results.speed}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Technique</p>
                            <p className="text-2xl font-bold text-blue-600">{video.results.technique}%</p>
                          </div>
                        </div>
                      )}

                      {/* Section commentaires */}
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-2">Comments</h4>
                        <div className="space-y-2 mb-4">
                          {video.comments.map(comment => (
                            <div key={comment.id} className="bg-gray-50 p-3 rounded">
                              <div className="flex justify-between text-sm text-gray-500 mb-1">
                                <span>{comment.author}</span>
                                <span>{formatDate(comment.timestamp)}</span>
                              </div>
                              <p>{comment.text}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 border rounded-lg px-3 py-2"
                          />
                          <button
                            onClick={() => handleAddComment(video.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                          >
                            Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 