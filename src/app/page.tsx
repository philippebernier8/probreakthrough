'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

/*
interface FeedPost {
  id: string;
  author: string;
  content: string;
  date: string;
  imageUrl?: string;
}
*/

export default function Home() {
  const [count, setCount] = useState({ athletes: 0, coaches: 0, success: 0 });
  const [isVisible, setIsVisible] = useState(false);
  // const [posts, setPosts] = useState<FeedPost[]>([]);
  // const [newContent, setNewContent] = useState('');
  // const [newAuthor, setNewAuthor] = useState('');

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCount(prev => ({
        athletes: prev.athletes < 1500 ? prev.athletes + 15 : 1500,
        coaches: prev.coaches < 300 ? prev.coaches + 3 : 300,
        success: prev.success < 85 ? prev.success + 1 : 85
      }));
    }, 50);

    // const stored = JSON.parse(localStorage.getItem('feedPosts') || '[]');
    // setPosts(stored);

    return () => clearInterval(interval);
  }, []);

  /*
  const handlePost = () => {
    if (!newContent.trim() || !newAuthor.trim()) return;
    const post: FeedPost = {
      id: Date.now().toString(),
      author: newAuthor,
      content: newContent,
      date: new Date().toISOString(),
    };
    const updated = [post, ...posts];
    setPosts(updated);
    localStorage.setItem('feedPosts', JSON.stringify(updated));
    setNewContent('');
  };
  */

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/mls-next-2023-jan.jpeg"
            alt="Soccer players in action"
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block">Unlock Your</span>
                <span className="block bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">Athletic Potential</span>
              </h1>
              <p className="mt-6 text-lg text-gray-300 sm:mt-8 sm:text-xl sm:max-w-2xl sm:mx-auto md:mt-10 md:text-2xl">
                Advanced analytics and professional insights to elevate your game to the next level
              </p>
            </div>
            
            <div className={`mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12 gap-4 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Link
                href="/profile"
                className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 md:py-5 md:text-lg md:px-10 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Start Your Journey
              </Link>
              <Link
                href="/players"
                className="w-full flex items-center justify-center px-8 py-4 border-2 border-red-600 text-base font-medium rounded-xl text-red-600 bg-white hover:bg-red-50 md:py-5 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105 shadow-xl"
              >
                Find Talent
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center group">
              <div className="text-5xl font-bold text-red-600 mb-3 group-hover:scale-110 transition-transform duration-300">{count.athletes}+</div>
              <div className="text-gray-600 text-lg">Active Athletes</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold text-red-600 mb-3 group-hover:scale-110 transition-transform duration-300">{count.coaches}+</div>
              <div className="text-gray-600 text-lg">Professional Coaches</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold text-red-600 mb-3 group-hover:scale-110 transition-transform duration-300">{count.success}%</div>
              <div className="text-gray-600 text-lg">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Breakthrough Features
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to showcase your talent and connect with opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Athlete Profile */}
            <div className="bg-white p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-100 group">
              <div className="w-16 h-16 mb-6 text-red-600 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Profile</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Create your dynamic profile with AI-powered insights and real-time performance metrics.
              </p>
            </div>

            {/* Video Analysis */}
            <div className="bg-white p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-100 group">
              <div className="w-16 h-16 mb-6 text-red-600 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro Analysis</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Get detailed video analysis and personalized feedback from professional coaches.
              </p>
            </div>

            {/* Performance Analytics */}
            <div className="bg-white p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-100 group">
              <div className="w-16 h-16 mb-6 text-red-600 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Elite Stats</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Track your progress with professional-grade analytics and performance metrics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to unlock your athletic potential
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create Your Profile</h3>
              <p className="text-gray-600">
                Build your professional athlete profile with highlights, stats, and achievements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get Discovered</h3>
              <p className="text-gray-600">
                Coaches and scouts can find and evaluate your talent through our platform.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Connect & Grow</h3>
              <p className="text-gray-600">
                Build relationships with coaches and take your career to the next level.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-0 lg:flex-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to take your game to the next level?</span>
              <span className="block text-red-200">Join ProBreakthrough today.</span>
            </h2>
            <p className="mt-4 text-lg text-red-100">
              Join thousands of athletes who have already discovered their potential.
            </p>
          </div>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-xl shadow-lg">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-red-600 bg-white hover:bg-red-50 transform hover:scale-105 transition-all duration-200"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
