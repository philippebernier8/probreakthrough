import React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

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
  isMainHighlight?: boolean;
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
  isMainHighlight?: boolean;
  results?: {
    accuracy: number;
    speed: number;
    technique: number;
  };
}

interface Filters {
  dateRange: 'all' | 'week' | 'month' | 'year';
  sortBy: 'date' | 'title' | 'accuracy' | 'speed' | 'technique';
  sortOrder: 'asc' | 'desc';
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export default function MyVideosTab() {
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

  // Charger les vidéos depuis localStorage au montage
  useEffect(() => {
    console.log('🔄 Chargement des vidéos depuis localStorage...');
    
    // Charger les vidéos YouTube
    const storedYoutube = JSON.parse(localStorage.getItem('youtubeVideos') || '[]');
    // S'assurer que toutes les vidéos ont les propriétés nécessaires
    const normalizedYoutube = storedYoutube.map((video: any) => ({
      ...video,
      isMainHighlight: video.isMainHighlight || false,
      likes: video.likes || 0,
      shares: video.shares || 0,
      isPublic: video.isPublic !== undefined ? video.isPublic : true
    }));
    setYoutubeVideos(normalizedYoutube);
    console.log('📹 Vidéos YouTube chargées:', normalizedYoutube.length);
    console.log('📹 Structure des vidéos:', normalizedYoutube);
    
    // Charger les vidéos d'analyse
    const storedAnalysis = JSON.parse(localStorage.getItem('analysisVideos') || '[]');
    const normalizedAnalysis = storedAnalysis.map((video: any) => ({
      ...video,
      isMainHighlight: video.isMainHighlight || false,
      likes: video.likes || 0,
      shares: video.shares || 0,
      isPublic: video.isPublic !== undefined ? video.isPublic : true
    }));
    setVideos(normalizedAnalysis);
    console.log('🎬 Vidéos d\'analyse chargées:', normalizedAnalysis.length);
    
    setLoading(false);
  }, []);

  // Sauvegarder les vidéos normalisées dans localStorage
  useEffect(() => {
    if (youtubeVideos.length > 0) {
      localStorage.setItem('youtubeVideos', JSON.stringify(youtubeVideos));
      console.log('💾 Vidéos YouTube sauvegardées avec propriétés normalisées');
    }
  }, [youtubeVideos]);

  // Vérifier et marquer le highlight principal
  useEffect(() => {
    const playerStats = JSON.parse(localStorage.getItem('playerStats') || '{}');
    const { mainHighlight, mainHighlightType } = playerStats;
    
    console.log('🔍 Vérification du highlight principal...');
    console.log('📊 PlayerStats:', playerStats);
    console.log('📹 Vidéos YouTube actuelles:', youtubeVideos);
    
    if (mainHighlight && mainHighlightType) {
      console.log('🏆 Highlight principal trouvé:', { mainHighlight, mainHighlightType });
      
      if (mainHighlightType === 'highlight') {
        setYoutubeVideos(prev => prev.map(video => ({
          ...video,
          isMainHighlight: video.youtubeUrl === mainHighlight
        })));
      } else if (mainHighlightType === 'analysis') {
        setVideos(prev => prev.map(video => ({
          ...video,
          isMainHighlight: video.videoUrl === mainHighlight
        })));
      }
    }
  }, [youtubeVideos.length, videos.length]);

  const filteredYoutubeVideos = useCallback(() => {
    let filtered = [...youtubeVideos];
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
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

  const filteredAnalysisVideos = useCallback(() => {
    let filtered = [...videos];
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const videoFile = acceptedFiles[0];
    if (!videoFile) return;
    if (!checkVideoSize(videoFile)) return;
    const videoUrl = URL.createObjectURL(videoFile);
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
      const formData = new FormData();
      formData.append('video', videoFile);
      const uploadInterval = setInterval(() => {
        setCurrentUpload(prev => {
          if (!prev || prev.progress >= 90) {
            clearInterval(uploadInterval);
            return prev;
          }
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 500);
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        body: formData
      });
      clearInterval(uploadInterval);
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      setCurrentUpload(prev => prev ? { ...prev, status: 'processing', progress: 90 } : null);
      const results = await response.json();
      const completedAnalysis: VideoAnalysis = {
        ...newAnalysis,
        status: 'completed',
        progress: 100,
        results: {
          accuracy: results.accuracy,
          speed: results.speed,
          technique: results.technique
        }
      };
      setVideos(prev => [...prev, completedAnalysis]);
      setCurrentUpload(null);
    } catch (error) {
      console.error('Upload failed:', error);
      setCurrentUpload(prev => prev ? { ...prev, status: 'error' } : null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4']
    },
    multiple: false
  });

  // Nettoyer les URLs des vidéos au démontage
  useEffect(() => {
    return () => {
      videos.forEach(video => {
        if (video.videoUrl && video.videoUrl.startsWith('blob:')) {
          URL.revokeObjectURL(video.videoUrl);
        }
      });
    };
  }, [videos]);

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const checkVideoSize = (file: File) => {
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Video size must be less than 100MB');
      return false;
    }
    return true;
  };

  const handleSaveHighlights = () => {
    try {
      // Sauvegarder les vidéos YouTube
      localStorage.setItem('youtubeVideos', JSON.stringify(youtubeVideos));
      
      // Sauvegarder les vidéos d'analyse
      localStorage.setItem('analysisVideos', JSON.stringify(videos));
      
      // Afficher un message de succès
      alert(`✅ Sauvegarde réussie !\n\n📹 Vidéos YouTube: ${youtubeVideos.length}\n🎬 Vidéos d'analyse: ${videos.length}`);
      
      console.log('💾 Vidéos sauvegardées:', {
        youtubeVideos: youtubeVideos.length,
        analysisVideos: videos.length
      });
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde. Veuillez réessayer.');
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
      try {
        const players = JSON.parse(localStorage.getItem('players') || '[]');
        if (players.length > 0) {
          players[0].highlightVideo = newYoutubeUrl;
          localStorage.setItem('players', JSON.stringify(players));
        }
      } catch (e) { /* ignore */ }
      localStorage.setItem('youtubeVideos', JSON.stringify(updated));
      return updated;
    });
    setNewYoutubeUrl('');
    setNewVideoTitle('');
    
    // Afficher un message de confirmation
    alert('✅ Vidéo YouTube ajoutée et sauvegardée !');
    console.log('📹 Nouvelle vidéo YouTube ajoutée:', newVideo.title);
  };

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

  const handleAddComment = (videoId: string) => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      timestamp: new Date().toISOString(),
      author: 'Coach',
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

  // Fonction pour définir une vidéo comme highlight principal
  const handleSetMainHighlight = (videoId: string, type: 'highlight' | 'analysis') => {
    console.log('🚀 handleSetMainHighlight appelé avec:', videoId, type);
    if (type === 'highlight') {
      const video = youtubeVideos.find(v => v.id === videoId);
      console.log('🔍 Vidéo trouvée:', video);
      if (!video) {
        console.log('❌ Vidéo non trouvée');
        return;
      }

      try {
        // Récupérer l'ID du joueur actuel
        const players = JSON.parse(localStorage.getItem('players') || '[]');
        const currentPlayer = players.find((p: any) => p.name === 'Philippe Bernier');
        const playerId = currentPlayer?.id || 'default';
        
        // Sauvegarder dans le profil du joueur avec l'ID
        const playerStats = JSON.parse(localStorage.getItem('playerStats') || '{}');
        console.log('🔍 PlayerStats avant mise à jour:', playerStats);
        
        // Créer un nouvel objet avec les données du highlight
        const updatedPlayerStats = {
          ...playerStats,
          playerId: playerId,
          mainHighlight: video.youtubeUrl,
          mainHighlightTitle: video.title,
          mainHighlightType: type
        };
        
        console.log('🔍 Objet à sauvegarder:', updatedPlayerStats);
        console.log('🔍 JSON.stringify(updatedPlayerStats):', JSON.stringify(updatedPlayerStats));
        
        // Sauvegarder dans localStorage
        try {
          localStorage.setItem('playerStats', JSON.stringify(updatedPlayerStats));
          console.log('💾 localStorage.setItem exécuté');
          
          // Vérifier que la sauvegarde a fonctionné
          const savedData = JSON.parse(localStorage.getItem('playerStats') || '{}');
          console.log('💾 Données vérifiées après sauvegarde:', savedData);
          console.log('💾 mainHighlight présent:', !!savedData.mainHighlight);
          console.log('💾 mainHighlight URL:', savedData.mainHighlight);
          console.log('💾 mainHighlightTitle:', savedData.mainHighlightTitle);
          
          // Test direct de localStorage
          console.log('🔍 Test direct - localStorage.getItem("playerStats"):', localStorage.getItem('playerStats'));
          
        } catch (error) {
          console.error('❌ Erreur lors de la sauvegarde:', error);
        }
        
        // Mettre à jour l'état local pour afficher visuellement quelle vidéo est le highlight principal
        setYoutubeVideos(prev => prev.map(v => ({
          ...v,
          isMainHighlight: v.id === videoId
        })));
        
        alert(`✅ "${video.title}" set as main highlight!`);
        console.log('🏆 Main highlight set:', video);
        
      } catch (error) {
        console.error('❌ Error setting main highlight:', error);
        alert('❌ Error setting main highlight. Please try again.');
      }
    } else {
      const video = videos.find(v => v.id === videoId);
      if (!video) return;

      try {
        // Récupérer l'ID du joueur actuel
        const players = JSON.parse(localStorage.getItem('players') || '[]');
        const currentPlayer = players.find((p: any) => p.name === 'Philippe Bernier');
        const playerId = currentPlayer?.id || 'default';
        
        // Sauvegarder dans le profil du joueur avec l'ID
        const playerStats = JSON.parse(localStorage.getItem('playerStats') || '{}');
        const updatedPlayerStats = {
          ...playerStats,
          playerId: playerId,
          mainHighlight: video.videoUrl,
          mainHighlightTitle: video.filename,
          mainHighlightType: type
        };
        
        localStorage.setItem('playerStats', JSON.stringify(updatedPlayerStats));
        console.log('💾 Highlight principal sauvegardé pour le joueur:', playerId);
        
        // Mettre à jour l'état local pour afficher visuellement quelle vidéo est le highlight principal
        setVideos(prev => prev.map(v => ({
          ...v,
          isMainHighlight: v.id === videoId
        })));
        
        alert(`✅ "${video.filename}" set as main highlight!`);
        console.log('🏆 Main highlight set:', video);
        
      } catch (error) {
        console.error('❌ Error setting main highlight:', error);
        alert('❌ Error setting main highlight. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
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
              onClick={handleSaveHighlights}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Videos
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
                    {filteredYoutubeVideos().map(video => {
                      console.log('🎬 Rendu de la vidéo:', video);
                      return (
                        <div key={video.id} className={`bg-white rounded-lg shadow overflow-hidden ${video.isMainHighlight ? 'ring-2 ring-yellow-400' : ''}`}>
                          {video.isMainHighlight && (
                            <div className="bg-yellow-400 text-yellow-900 px-3 py-1 text-sm font-medium text-center">
                              ⭐ Main Highlight
                            </div>
                          )}
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
                                <button
                                  onClick={() => handleSetMainHighlight(video.id, 'highlight')}
                                  className={`flex items-center gap-1 ${video.isMainHighlight ? 'text-yellow-600' : 'text-gray-500'} hover:text-yellow-700`}
                                  title={video.isMainHighlight ? 'Current main highlight' : 'Set as main highlight'}
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                  <span>{video.isMainHighlight ? 'Main' : 'Set Main'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                      })}
                  </div>
                )}
                
                {/* Bouton de test pour définir le highlight principal */}
                {youtubeVideos.length > 0 && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-4 text-blue-800">Test - Set Main Highlight</h3>
                    <p className="text-blue-700 mb-4">
                      Si vous ne voyez pas le bouton "Set Main" à côté de votre vidéo, cliquez ici pour définir la première vidéo comme highlight principal :
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          console.log('🔍 Bouton cliqué - Définition du highlight principal');
                          const firstVideo = youtubeVideos[0];
                          console.log('🔍 Première vidéo trouvée:', firstVideo);
                          if (firstVideo) {
                            console.log('🔍 Appel de handleSetMainHighlight avec:', firstVideo.id, 'highlight');
                            handleSetMainHighlight(firstVideo.id, 'highlight');
                          } else {
                            console.log('❌ Aucune vidéo trouvée');
                            alert('❌ Aucune vidéo YouTube disponible');
                          }
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Set "Highlights 2023" as Main Highlight
                      </button>
                      
                      <button
                        onClick={() => {
                          const playerStats = JSON.parse(localStorage.getItem('playerStats') || '{}');
                          const youtubeVideos = JSON.parse(localStorage.getItem('youtubeVideos') || '[]');
                          alert(`Debug Info:\n\nPlayerStats: ${JSON.stringify(playerStats, null, 2)}\n\nYouTube Videos: ${youtubeVideos.length} videos`);
                        }}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Debug - Voir les données
                      </button>
                    </div>
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
                      </div>
                    </div>
                    {selectedVideo?.id === video.id && video.videoUrl && (
                      <video
                        ref={videoRef}
                        src={video.videoUrl}
                        controls
                        className="w-full rounded-lg mb-4"
                      />
                    )}
                    {video.results && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Analysis Results</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-100 rounded-lg p-4 text-center">
                            <span className="block text-2xl font-bold text-blue-600">{video.results.accuracy}%</span>
                            <span className="text-gray-600">Accuracy</span>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-4 text-center">
                            <span className="block text-2xl font-bold text-blue-600">{video.results.speed}</span>
                            <span className="text-gray-600">Speed</span>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-4 text-center">
                            <span className="block text-2xl font-bold text-blue-600">{video.results.technique}</span>
                            <span className="text-gray-600">Technique</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Commentaires */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Comments</h4>
                      <div className="space-y-2 mb-2">
                        {video.comments.map(comment => (
                          <div key={comment.id} className="bg-gray-50 rounded-lg p-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-700">{comment.author}</span>
                              <span className="text-xs text-gray-400">{formatDate(comment.timestamp)}</span>
                            </div>
                            <p className="text-gray-600 mt-1">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="border rounded-lg px-3 py-2 flex-1"
                        />
                        <button
                          onClick={() => handleAddComment(video.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-end mt-4 gap-4">
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
                      <button
                        onClick={() => handleSetMainHighlight(video.id, 'analysis')}
                        className={`flex items-center gap-1 ${video.isMainHighlight ? 'text-yellow-600' : 'text-gray-500'} hover:text-yellow-700`}
                        title={video.isMainHighlight ? 'Current main highlight' : 'Set as main highlight'}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span>{video.isMainHighlight ? 'Main' : 'Set Main'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 