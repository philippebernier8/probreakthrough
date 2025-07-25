"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface ActivityItem {
  id: string;
  type: 'video' | 'stats' | 'endorsement' | 'new_player' | 'progress';
  playerName: string;
  playerAvatar: string;
  timestamp: string;
  content: string;
  image?: string;
  stats?: {
    goals?: number;
    assists?: number;
    matches?: number;
  };
  videoThumbnail?: string;
  videoTitle?: string;
  endorsementFrom?: string;
  progressValue?: number;
  progressType?: string;
}

export default function ActivityFeed() {
  const { data: session } = useSession();
  const [userProfileImage, setUserProfileImage] = useState('/images/AntoineCoupland.png');
  
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'video',
      playerName: 'Alexandre Dubois',
      playerAvatar: '/images/AntoineCoupland.png',
      timestamp: '2 hours ago',
      content: 'Alexandre Dubois shared a new match video',
      videoThumbnail: '/images/mls-next-2023-jan.jpeg',
      videoTitle: 'Match against FC Montreal - Goals and highlights'
    },
    {
      id: '2',
      type: 'stats',
      playerName: 'Marie-Claude Tremblay',
      playerAvatar: '/images/AntoineCoupland.png',
      timestamp: '3 hours ago',
      content: 'Marie-Claude Tremblay updated her season statistics',
      stats: { goals: 12, assists: 8, matches: 15 }
    },
    {
      id: '3',
      type: 'endorsement',
      playerName: 'Lucas Rodriguez',
      playerAvatar: '/images/AntoineCoupland.png',
      timestamp: '5 hours ago',
      content: 'Lucas Rodriguez received a new endorsement',
      endorsementFrom: 'Coach Johnson'
    },
    {
      id: '4',
      type: 'new_player',
      playerName: 'Emma Wilson',
      playerAvatar: '/images/AntoineCoupland.png',
      timestamp: '1 day ago',
      content: 'Emma Wilson joined ProBreakthrough'
    },
    {
      id: '5',
      type: 'progress',
      playerName: 'David Chen',
      playerAvatar: '/images/AntoineCoupland.png',
      timestamp: '2 days ago',
      content: 'David Chen improved his shooting accuracy',
      progressValue: 15,
      progressType: 'shooting'
    }
  ]);

  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState({
    type: 'stats',
    content: '',
    goals: 0,
    assists: 0,
    matches: 0,
    videoTitle: '',
    endorsementFrom: '',
    progressValue: 0,
    progressType: 'shooting'
  });

  // Récupérer la photo de profil de l'utilisateur depuis localStorage
  useEffect(() => {
    const storedStats = localStorage.getItem('playerStats');
    if (storedStats) {
      try {
        const stats = JSON.parse(storedStats);
        if (stats.image && stats.image.trim() !== '') {
          setUserProfileImage(stats.image);
        }
      } catch (error) {
        console.log('No profile image found, using default');
      }
    }
  }, []);

  const addNewActivity = () => {
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      type: newPost.type as any,
      playerName: session?.user?.name || 'Philippe Bernier',
      playerAvatar: userProfileImage,
      timestamp: 'Just now',
      content: newPost.content || `${session?.user?.name || 'Philippe Bernier'} ${getDefaultContent(newPost.type)}`,
      stats: newPost.type === 'stats' ? { goals: newPost.goals, assists: newPost.assists, matches: newPost.matches } : undefined,
      videoTitle: newPost.type === 'video' ? newPost.videoTitle : undefined,
      endorsementFrom: newPost.type === 'endorsement' ? newPost.endorsementFrom : undefined,
      progressValue: newPost.type === 'progress' ? newPost.progressValue : undefined,
      progressType: newPost.type === 'progress' ? newPost.progressType : undefined
    };

    setActivities([newActivity, ...activities]);
    setShowPostModal(false);
    setNewPost({
      type: 'stats',
      content: '',
      goals: 0,
      assists: 0,
      matches: 0,
      videoTitle: '',
      endorsementFrom: '',
      progressValue: 0,
      progressType: 'shooting'
    });
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'video': return 'shared a new match video';
      case 'stats': return 'updated his season statistics';
      case 'endorsement': return 'received a new endorsement';
      case 'progress': return 'improved his performance';
      default: return 'posted an update';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'video': return 'border-blue-500';
      case 'stats': return 'border-green-500';
      case 'endorsement': return 'border-yellow-500';
      case 'new_player': return 'border-purple-500';
      case 'progress': return 'border-indigo-500';
      default: return 'border-gray-500';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'stats':
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'endorsement':
        return (
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case 'new_player':
        return (
          <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case 'progress':
        return (
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Activity Feed</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Live updates</span>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <button
            onClick={() => setShowPostModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Post Activity
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`p-6 border-l-4 ${getActivityColor(activity.type)} bg-gray-50 rounded-r-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <Image
                    src={activity.playerAvatar}
                    alt={activity.playerName}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{activity.playerName}</h3>
                  <span className="text-sm text-gray-500">{activity.timestamp}</span>
                </div>
                
                <p className="text-gray-600 mb-3">{activity.content}</p>
                
                {/* Activity-specific content */}
                {activity.type === 'video' && activity.videoThumbnail && (
                  <div className="relative">
                    <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={activity.videoThumbnail}
                        alt="Video thumbnail"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mt-2">{activity.videoTitle}</p>
                  </div>
                )}
                
                {activity.type === 'stats' && activity.stats && (
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{activity.stats.goals}</div>
                      <div className="text-sm text-gray-600">Goals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{activity.stats.assists}</div>
                      <div className="text-sm text-gray-600">Assists</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{activity.stats.matches}</div>
                      <div className="text-sm text-gray-600">Matches</div>
                    </div>
                  </div>
                )}
                
                {activity.type === 'endorsement' && activity.endorsementFrom && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">From:</span> {activity.endorsementFrom}
                    </p>
                  </div>
                )}
                
                {activity.type === 'progress' && activity.progressValue && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Improvement:</span> +{activity.progressValue}% in {activity.progressType}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Activity Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-6">Post New Activity</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
                <select
                  value={newPost.type}
                  onChange={(e) => setNewPost({...newPost, type: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="stats">Statistics Update</option>
                  <option value="video">Video Share</option>
                  <option value="endorsement">Endorsement</option>
                  <option value="progress">Progress Update</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message (optional)</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Add a personal message..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {newPost.type === 'stats' && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goals</label>
                    <input
                      type="number"
                      value={newPost.goals}
                      onChange={(e) => setNewPost({...newPost, goals: parseInt(e.target.value) || 0})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assists</label>
                    <input
                      type="number"
                      value={newPost.assists}
                      onChange={(e) => setNewPost({...newPost, assists: parseInt(e.target.value) || 0})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Matches</label>
                    <input
                      type="number"
                      value={newPost.matches}
                      onChange={(e) => setNewPost({...newPost, matches: parseInt(e.target.value) || 0})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {newPost.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
                  <input
                    type="text"
                    value={newPost.videoTitle}
                    onChange={(e) => setNewPost({...newPost, videoTitle: e.target.value})}
                    placeholder="Enter video title..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}

              {newPost.type === 'endorsement' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <input
                    type="text"
                    value={newPost.endorsementFrom}
                    onChange={(e) => setNewPost({...newPost, endorsementFrom: e.target.value})}
                    placeholder="Coach name..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}

              {newPost.type === 'progress' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Improvement (%)</label>
                    <input
                      type="number"
                      value={newPost.progressValue}
                      onChange={(e) => setNewPost({...newPost, progressValue: parseInt(e.target.value) || 0})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skill Type</label>
                    <select
                      value={newPost.progressType}
                      onChange={(e) => setNewPost({...newPost, progressType: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="shooting">Shooting</option>
                      <option value="passing">Passing</option>
                      <option value="dribbling">Dribbling</option>
                      <option value="defense">Defense</option>
                      <option value="fitness">Fitness</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowPostModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addNewActivity}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Post Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 