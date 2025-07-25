"use client";

import ActivityFeed from '../../components/ActivityFeed';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleUploadVideo = () => {
    router.push('/my-videos');
  };

  const handleViewStats = () => {
    router.push('/my-stats');
  };

  const handleEditProfile = () => {
    router.push('/profile');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with PB Index */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Current PB Index</p>
              <p className="text-3xl font-bold text-gray-500">0</p>
            </div>
            <div className="h-16 w-16 rounded-full border-4 border-gray-300 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-400">PB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layout in 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main column - Activity Feed (larger) */}
        <div className="lg:col-span-3">
          <ActivityFeed />
        </div>

        {/* Side column - Statistics (smaller) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Season Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Season Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Matches</span>
                <span className="font-bold text-gray-800">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Goals</span>
                <span className="font-bold text-gray-800">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Assists</span>
                <span className="font-bold text-gray-800">0</span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Performance</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Avg Speed</span>
                <span className="font-bold text-gray-800">0 km/h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Distance</span>
                <span className="font-bold text-gray-800">0 km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Play Time</span>
                <span className="font-bold text-gray-800">0h</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Progress</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Level</span>
                <span className="font-bold text-gray-800">Beginner</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">XP</span>
                <span className="font-bold text-gray-800">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Next Level</span>
                <span className="font-bold text-gray-800">100 XP</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={handleUploadVideo}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Upload Video
              </button>
              <button 
                onClick={handleViewStats}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                View Stats
              </button>
              <button 
                onClick={handleEditProfile}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 