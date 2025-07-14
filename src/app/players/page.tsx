"use client";

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { positions, competitionLevels } from '@/app/utils/constants';

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
  achievements?: string[];
  socialMedia?: {
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
}

export default function PlayersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [pbIndexFilter, setPbIndexFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Données de test (à remplacer par un appel API)
  const defaultPlayers = [
    {
      id: "1",
      name: "Felix Robert",
      image: "",
      pbIndex: 87,
      position: "Goalkeeper",
      school: "École Secondaire Cardinal-Roy",
      club: "Montreal Impact Academy",
      competitionLevel: "Professional",
      height: "185",
      weight: "78",
      gpa: "3.9",
      bio: "Elite goalkeeper with exceptional reflexes and leadership skills.",
      achievements: ["Best Goalkeeper Award 2023", "Team Captain 2022"],
      socialMedia: {
        instagram: "@felix_robert",
        twitter: "@felixrobert_gk",
        linkedin: "felix-robert",
        youtube: "@felixrobert"
      }
    },
    {
      id: "2",
      name: "Thomas Dubois",
      image: "",
      pbIndex: 92,
      position: "Forward",
      school: "Académie de Soccer",
      club: "CF Montreal U23",
      competitionLevel: "Professional",
      height: "178",
      weight: "72",
      gpa: "3.7",
      bio: "Dynamic forward with clinical finishing and creative playmaking.",
      achievements: ["Top Scorer 2023", "MVP Regional Championship"],
      socialMedia: {
        instagram: "@thomas_dubois",
        twitter: "@tdubois_fwd",
        linkedin: "thomas-dubois",
        youtube: "@thomasdubois"
      }
    },
    {
      id: "3",
      name: "Lucas Martin",
      image: "",
      pbIndex: 78,
      position: "Midfielder",
      school: "Collège Saint-Charles",
      club: "Ottawa TFC Academy",
      competitionLevel: "Elite",
      height: "175",
      weight: "70",
      gpa: "3.8",
      bio: "Versatile midfielder with excellent vision and passing range.",
      achievements: ["Best Playmaker 2023", "Academic Excellence"],
      socialMedia: {
        instagram: "@lucas_martin",
        twitter: "@lmartin_mid",
        linkedin: "lucas-martin",
        youtube: "@lucasmartin"
      }
    },
    {
      id: "4",
      name: "Emma Tremblay",
      image: "",
      pbIndex: 85,
      position: "Defender",
      school: "École Secondaire des Sports",
      club: "Quebec Elite Academy",
      competitionLevel: "Elite",
      height: "170",
      weight: "65",
      gpa: "4.0",
      bio: "Solid defender with tactical awareness and strong aerial ability.",
      achievements: ["Best Defender 2023", "Leadership Award"],
      socialMedia: {
        instagram: "@emma_tremblay",
        twitter: "@etremblay_def",
        linkedin: "emma-tremblay",
        youtube: "@emmatremblay"
      }
    },
    {
      id: "5",
      name: "William Roy",
      image: "",
      pbIndex: 83,
      position: "Forward",
      school: "Académie Sportive",
      club: "Sherbrooke FC",
      competitionLevel: "Competitive",
      height: "180",
      weight: "75",
      gpa: "3.6",
      bio: "Powerful forward with physical presence and goal-scoring instinct.",
      achievements: ["Golden Boot 2023", "Most Improved Player"],
      socialMedia: {
        instagram: "@william_roy",
        twitter: "@wroy_fwd",
        linkedin: "william-roy",
        youtube: "@williamroy"
      }
    },
    {
      id: "6",
      name: "Sofia Garcia",
      image: "",
      pbIndex: 89,
      position: "Midfielder",
      school: "Institut du Sport",
      club: "Laval Elite",
      competitionLevel: "Professional",
      height: "165",
      weight: "58",
      gpa: "3.9",
      bio: "Creative midfielder with exceptional technical skills and game intelligence.",
      achievements: ["Player of the Year 2023", "Technical Excellence Award"],
      socialMedia: {
        instagram: "@sofia_garcia",
        twitter: "@sgarcia_mid",
        linkedin: "sofia-garcia",
        youtube: "@sofiagarcia"
      }
    },
    {
      id: "7",
      name: "Noah Lambert",
      image: "",
      pbIndex: 76,
      position: "Defender",
      school: "École des Champions",
      club: "Gatineau FC",
      competitionLevel: "Competitive",
      height: "182",
      weight: "80",
      gpa: "3.5",
      bio: "Reliable defender with strong tackling and organizational skills.",
      achievements: ["Defensive Player of the Year", "Team Spirit Award"],
      socialMedia: {
        instagram: "@noah_lambert",
        twitter: "@nlambert_def",
        linkedin: "noah-lambert",
        youtube: "@noahlambert"
      }
    },
    {
      id: "8",
      name: "Olivia Chen",
      image: "",
      pbIndex: 94,
      position: "Forward",
      school: "Académie Elite",
      club: "Toronto FC Academy",
      competitionLevel: "Professional",
      height: "168",
      weight: "62",
      gpa: "4.0",
      bio: "Explosive forward with lightning speed and clinical finishing.",
      achievements: ["National Champion 2023", "Speed Demon Award"],
      socialMedia: {
        instagram: "@olivia_chen",
        twitter: "@ochen_fwd",
        linkedin: "olivia-chen",
        youtube: "@oliviachen"
      }
    }
  ];

  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('players') || '[]');
    // Fusionner les joueurs mock et ceux du localStorage, sans doublons (par nom), priorité au localStorage
    const merged = [...stored];
    defaultPlayers.forEach((mock) => {
      if (!merged.some((p: Player) => p.name === mock.name)) {
        merged.push(mock);
      }
    });
    setPlayers(merged);
  }, []);

  // Filtrer et trier les joueurs
  const filteredAndSortedPlayers = useMemo(() => {
    let filtered = players.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (player.school && player.school.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (player.club && player.club.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (player.bio && player.bio.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPosition = !positionFilter || player.position === positionFilter;
      const matchesLevel = !levelFilter || player.competitionLevel === levelFilter;
      const matchesPbIndex = !pbIndexFilter || 
        (pbIndexFilter === '90+' && player.pbIndex >= 90) ||
        (pbIndexFilter === '80-89' && player.pbIndex >= 80 && player.pbIndex < 90) ||
        (pbIndexFilter === '70-79' && player.pbIndex >= 70 && player.pbIndex < 80) ||
        (pbIndexFilter === '<70' && player.pbIndex < 70);
      
      return matchesSearch && matchesPosition && matchesLevel && matchesPbIndex;
    });

    // Trier les joueurs
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'pbIndex':
          aValue = a.pbIndex;
          bValue = b.pbIndex;
          break;
        case 'position':
          aValue = a.position.toLowerCase();
          bValue = b.position.toLowerCase();
          break;
        case 'school':
          aValue = a.school.toLowerCase();
          bValue = b.school.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [players, searchQuery, positionFilter, levelFilter, pbIndexFilter, sortBy, sortOrder]);

  // Calculer la couleur du cercle en fonction de l'indice PB
  const getIndexColor = (index: number) => {
    if (index >= 90) return '#10b981'; // vert émeraude
    if (index >= 80) return '#3b82f6'; // bleu
    if (index >= 70) return '#f59e0b'; // orange
    return '#ef4444'; // rouge
  };

  // Calculer le gradient de progression
  const calculateProgress = (index: number) => {
    return (index / 100) * 360;
  };

  const getIndexLabel = (index: number) => {
    if (index >= 90) return 'Elite';
    if (index >= 80) return 'Professional';
    if (index >= 70) return 'Competitive';
    return 'Developing';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Discover Talent
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find and connect with exceptional athletes from across the country
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, school, club..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Position Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none transition-colors"
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
              >
                <option value="">All Positions</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none transition-colors"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option value="">All Levels</option>
                {competitionLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* PB Index Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PB Index</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none transition-colors"
                value={pbIndexFilter}
                onChange={(e) => setPbIndexFilter(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="90+">90+ (Elite)</option>
                <option value="80-89">80-89 (Professional)</option>
                <option value="70-79">70-79 (Competitive)</option>
                <option value="<70">&lt;70 (Developing)</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none transition-colors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="pbIndex">PB Index</option>
                <option value="position">Position</option>
                <option value="school">School</option>
              </select>
            </div>
          </div>

          {/* Sort Order */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className={`w-4 h-4 mr-2 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedPlayers.length} of {players.length} players
          </p>
        </div>

        {/* Players Grid */}
        {filteredAndSortedPlayers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No players found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedPlayers.map((player) => (
              <Link href={`/player/${player.id}`} key={player.id} passHref legacyBehavior>
                <a className="block group">
                  <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100">
                    <div className="relative w-full aspect-square mb-6">
                      {/* Cercle de progression */}
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(
                            ${getIndexColor(player.pbIndex)} ${calculateProgress(player.pbIndex)}deg,
                            #e5e7eb 0deg
                          )`,
                          animation: 'rotate 2s ease-out forwards'
                        }}
                      />
                      {/* Cercle blanc intérieur */}
                      <div className="absolute inset-1 bg-white rounded-full">
                        {/* Photo */}
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          {player.image ? (
                            <Image
                              src={player.image}
                              alt={player.name}
                              fill
                              style={{ objectFit: 'cover' }}
                              priority
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-5xl text-gray-400 font-bold">
                                {player.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Indice PB */}
                      <div 
                        className="absolute -right-2 -top-2 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border-2"
                        style={{ borderColor: getIndexColor(player.pbIndex) }}
                      >
                        <span className="text-lg font-bold" style={{ color: getIndexColor(player.pbIndex) }}>
                          {player.pbIndex}
                        </span>
                      </div>
                    </div>

                    {/* Player Info */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        {player.name}
                      </h3>
                      <p className="text-gray-600 mb-1">{player.position}</p>
                      <p className="text-sm text-gray-500 mb-3">{player.school}</p>
                      
                      {/* PB Index Label */}
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4"
                           style={{ 
                             backgroundColor: `${getIndexColor(player.pbIndex)}20`,
                             color: getIndexColor(player.pbIndex)
                           }}>
                        {getIndexLabel(player.pbIndex)}
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Club:</span>
                          <p className="font-medium text-gray-900">{player.club || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Level:</span>
                          <p className="font-medium text-gray-900">{player.competitionLevel || 'N/A'}</p>
                        </div>
                      </div>

                      {/* View Profile Button */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-red-600 font-medium group-hover:text-red-700 transition-colors">
                          View Profile →
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 