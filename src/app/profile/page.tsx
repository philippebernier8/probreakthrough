"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { positions, competitionLevels } from '../../utils/constants';
import Link from 'next/link';
import MyVideosTab from '@/components/MyVideosTab';
import KeyStatsTab from '@/components/KeyStatsTab';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Reference {
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
}

interface PlayerStats {
  id?: string;
  name: string;
  position: string;
  club: string;
  competitionLevel: string;
  image: string;
  pbIndex: number;
  height: string;
  weight: string;
  gpa: string;
  phone: string;
  address: string;
  bio: string;
  experience: string;
  achievements: string[];
  socialMedia: {
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
  previousClubs: string[];
  academics: {
    school: string;
    program: string;
    year: string;
  };
  references: Reference[];
  videos: string[];
  mainHighlight: string;
}

/*
function DateClientOnly({ date }: { date: string }) {
  const [formatted, setFormatted] = useState('');
  useEffect(() => {
    setFormatted(new Date(date).toLocaleDateString());
  }, [date]);
  return <span>{formatted}</span>;
}
*/

export default function ProfilePage() {
  const defaultStats: PlayerStats = {
    name: "Philippe Bernier",
    position: "Forward",
    club: "Montreal Impact Academy",
    competitionLevel: "Professional",
    image: "",
    pbIndex: 85,
    height: "180",
    weight: "75",
    gpa: "3.8",
    phone: "",
    address: "",
    bio: "Passionate soccer player with 8+ years of experience. Known for technical skills, leadership, and game intelligence. Committed to continuous improvement and team success.",
    experience: "Professional soccer player with experience in youth academies and competitive leagues. Strong background in technical training and tactical understanding.",
    achievements: [
      "Team Captain - Montreal Impact Academy (2023)",
      "Top Scorer - Regional Championship (2022)",
      "Academic Excellence Award (2021)",
      "Leadership Award - Youth League (2020)"
    ],
    socialMedia: {
      instagram: "@philippe_bernier",
      twitter: "@pbernier_soccer",
      linkedin: "philippe-bernier-soccer",
      youtube: "@philippebernier"
    },
    previousClubs: ["CF Montreal U23", "Ottawa TFC Academy"],
    academics: {
      school: "University of Montreal",
      program: "Sports Science",
      year: "2024"
    },
    references: [
      {
        name: "John Smith",
        role: "Head Coach",
        contact: "john.smith@email.com",
        type: "coach",
        relationship: "Current Coach",
        verified: true,
        date: "2024-01-15",
        endorsements: ["Technical Skills", "Leadership", "Work Ethic"],
        endorsementCount: 156,
        endorsedBy: [
          { name: "Alex Thompson", role: "Professional Coach", date: "2024-03-01" },
          { name: "Sarah Wilson", role: "Technical Director", date: "2024-02-28" },
          { name: "Mike Johnson", role: "Scout", date: "2024-02-25" },
          { name: "David Brown", role: "Assistant Coach", date: "2024-02-20" }
        ]
      },
      {
        name: "Marie Dubois",
        role: "Team Captain",
        contact: "marie.dubois@email.com",
        type: "athlete",
        relationship: "Former Teammate",
        verified: true,
        date: "2024-02-01",
        endorsements: ["Team Player", "Communication", "Game Intelligence"],
        endorsementCount: 89,
        endorsedBy: [
          { name: "Lucas Martin", role: "Professional Player", date: "2024-03-02" },
          { name: "Emma White", role: "Team Captain", date: "2024-02-28" },
          { name: "Thomas Lee", role: "Midfielder", date: "2024-02-25" }
        ]
      }
    ],
    videos: [],
    mainHighlight: ""
  };

  const [playerStats, setPlayerStats] = useState<PlayerStats>(defaultStats);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('playerStats');
      if (saved) {
        const parsedStats = JSON.parse(saved);
        setPlayerStats({
          ...defaultStats,
          ...parsedStats,
          previousClubs: Array.isArray(parsedStats.previousClubs) ? parsedStats.previousClubs : defaultStats.previousClubs,
          references: Array.isArray(parsedStats.references) ? parsedStats.references : defaultStats.references,
          achievements: Array.isArray(parsedStats.achievements) ? parsedStats.achievements : defaultStats.achievements,
          videos: Array.isArray(parsedStats.videos) ? parsedStats.videos : defaultStats.videos,
          socialMedia: {
            ...defaultStats.socialMedia,
            ...parsedStats.socialMedia
          },
          academics: {
            school: parsedStats.academics?.school || defaultStats.academics.school,
            program: parsedStats.academics?.program || defaultStats.academics.program,
            year: parsedStats.academics?.year || defaultStats.academics.year
          }
        });
      }
    } catch (error) {
      console.error('Error loading player stats:', error);
    }
    setIsLoaded(true);
  }, []);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress);
      }
    };
    reader.onload = () => {
      setPlayerStats(prev => ({
        ...prev,
        image: reader.result as string
      }));
      setUploadProgress(100);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newStats = {
      ...playerStats,
      [name]: value
    };
    setPlayerStats(newStats);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('playerStats', JSON.stringify(newStats));
    }
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    const newStats = {
      ...playerStats,
      socialMedia: {
        ...playerStats.socialMedia,
        [platform]: value
      }
    };
    setPlayerStats(newStats);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('playerStats', JSON.stringify(newStats));
    }
  };

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...playerStats.achievements];
    newAchievements[index] = value;
    const newStats = {
      ...playerStats,
      achievements: newAchievements
    };
    setPlayerStats(newStats);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('playerStats', JSON.stringify(newStats));
    }
  };

  const addAchievement = () => {
    const newStats = {
      ...playerStats,
      achievements: [...playerStats.achievements, ""]
    };
    setPlayerStats(newStats);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('playerStats', JSON.stringify(newStats));
    }
  };

  const removeAchievement = (index: number) => {
    const newAchievements = playerStats.achievements.filter((_, i) => i !== index);
    const newStats = {
      ...playerStats,
      achievements: newAchievements
    };
    setPlayerStats(newStats);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('playerStats', JSON.stringify(newStats));
    }
  };

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('playerStats', JSON.stringify(playerStats));
      // Ajout ou mise à jour dans la liste globale des joueurs
      const players = JSON.parse(localStorage.getItem('players') || '[]');
      // On identifie le joueur par le nom pour le MVP (à remplacer par un id unique plus tard)
      const updatedPlayers = players.filter((p: any) => p.name !== playerStats.name);
      updatedPlayers.push({
        ...playerStats,
        pbIndex: playerStats.pbIndex ? Number(playerStats.pbIndex) : 0,
        id: playerStats.id || Date.now().toString(),
        image: playerStats.image || '',
      });
      localStorage.setItem('players', JSON.stringify(updatedPlayers));
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleAddReference = () => {
    setPlayerStats({
      ...playerStats,
      references: [...playerStats.references, {
        name: "",
        role: "",
        contact: "",
        type: 'coach',
        relationship: "",
        verified: false,
        date: new Date().toISOString().split('T')[0],
        endorsements: [],
        endorsementCount: 0,
        endorsedBy: []
      }]
    });
  };

  const tabs = [
    { id: 'basic', label: 'Profile Summary' },
    { id: 'video', label: 'Video' },
    { id: 'athletics', label: 'Athletics' },
    { id: 'academics', label: 'Academics' },
    { id: 'myinfo', label: 'My Information' },
    { id: 'keystats', label: 'Key Stats' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header with Total Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Professional Profile</h1>
              <p className="text-gray-600 mt-2">
                Recommended by {playerStats.references.reduce((total, ref) => total + ref.endorsementCount, 0)} professionals
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-500">{playerStats.references.filter(ref => ref.type === 'coach').reduce((total, ref) => total + ref.endorsementCount, 0)}</div>
                <div className="text-sm text-gray-600">Coaches</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-500">{playerStats.references.filter(ref => ref.type === 'athlete').reduce((total, ref) => total + ref.endorsementCount, 0)}</div>
                <div className="text-sm text-gray-600">Athletes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-8">
              <div className="relative flex flex-col items-center w-full">
                <div className="relative w-40 h-40 mx-auto mb-6">
                  {playerStats.image ? (
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <Image
                        src={playerStats.image}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-xl">
                      <span className="text-5xl text-gray-400 font-bold">
                        {!isLoaded ? "P" : playerStats.name ? playerStats.name[0] : "P"}
                      </span>
                    </div>
                  )}
                  {/* PB Index */}
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-red-600">{playerStats.pbIndex || 0}</span>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-4 mb-2 text-center">
                  {!isLoaded ? "Your name" : (playerStats.name || "Your name")}
                </h2>
                <p className="text-lg text-gray-600 mb-1">
                  {!isLoaded ? "Position" : (playerStats.position || "Position")}
                </p>
                <p className="text-gray-500 mb-4">
                  {!isLoaded ? "Club" : (playerStats.club || "Club")}
                </p>
                
                {/* Stats Link Button */}
                <Link 
                  href="/my-stats" 
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  View My Stats
                </Link>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'video' ? (
                  <MyVideosTab />
                ) : (
                  <>
                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                      <div className="space-y-6">
                        {/* Photo Upload */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Profile Photo</label>
                          <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                              isDragging ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center">
                              <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm text-gray-500">Drag and drop or click to upload</p>
                            </div>
                          </div>
                        </div>

                        {/* Basic Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                              type="text"
                              name="name"
                              value={playerStats.name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                              placeholder="Enter your name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                            <select
                              name="position"
                              value={playerStats.position}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none transition-colors"
                            >
                              <option value="">Select a position</option>
                              {positions.map((pos) => (
                                <option key={pos} value={pos}>{pos}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Club</label>
                            <input
                              type="text"
                              name="club"
                              value={playerStats.club}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                              placeholder="Enter club name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Competition Level</label>
                            <select
                              name="competitionLevel"
                              value={playerStats.competitionLevel}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none transition-colors"
                            >
                              <option value="">Select a level</option>
                              {competitionLevels.map((level) => (
                                <option key={level} value={level}>{level}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                            <input
                              type="text"
                              name="height"
                              value={playerStats.height}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                              placeholder="180"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                            <input
                              type="text"
                              name="weight"
                              value={playerStats.weight}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                              placeholder="75"
                            />
                          </div>
                        </div>

                        {/* Bio */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                          <textarea
                            name="bio"
                            value={playerStats.bio}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
                            placeholder="Tell us about yourself, your playing style, and what makes you unique..."
                          />
                        </div>
                      </div>
                    )}
                    {/* Details Tab */}
                    {activeTab === 'details' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input
                              type="tel"
                              name="phone"
                              value={playerStats.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                            <input
                              type="text"
                              name="gpa"
                              value={playerStats.gpa}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                              placeholder="3.8"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <input
                            type="text"
                            name="address"
                            value={playerStats.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                            placeholder="Enter your address"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                          <textarea
                            name="experience"
                            value={playerStats.experience}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
                            placeholder="Describe your playing experience, training background, and career highlights..."
                          />
                        </div>

                        {/* Academics */}
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                              <input
                                type="text"
                                name="academics.school"
                                value={playerStats.academics.school}
                                onChange={(e) => {
                                  const newStats = {
                                    ...playerStats,
                                    academics: {
                                      ...playerStats.academics,
                                      school: e.target.value
                                    }
                                  };
                                  setPlayerStats(newStats);
                                  if (typeof window !== 'undefined') {
                                    localStorage.setItem('playerStats', JSON.stringify(newStats));
                                  }
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                placeholder="University name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                              <input
                                type="text"
                                name="academics.program"
                                value={playerStats.academics.program}
                                onChange={(e) => {
                                  const newStats = {
                                    ...playerStats,
                                    academics: {
                                      ...playerStats.academics,
                                      program: e.target.value
                                    }
                                  };
                                  setPlayerStats(newStats);
                                  if (typeof window !== 'undefined') {
                                    localStorage.setItem('playerStats', JSON.stringify(newStats));
                                  }
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                placeholder="Program of study"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                              <input
                                type="text"
                                name="academics.year"
                                value={playerStats.academics.year}
                                onChange={(e) => {
                                  const newStats = {
                                    ...playerStats,
                                    academics: {
                                      ...playerStats.academics,
                                      year: e.target.value
                                    }
                                  };
                                  setPlayerStats(newStats);
                                  if (typeof window !== 'undefined') {
                                    localStorage.setItem('playerStats', JSON.stringify(newStats));
                                  }
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                placeholder="2024"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Social & Media Tab */}
                    {activeTab === 'social' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                              <input
                                type="text"
                                value={playerStats.socialMedia.instagram}
                                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                placeholder="username"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                              <input
                                type="text"
                                value={playerStats.socialMedia.twitter}
                                onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                placeholder="username"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                            <input
                              type="text"
                              value={playerStats.socialMedia.linkedin}
                              onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                              placeholder="profile-url"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                              <input
                                type="text"
                                value={playerStats.socialMedia.youtube}
                                onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                placeholder="channel-name"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Achievements Tab */}
                    {activeTab === 'achievements' && (
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-gray-700">Achievements & Awards</label>
                            <button
                              onClick={addAchievement}
                              className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Add Achievement
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            {playerStats.achievements.map((achievement, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <input
                                  type="text"
                                  value={achievement}
                                  onChange={(e) => handleAchievementChange(index, e.target.value)}
                                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                  placeholder="Enter achievement or award"
                                />
                                <button
                                  onClick={() => removeAchievement(index)}
                                  className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* References Tab */}
                    {activeTab === 'references' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700">References & Endorsements</label>
                          <button
                            onClick={handleAddReference}
                            className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Reference
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {playerStats.references.map((reference, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                  <input
                                    type="text"
                                    value={reference.name}
                                    onChange={(e) => {
                                      const newReferences = [...playerStats.references];
                                      newReferences[index].name = e.target.value;
                                      setPlayerStats({
                                        ...playerStats,
                                        references: newReferences
                                      });
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                    placeholder="Reference name"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                  <input
                                    type="text"
                                    value={reference.role}
                                    onChange={(e) => {
                                      const newReferences = [...playerStats.references];
                                      newReferences[index].role = e.target.value;
                                      setPlayerStats({
                                        ...playerStats,
                                        references: newReferences
                                      });
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                    placeholder="Coach, Player, etc."
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Key Stats Tab */}
                    {activeTab === 'keystats' && (
                      <KeyStatsTab />
                    )}
                    {/* Save Button */}
                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => setIsPreview(true)}
                          className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors"
                        >
                          Preview Profile
                        </button>
                        <button 
                          onClick={handleSave}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
                        >
                          Save Changes
                        </button>
                      </div>
                      {saveSuccess && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                          ✅ Profile saved successfully!
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
} 