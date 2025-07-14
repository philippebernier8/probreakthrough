"use client";

import React from 'react';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 bg-red-600 rounded-lg transform rotate-45"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-2xl">PB</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
        ProBreakthrough
      </span>
    </div>
  );
} 