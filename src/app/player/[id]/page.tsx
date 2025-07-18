'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Player {
  id: string;
  name: string;
  image: string;
  pbIndex: number;
  position: string;
  school: string;
  club?: string;
  competitionLevel?: string;
  height?: string;
  weight?: string;
  gpa?: string;
  bio?: string;
  experience?: string;
  achievements?: string[];
  socialMedia?: {
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
  academics?: {
    school: string;
    program: string;
    year: string;
  };
  references?: Array<{
    name: string;
    role: string;
    contact: string;
    type: 'coach' | 'athlete' | 'other';
    relationship: string;
    verified: boolean;
    date: string;
    endorsements: string[];
    endorsementCount: number;
    endorsedBy: Array<{
      name: string;
      role: string;
      date: string;
    }>;
  }>;
  videos?: string[];
  mainHighlight?: string;
}

export default function PlayerPage({ params }: { params: { id: string } }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showEndorsementForm, setShowEndorsementForm] = useState(false);
  const [newEndorsement, setNewEndorsement] = useState({
    name: '',
    role: '',
    message: '',
    skills: [] as string[]
  });

  useEffect(() => {
    // Charger les données du joueur
    const loadPlayerData = () => {
      try {
        const players = JSON.parse(localStorage.getItem('players') || '[]');
        const foundPlayer = players.find((p: Player) => p.id === params.id);
        
        if (foundPlayer) {
          setPlayer(foundPlayer);
        } else {
          setError('Player not found');
        }
      } catch (err) {
        setError('Error loading player data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Charger l'utilisateur actuel
    const currentUserData = localStorage.getItem('currentUser');
    if (currentUserData) {
      setCurrentUser(JSON.parse(currentUserData));
    }

    loadPlayerData();
  }, [params.id]);

  const getIndexColor = (index: number) => {
    if (index >= 90) return '#10b981'; // vert émeraude
    if (index >= 80) return '#3b82f6'; // bleu
    if (index >= 70) return '#f59e0b'; // orange
    return '#ef4444'; // rouge
  };

  const getIndexLabel = (index: number) => {
    if (index >= 90) return 'Elite';
    if (index >= 80) return 'Professional';
    if (index >= 70) return 'Competitive';
    return 'Developing';
  };

  const handleLoginAsPlayer = () => {
    if (player) {
      localStorage.setItem('currentUser', JSON.stringify(player.name));
      setCurrentUser(player.name);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const handleAddEndorsement = () => {
    if (!player || !newEndorsement.name || !newEndorsement.role) return;

    const endorsement = {
      name: newEndorsement.name,
      role: newEndorsement.role,
      contact: '',
      type: 'other' as const,
      relationship: 'Professional Contact',
      verified: false,
      date: new Date().toISOString().split('T')[0],
      endorsements: newEndorsement.skills,
      endorsementCount: 1,
      endorsedBy: [{
        name: newEndorsement.name,
        role: newEndorsement.role,
        date: new Date().toISOString().split('T')[0]
      }]
    };

    const updatedPlayer = {
      ...player,
      references: [...(player.references || []), endorsement]
    };

    // Mettre à jour le localStorage
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const updatedPlayers = players.map((p: Player) => 
      p.id === player.id ? updatedPlayer : p
    );
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
    localStorage.setItem('playerStats', JSON.stringify(updatedPlayer));

    setPlayer(updatedPlayer);
    setNewEndorsement({ name: '', role: '', message: '', skills: [] });
    setShowEndorsementForm(false);
  };

  const availableSkills = [
    'Technical Skills', 'Leadership', 'Work Ethic', 'Team Player', 
    'Communication', 'Game Intelligence', 'Physical Strength', 
    'Speed', 'Tactical Awareness', 'Creativity', 'Decision Making',
    'Mental Toughness', 'Adaptability', 'Coachability'
  ];

  const toggleSkill = (skill: string) => {
    setNewEndorsement(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading player profile...</p>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">The player profile you're looking for doesn't exist.</p>
          <Link href="/players" className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
            Browse All Players
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser === player.name;
  const totalEndorsements = (player.references || []).reduce((total, ref) => total + ref.endorsementCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/players" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Players
          </Link>
          
          <div className="flex items-center space-x-4">
            {!currentUser ? (
              <button
                onClick={handleLoginAsPlayer}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Se connecter comme cet athlète
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Se déconnecter
              </button>
            )}
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                {player.image ? (
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <Image
                      src={player.image}
                      alt={player.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-xl">
                    <span className="text-6xl text-gray-400 font-bold">
                      {player.name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* PB Index */}
                <div 
                  className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-2"
                  style={{ borderColor: getIndexColor(player.pbIndex) }}
                >
                  <span className="text-xl font-bold" style={{ color: getIndexColor(player.pbIndex) }}>
                    {player.pbIndex}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{player.name}</h1>
                  <p className="text-xl text-gray-600 mb-1">{player.position}</p>
                  <p className="text-gray-500 mb-4">{player.club || 'No club specified'}</p>
                  
                  {/* PB Index Badge */}
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4"
                       style={{ 
                         backgroundColor: `${getIndexColor(player.pbIndex)}20`,
                         color: getIndexColor(player.pbIndex)
                       }}>
                    {getIndexLabel(player.pbIndex)} Level • PB Index {player.pbIndex}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-400">0</div>
                    <div className="text-sm text-gray-500">Endorsements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-400">0</div>
                    <div className="text-sm text-gray-500">References</div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {player.bio && (
                <p className="text-gray-700 text-lg leading-relaxed mt-4">
                  {player.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Highlight Section - Featured */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative aspect-video">
                {player.mainHighlight ? (
                  <video
                    className="w-full h-full object-cover"
                    controls
                    poster="/video-placeholder.jpg"
                  >
                    <source src={player.mainHighlight} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Main Highlight</h3>
                      <p className="text-gray-300 mb-6">Best moments and key plays from this athlete</p>
                      <button className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                        </svg>
                        Upload Highlight Video
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Main Highlight</h3>
                <p className="text-gray-300">Best moments and key plays from this athlete</p>
              </div>
            </div>

            {/* Additional Videos Gallery */}
            {player.videos && player.videos.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">More Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {player.videos.map((video, index) => (
                    <div key={index} className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                      <video
                        className="w-full h-full object-cover"
                        controls
                      >
                        <source src={video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {player.experience && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
                <p className="text-gray-700 leading-relaxed">{player.experience}</p>
              </div>
            )}

            {/* Achievements Section */}
            {player.achievements && player.achievements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements & Awards</h2>
                <div className="space-y-3">
                  {player.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Endorsements Section - Clean Start */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Endorsements</h2>
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Endorsements Yet</h3>
                <p className="text-gray-500 mb-6">Be the first to endorse this athlete</p>
                <button className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Endorse This Player
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Height:</span>
                  <span className="font-medium">{player.height ? `${player.height} cm` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{player.weight ? `${player.weight} kg` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GPA:</span>
                  <span className="font-medium">{player.gpa || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">{player.competitionLevel || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            {player.academics && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 text-sm">School:</span>
                    <p className="font-medium">{player.academics.school}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Program:</span>
                    <p className="font-medium">{player.academics.program}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Year:</span>
                    <p className="font-medium">{player.academics.year}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Social Media */}
            {player.socialMedia && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
                <div className="space-y-3">
                  {player.socialMedia.instagram && (
                    <a href={`https://instagram.com/${player.socialMedia.instagram.replace('@', '')}`} 
                       target="_blank" rel="noopener noreferrer"
                       className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      {player.socialMedia.instagram}
                    </a>
                  )}
                  {player.socialMedia.twitter && (
                    <a href={`https://twitter.com/${player.socialMedia.twitter.replace('@', '')}`} 
                       target="_blank" rel="noopener noreferrer"
                       className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      {player.socialMedia.twitter}
                    </a>
                  )}
                  {player.socialMedia.linkedin && (
                    <a href={`https://linkedin.com/in/${player.socialMedia.linkedin}`} 
                       target="_blank" rel="noopener noreferrer"
                       className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      {player.socialMedia.linkedin}
                    </a>
                  )}
                  {player.socialMedia.youtube && (
                    <a href={`https://youtube.com/@${player.socialMedia.youtube.replace('@', '')}`} 
                       target="_blank" rel="noopener noreferrer"
                       className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      {player.socialMedia.youtube}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Add Endorsement */}
            {!isOwnProfile && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Endorsement</h3>
                {!showEndorsementForm ? (
                  <button
                    onClick={() => setShowEndorsementForm(true)}
                    className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Endorse This Player
                  </button>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={newEndorsement.name}
                      onChange={(e) => setNewEndorsement(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Your role (Coach, Player, etc.)"
                      value={newEndorsement.role}
                      onChange={(e) => setNewEndorsement(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Your message (optional)"
                      value={newEndorsement.message}
                      onChange={(e) => setNewEndorsement(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skills to Endorse</label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableSkills.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                              newEndorsement.skills.includes(skill)
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleAddEndorsement}
                        className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors"
                      >
                        Submit Endorsement
                      </button>
                      <button
                        onClick={() => setShowEndorsementForm(false)}
                        className="flex-1 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Edit Profile Button */}
            {isOwnProfile && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <Link
                  href="/profile"
                  className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors text-center block"
                >
                  Edit Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 