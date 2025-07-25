'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MyVideosTab from '@/components/MyVideosTab';
import KeyStatsTab from '@/components/KeyStatsTab';

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
  category: string;
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

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showAcademicModal, setShowAcademicModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [editingAcademic, setEditingAcademic] = useState({ school: '', program: '', year: '' });
  
  const defaultStats: PlayerStats = {
    name: "Philippe Bernier",
    position: "Forward",
    club: "Ottawa South United",
    category: "U17 M",
    competitionLevel: "PLSJQ",
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

  useEffect(() => {
    const savedStats = localStorage.getItem('playerStats');
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        setPlayerStats(parsedStats);
        console.log('Loaded saved stats:', parsedStats);
      } catch (error) {
        console.error('Error parsing saved stats:', error);
      }
    } else {
      console.log('No saved stats found, using defaults');
    }
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    localStorage.setItem('playerStats', JSON.stringify(playerStats));
    
    // Update players list in localStorage
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const existingPlayerIndex = players.findIndex((p: any) => p.id === playerStats.id);
    
    if (existingPlayerIndex !== -1) {
      players[existingPlayerIndex] = {
        ...players[existingPlayerIndex],
        name: playerStats.name,
        position: playerStats.position,
        club: playerStats.club,
        competitionLevel: playerStats.competitionLevel,
        pbIndex: playerStats.pbIndex,
        height: playerStats.height,
        weight: playerStats.weight,
        gpa: playerStats.gpa,
        bio: playerStats.bio,
        experience: playerStats.experience,
        achievements: playerStats.achievements,
        academics: playerStats.academics,
        references: playerStats.references
      };
    }
    
    localStorage.setItem('players', JSON.stringify(players));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const addAchievement = () => {
    setShowAchievementModal(true);
  };

  const saveNewAchievement = () => {
    if (newAchievement.trim()) {
      setPlayerStats({
        ...playerStats,
        achievements: [...playerStats.achievements, newAchievement.trim()]
      });
      setNewAchievement('');
      setShowAchievementModal(false);
    }
  };

  const removeAchievement = (index: number) => {
    setPlayerStats({
      ...playerStats,
      achievements: playerStats.achievements.filter((_, i) => i !== index)
    });
  };

  const editAchievement = (index: number) => {
    setEditingAchievement(playerStats.achievements[index]);
    setShowPerformanceModal(true);
  };

  const saveAchievementEdit = () => {
    if (editingAchievement.trim()) {
      const index = playerStats.achievements.findIndex(a => a === editingAchievement);
      if (index !== -1) {
        const updatedAchievements = [...playerStats.achievements];
        updatedAchievements[index] = editingAchievement.trim();
        setPlayerStats({
          ...playerStats,
          achievements: updatedAchievements
        });
      }
    }
    setShowPerformanceModal(false);
    setEditingAchievement('');
  };

  const addAcademic = () => {
    if (editingAcademic.school.trim() && editingAcademic.program.trim() && editingAcademic.year.trim()) {
      setPlayerStats({
        ...playerStats,
        academics: {
          school: editingAcademic.school.trim(),
          program: editingAcademic.program.trim(),
          year: editingAcademic.year.trim()
        }
      });
      setShowAcademicModal(false);
      setEditingAcademic({ school: '', program: '', year: '' });
    }
  };

  // Fonctions pour les boutons
  const handleViewStats = () => {
    window.location.href = '/my-stats';
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setActiveTab('basic');
  };

  const handleUploadPhoto = () => {
    // Simuler l'upload de photo
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPlayerStats({
            ...playerStats,
            image: e.target?.result as string
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSaveChanges = () => {
    // Sauvegarder les changements
    setSaveSuccess(true);
    setIsEditing(false);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('playerStats', JSON.stringify(playerStats));
    
    // Update players list in localStorage
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const existingPlayerIndex = players.findIndex((p: any) => p.id === playerStats.id);
    
    if (existingPlayerIndex !== -1) {
      players[existingPlayerIndex] = {
        ...players[existingPlayerIndex],
        name: playerStats.name,
        position: playerStats.position,
        club: playerStats.club,
        competitionLevel: playerStats.competitionLevel,
        pbIndex: playerStats.pbIndex,
        height: playerStats.height,
        weight: playerStats.weight,
        gpa: playerStats.gpa,
        bio: playerStats.bio,
        experience: playerStats.experience,
        achievements: playerStats.achievements,
        academics: playerStats.academics,
        references: playerStats.references
      };
    }
    
    localStorage.setItem('players', JSON.stringify(players));
    
    // Force re-render by updating state
    setPlayerStats({...playerStats});
    
    console.log('Changes saved successfully:', playerStats);
    
    // Masquer le message de succès après 3 secondes
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const tabs = [
    { id: 'basic', name: 'Profile Summary', icon: '👤' },
    { id: 'videos', name: 'Video', icon: '🎥' },
    { id: 'athletics', name: 'Athletics', icon: '⚽' },
    { id: 'academics', name: 'Academics', icon: '📚' },
    { id: 'info', name: 'My Information', icon: '📋' },
    { id: 'stats', name: 'Key Stats', icon: '📊' }
  ];

  const totalEndorsements = playerStats.references.reduce((total, ref) => total + ref.endorsementCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Professional Profile Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Professional Profile</h1>
              <p className="text-red-100">Recommended by {totalEndorsements} professionals</p>
            </div>
            <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold">156</div>
                <div className="text-sm text-red-100">Coaches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">89</div>
                <div className="text-sm text-red-100">Athletes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{playerStats.pbIndex}</div>
                <div className="text-sm text-red-100">PB Index</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Photo and Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              {/* Profile Photo */}
              <div className="text-center mb-6">
                {playerStats.image ? (
                  <img 
                    src={playerStats.image} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg mx-auto mb-4 relative">
                    {playerStats.name.charAt(0)}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {playerStats.pbIndex}
                    </div>
                  </div>
                )}
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{playerStats.name}</h1>
                <p className="text-gray-600 mb-2">{playerStats.position} • {playerStats.club}</p>
                <p className="text-gray-500 text-sm mb-4">{playerStats.category} • {playerStats.competitionLevel}</p>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={handleViewStats}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>View My Stats</span>
                  </button>
                  <button 
                    onClick={handleEditProfile}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="border-b border-gray-100">
                <nav className="flex space-x-1 px-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-6 font-medium text-sm transition-all duration-200 rounded-t-xl ${
                        activeTab === tab.id
                          ? 'bg-red-50 text-red-600 border-b-2 border-red-600'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'basic' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold text-gray-900">Profile Summary</h2>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">Last updated: Today</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Personal Information Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Basic Info Card */}
                      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
                          <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                              <input
                                type="text"
                                value={playerStats.name}
                                onChange={(e) => setPlayerStats({...playerStats, name: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                                placeholder="Enter your full name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                              <select
                                value={playerStats.position}
                                onChange={(e) => setPlayerStats({...playerStats, position: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                              >
                                <option value="Forward">Forward</option>
                                <option value="Midfielder">Midfielder</option>
                                <option value="Defender">Defender</option>
                                <option value="Goalkeeper">Goalkeeper</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                              <input
                                type="text"
                                value={playerStats.height}
                                onChange={(e) => setPlayerStats({...playerStats, height: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                                placeholder="180"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                              <input
                                type="text"
                                value={playerStats.weight}
                                onChange={(e) => setPlayerStats({...playerStats, weight: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                                placeholder="75"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Club Information Card */}
                      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-gray-900">Club Information</h3>
                          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Club</label>
                            <input
                              type="text"
                              value={playerStats.club}
                              onChange={(e) => setPlayerStats({...playerStats, club: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                              placeholder="e.g., Ottawa South United"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                              <input
                                type="text"
                                value={playerStats.category}
                                onChange={(e) => setPlayerStats({...playerStats, category: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                                placeholder="e.g., U17 M"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Competition Level</label>
                              <input
                                type="text"
                                value={playerStats.competitionLevel}
                                onChange={(e) => setPlayerStats({...playerStats, competitionLevel: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                                placeholder="e.g., PLSJQ"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bio Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">About Me</h3>
                        <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                        <textarea
                          value={playerStats.bio}
                          onChange={(e) => setPlayerStats({...playerStats, bio: e.target.value})}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 resize-none"
                          placeholder="Tell us about your soccer journey, achievements, and goals..."
                        />
                        <p className="text-sm text-gray-500 mt-2">This will be visible to coaches and scouts</p>
                      </div>
                    </div>

                    {/* Save Changes Button */}
                    {isEditing && (
                      <div className="flex justify-end space-x-4 pt-6">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveChanges}
                          className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Save Changes</span>
                        </button>
                      </div>
                    )}

                    {/* Success Message */}
                    {saveSuccess && (
                      <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg z-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-green-800 font-medium">Changes saved successfully!</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'athletics' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Athletic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Goals</label>
                        <input
                          type="number"
                          placeholder="15"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assists</label>
                        <input
                          type="number"
                          placeholder="8"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Performance Timeline */}
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Performance Timeline</h3>
                        <button
                          onClick={() => setShowPerformanceModal(true)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                          <span>+</span>
                          <span>Add Season</span>
                        </button>
                      </div>
                      
                      {/* Timeline */}
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        
                        {/* 2024 Season */}
                        <div className="relative flex items-start space-x-6 mb-8">
                          <div className="relative z-10 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            2024
                          </div>
                          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold text-gray-900">Varsity Team</h4>
                              <div className="flex space-x-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Starter
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  #22
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">15</div>
                                <div className="text-sm text-gray-600">Goals</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">8</div>
                                <div className="text-sm text-gray-600">Assists</div>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowPerformanceModal(true)}
                              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit Performance</span>
                            </button>
                          </div>
                        </div>

                        {/* 2023 Season */}
                        <div className="relative flex items-start space-x-6 mb-8">
                          <div className="relative z-10 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            2023
                          </div>
                          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold text-gray-900">Junior Varsity</h4>
                              <div className="flex space-x-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Starter
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  #22
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">12</div>
                                <div className="text-sm text-gray-600">Goals</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">6</div>
                                <div className="text-sm text-gray-600">Assists</div>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowPerformanceModal(true)}
                              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit Performance</span>
                            </button>
                          </div>
                        </div>

                        {/* Add New Season */}
                        <div className="relative flex items-start space-x-6">
                          <div className="relative z-10 w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <div className="flex-1 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                            <div className="text-gray-500">
                              <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <h4 className="text-lg font-semibold mb-2">Add New Season</h4>
                              <p className="text-sm">Track your next performance milestone</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Save Changes Button for Athletics */}
                    {isEditing && (
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveChanges}
                          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'academics' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                        <input
                          type="text"
                          value={playerStats.academics.school}
                          onChange={(e) => setPlayerStats({
                            ...playerStats, 
                            academics: {...playerStats.academics, school: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                        <input
                          type="text"
                          value={playerStats.academics.program}
                          onChange={(e) => setPlayerStats({
                            ...playerStats, 
                            academics: {...playerStats.academics, program: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <input
                          type="text"
                          value={playerStats.academics.year}
                          onChange={(e) => setPlayerStats({
                            ...playerStats, 
                            academics: {...playerStats.academics, year: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                        <input
                          type="text"
                          value={playerStats.gpa}
                          onChange={(e) => setPlayerStats({...playerStats, gpa: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Academic Achievements Section */}
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Academic Achievements</h3>
                      <div className="space-y-4">
                        {playerStats.achievements.filter(achievement => 
                          achievement.toLowerCase().includes('academic') || 
                          achievement.toLowerCase().includes('excellence') ||
                          achievement.toLowerCase().includes('award')
                        ).map((achievement, index) => (
                          <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center justify-between">
                              <p className="text-gray-800 font-medium">{achievement}</p>
                              <button 
                                onClick={() => editAchievement(index)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        ))}
                        <button 
                          onClick={addAchievement}
                          className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors"
                        >
                          + Add Academic Achievement
                        </button>
                      </div>
                    </div>

                    {/* Save Changes Button */}
                    {isEditing && (
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveChanges}
                          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="text"
                          value={playerStats.phone}
                          onChange={(e) => setPlayerStats({...playerStats, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                          type="text"
                          value={playerStats.address}
                          onChange={(e) => setPlayerStats({...playerStats, address: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Social Media</label>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Instagram"
                            value={playerStats.socialMedia.instagram}
                            onChange={(e) => setPlayerStats({
                              ...playerStats, 
                              socialMedia: {...playerStats.socialMedia, instagram: e.target.value}
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="Twitter"
                            value={playerStats.socialMedia.twitter}
                            onChange={(e) => setPlayerStats({
                              ...playerStats, 
                              socialMedia: {...playerStats.socialMedia, twitter: e.target.value}
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Changes Button */}
                    {isEditing && (
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveChanges}
                          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'videos' && <MyVideosTab />}
                {activeTab === 'stats' && <KeyStatsTab />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Edit Modal */}
      {showPerformanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Achievement</h3>
              <textarea
                value={editingAchievement}
                onChange={(e) => setEditingAchievement(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
                placeholder="Enter achievement description..."
              />
              <div className="flex space-x-3">
                <button
                  onClick={saveAchievementEdit}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowPerformanceModal(false);
                    setEditingAchievement('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Academic Edit Modal */}
      {showAcademicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Academic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
                  <input
                    type="text"
                    value={editingAcademic.school}
                    onChange={(e) => setEditingAcademic({...editingAcademic, school: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                  <input
                    type="text"
                    value={editingAcademic.program}
                    onChange={(e) => setEditingAcademic({...editingAcademic, program: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="text"
                    value={editingAcademic.year}
                    onChange={(e) => setEditingAcademic({...editingAcademic, year: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={addAcademic}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowAcademicModal(false);
                    setEditingAcademic({ school: '', program: '', year: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Achievement Modal */}
      {showAchievementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add Academic Achievement</h3>
              <textarea
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
                placeholder="Enter your academic achievement (e.g., Academic Excellence Award 2023, Dean's List 2022)..."
              />
              <div className="flex space-x-3">
                <button
                  onClick={saveNewAchievement}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Add Achievement
                </button>
                <button
                  onClick={() => {
                    setShowAchievementModal(false);
                    setNewAchievement('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 