'use client';

import Image from 'next/image';
import Link from 'next/link';
import VideoUpload from '@/components/VideoUpload';
import EndorsementForm from '@/components/EndorsementForm';
import { useEffect, useState } from 'react';

interface Stats {
  matches: number;
  goals: number;
  assists: number;
  minutesPlayed: number;
  successRate: number;
}

interface PlayerProfile {
  id: string;
  name: string;
  position: string;
  club: string;
  competitionLevel: string;
  pbIndex: number;
  image: string;
  highlightVideo: string;
  videos?: YouTubeVideo[];
  stats: Stats;
  endorsements: {
    total: number;
    fromCoaches: number;
    fromAthletes: number;
    topSkills: string[];
    recent: Array<{
      name: string;
      role: string;
      comment: string;
      date: string;
    }>;
  };
  about?: string;
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
  isMain?: boolean;
}

export default function PlayerProfile({ params }: { params: { id: string } }) {
  const [playerData, setPlayerData] = useState<PlayerProfile | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');

  // Authentification locale (fausse auth)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  useEffect(() => {
    setCurrentUserId(localStorage.getItem('currentUserId'));
  }, [params.id]);
  const handleLoginAsAthlete = () => {
    if (!playerData) return;
    localStorage.setItem('currentUserId', playerData.id);
    setCurrentUserId(playerData.id);
  };
  const handleLogout = () => {
    localStorage.removeItem('currentUserId');
    setCurrentUserId(null);
  };

  useEffect(() => {
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    // Ajoute ici tes mock data si besoin
    const mockPlayers: PlayerProfile[] = [];
    const found = players.find((p: any) => p.id === params.id) || mockPlayers.find((p: any) => p.id === params.id);
    setPlayerData(found || null);
  }, [params.id]);

  // Charger les highlights (YouTube) du localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('youtubeVideos') || '[]');
    setYoutubeVideos(stored);
  }, []);

  if (!playerData) {
    return <div className="text-center py-12 text-gray-500">Profile not found.</div>;
  }

  // Example stats (replace with real data if available)
  const skillsStats = [
    { label: 'Shots on Target', perMatch: '2.1', current: '3', status: 'Good' },
    { label: 'Successful Passes', perMatch: '35', current: '40', status: 'Excellent' },
    { label: 'Key Passes', perMatch: '1.5', current: '2', status: 'Good' },
    { label: 'Duels Won', perMatch: '7', current: '8', status: 'Very Good' },
    { label: 'Aerial Duels Won', perMatch: '2', current: '2', status: 'Solid' },
    { label: 'Successful Dribbles', perMatch: '3', current: '4', status: 'Excellent' },
    { label: 'Successful Tackles', perMatch: '2', current: '2', status: 'Solid' },
  ];

  // Fonction pour ajouter un endorsement
  const handleAddEndorsement = (endorsement: { comment: string; skills: string[]; relationship: string }) => {
    if (!playerData) return;
    const baseEndorsements = playerData.endorsements || {
      total: 0,
      fromCoaches: 0,
      fromAthletes: 0,
      topSkills: [],
      recent: []
    };
    const newEndorsement = {
      name: 'Anonymous',
      role: endorsement.relationship,
      comment: endorsement.comment,
      date: new Date().toISOString()
    };
    const updatedSkills = Array.from(new Set([...(baseEndorsements.topSkills || []), ...endorsement.skills])).slice(0, 8);
    const isCoach = endorsement.relationship === 'Coach';
    const isAthlete = endorsement.relationship === 'Teammate' || endorsement.relationship === 'Team Captain' || endorsement.relationship === 'Opponent';
    const updatedEndorsements = {
      ...baseEndorsements,
      total: (baseEndorsements.total || 0) + 1,
      fromCoaches: (baseEndorsements.fromCoaches || 0) + (isCoach ? 1 : 0),
      fromAthletes: (baseEndorsements.fromAthletes || 0) + (isAthlete ? 1 : 0),
      topSkills: updatedSkills,
      recent: [newEndorsement, ...(baseEndorsements.recent || [])]
    };
    const updatedProfile = { ...playerData, endorsements: updatedEndorsements };
    setPlayerData(updatedProfile);
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const updatedPlayers = players.map((p: any) => p.id === playerData.id ? updatedProfile : p);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
  };

  // Ajout vidéo YouTube
  const extractYoutubeId = (url: string) => {
    const match = url.match(/(?:youtu.be\/|youtube.com\/(?:watch\?v=|embed\/|v\/|shorts\/)?)([\w-]{11})/);
    return match ? match[1] : null;
  };
  const handleAddVideo = () => {
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
      isPublic: true,
      isMain: false
    };
    const updatedVideos = [...(playerData.videos || []), newVideo];
    const updatedProfile = { ...playerData, videos: updatedVideos };
    setPlayerData(updatedProfile);
    // Persistance localStorage
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const updatedPlayers = players.map((p: any) => p.id === playerData.id ? updatedProfile : p);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
    setNewVideoTitle('');
    setNewYoutubeUrl('');
  };
  const toEmbedUrl = (url: string) =>
    url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/');

  // Définir la vidéo principale
  const handleSetMainVideo = (videoId: string) => {
    const updatedVideos = (playerData.videos || []).map(v => ({ ...v, isMain: v.id === videoId }));
    const mainVideo = updatedVideos.find(v => v.isMain);
    const updatedProfile = { ...playerData, videos: updatedVideos, highlightVideo: mainVideo ? toEmbedUrl(mainVideo.youtubeUrl) : '' };
    setPlayerData(updatedProfile);
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const updatedPlayers = players.map((p: any) => p.id === playerData.id ? updatedProfile : p);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
  };
  // Supprimer une vidéo
  const handleDeleteVideo = (videoId: string) => {
    const updatedVideos = (playerData.videos || []).filter(v => v.id !== videoId);
    const mainVideo = updatedVideos.find(v => v.isMain);
    const updatedProfile = { ...playerData, videos: updatedVideos, highlightVideo: mainVideo ? mainVideo.youtubeUrl : '' };
    setPlayerData(updatedProfile);
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const updatedPlayers = players.map((p: any) => p.id === playerData.id ? updatedProfile : p);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-12">
      {/* Header */}
      <div className="bg-white shadow rounded-b-3xl py-10 px-6 md:px-0">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 relative">
          {/* Bouton Edit Profile (seulement si connecté sur ce profil) */}
          {currentUserId === playerData.id && (
            <Link href="/profile" className="absolute top-0 right-0 mt-4 mr-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors font-semibold">
              Edit Profile
            </Link>
          )}
          {/* Bouton Se connecter comme cet athlète (si pas connecté) */}
          {currentUserId !== playerData.id && (
            <button onClick={handleLoginAsAthlete} className="absolute top-0 right-0 mt-4 mr-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors font-semibold">
              Se connecter comme cet athlète
            </button>
          )}
          {/* Bouton Se déconnecter (si connecté) */}
          {currentUserId === playerData.id && (
            <button onClick={handleLogout} className="absolute top-0 left-0 mt-4 ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition-colors font-semibold">
              Se déconnecter
            </button>
          )}
          <div className="relative">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-red-500 shadow-lg bg-gray-100 flex items-center justify-center">
              {playerData.image ? (
                <Image src={playerData.image} alt={playerData.name} width={144} height={144} className="object-cover w-full h-full" />
              ) : (
                <span className="text-6xl text-gray-300">{playerData.name?.charAt(0) ?? '?'}</span>
              )}
            </div>
            <div className="absolute -top-3 -right-3 w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-red-600">{playerData.pbIndex ?? 0}</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-1">{playerData.name ?? 'N/A'}</h1>
            <div className="flex flex-wrap gap-4 items-center mb-2">
              <span className="text-lg text-gray-600 font-medium">{playerData.position ?? 'N/A'}</span>
              <span className="text-gray-500">{playerData.club ?? 'N/A'}</span>
              <span className="text-gray-400">{playerData.competitionLevel ?? ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights + Galerie vidéos */}
      <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Highlights</h2>
          <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
            {playerData.highlightVideo ? (
              <iframe
                src={playerData.highlightVideo}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <span className="text-gray-400">No video</span>
            )}
          </div>
          {/* Formulaire d'ajout de vidéo (seulement si connecté sur ce profil) */}
          {currentUserId === playerData.id && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Video title"
                value={newVideoTitle}
                onChange={e => setNewVideoTitle(e.target.value)}
                className="mb-2 w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="YouTube URL"
                value={newYoutubeUrl}
                onChange={e => setNewYoutubeUrl(e.target.value)}
                className="mb-2 w-full px-3 py-2 border rounded-lg"
              />
              <button
                onClick={handleAddVideo}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Add Video
              </button>
            </div>
          )}
          {/* Galerie vidéos */}
          <div className="flex gap-4 overflow-x-auto">
            {(playerData.videos || []).length > 0 ? playerData.videos!.map((video, idx) => (
              <div key={video.id} className="w-40 min-w-[10rem] bg-gray-50 rounded-lg shadow p-2 flex flex-col items-center">
                <img src={video.thumbnailUrl} alt={video.title} className="rounded-lg w-full h-24 object-cover mb-1" />
                <div className="text-xs text-gray-700 truncate mb-1">{video.title}</div>
                <div className="flex gap-1 mb-1">
                  {currentUserId === playerData.id && (
                    <button
                      onClick={() => handleSetMainVideo(video.id)}
                      className={`px-2 py-1 rounded text-xs font-semibold ${video.isMain ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      {video.isMain ? 'Main' : 'Set as main'}
                    </button>
                  )}
                  {currentUserId === playerData.id && (
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )) : <span className="text-gray-400">No videos</span>}
          </div>
        </div>

        {/* Skills & Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Skills & Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillsStats.map((stat, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4 flex flex-col items-center shadow-sm">
                <div className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
                <div className="flex gap-2 text-sm text-gray-600 mb-1">
                  <span className="font-bold">Per Match:</span> {stat.perMatch}
                </div>
                <div className="flex gap-2 text-sm text-gray-600 mb-1">
                  <span className="font-bold">Current:</span> {stat.current}
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="font-bold">Status:</span>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold">{stat.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Professional Endorsements */}
      <div className="max-w-4xl mx-auto mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-red-600">Professional Endorsements</h2>
          {/* Formulaire d'ajout d'endorsement */}
          <div className="mb-8">
            <EndorsementForm onSubmit={handleAddEndorsement} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-red-500">{playerData.endorsements?.total ?? 0}</div>
              <div className="text-sm text-gray-600 mt-1">Total Endorsements</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-red-500">{playerData.endorsements?.fromCoaches ?? 0}</div>
              <div className="text-sm text-gray-600 mt-1">From Coaches</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-red-500">{playerData.endorsements?.fromAthletes ?? 0}</div>
              <div className="text-sm text-gray-600 mt-1">From Athletes</div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-2 text-gray-800">Top Skills</h3>
            <div className="flex flex-wrap gap-2">
              {playerData.endorsements?.topSkills?.length > 0 ? playerData.endorsements.topSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium shadow"
                >
                  {skill}
                </span>
              )) : <span className="text-gray-400">No skills</span>}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Recent Endorsements</h3>
            <div className="space-y-4">
              {playerData.endorsements?.recent?.length > 0 ? playerData.endorsements.recent.map((endorsement, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{endorsement.name}</p>
                      <p className="text-sm text-gray-600">{endorsement.role}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(endorsement.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{endorsement.comment}</p>
                </div>
              )) : <span className="text-gray-400">No endorsements</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 