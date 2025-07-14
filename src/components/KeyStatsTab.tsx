import React, { useState, useEffect } from 'react';

interface PlayerInfo {
  name: string;
  age: string;
  club: string;
  height: string;
  weight: string;
  position: string;
}

interface SeasonStats {
  indexP: string;
  matchesPlayed: number;
  goals: number;
  assists: number;
  errorLeadingToGoal: number;
  yellowCards: number;
  redCards: number;
}

interface SkillStats {
  shotsOnTarget: string;
  successfulPasses: string;
  keyPasses: string;
  duelsWon: string;
  aerialDuelsWon: string;
  successfulDribbles: string;
  successfulTackles: string;
}

export default function KeyStatsTab() {
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({
    name: "",
    age: "",
    club: "",
    height: "",
    weight: "",
    position: ""
  });
  const [seasonStats, setSeasonStats] = useState<SeasonStats>({
    indexP: "####",
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    errorLeadingToGoal: 0,
    yellowCards: 0,
    redCards: 0
  });
  const [skillStats, setSkillStats] = useState<SkillStats>({
    shotsOnTarget: "####",
    successfulPasses: "####",
    keyPasses: "####",
    duelsWon: "####",
    aerialDuelsWon: "####",
    successfulDribbles: "####",
    successfulTackles: "####"
  });
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* STATISTICS */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">STATISTICS</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 w-48 text-black">Season Stats</th>
                  <th className="text-center py-2 w-32 text-black">2024</th>
                  <th className="text-center py-2 w-32 text-black">2023</th>
                </tr>
              </thead>
              <tbody className="divide-y text-black">
                <tr>
                  <td className="py-2">P Index</td>
                  <td className="text-center text-red-600 font-semibold">#####</td>
                  <td className="text-center text-red-600 font-semibold">#####</td>
                </tr>
                <tr>
                  <td className="py-2">Matches Played</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                </tr>
                <tr>
                  <td className="py-2">Goals</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                </tr>
                <tr>
                  <td className="py-2">Assists</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                </tr>
                <tr>
                  <td className="py-2">Errors Leading to Goal</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                </tr>
                <tr>
                  <td className="py-2">Yellow Cards</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                </tr>
                <tr>
                  <td className="py-2">Red Cards</td>
                  <td className="text-center">0</td>
                  <td className="text-center">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* SKILLS */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">SKILLS</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 w-48 text-black">Per Match Average</th>
                  <th className="text-center py-2 w-32 text-black">Current</th>
                  <th className="text-center py-2 w-32 text-black">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-black">
                <tr>
                  <td className="py-2">Shots on Target</td>
                  <td className="text-center text-red-600 font-semibold">#####</td>
                  <td className="text-center">#####</td>
                </tr>
                <tr>
                  <td className="py-2">Successful Passes</td>
                  <td className="text-center text-red-600 font-semibold">#####</td>
                  <td className="text-center">#####</td>
                </tr>
                <tr>
                  <td className="py-2">Key Passes</td>
                  <td className="text-center text-red-600 font-semibold">#####</td>
                  <td className="text-center">#####</td>
                </tr>
                <tr>
                  <td className="py-2">Duels Won</td>
                  <td className="text-center text-red-600 font-semibold">#####</td>
                  <td className="text-center">#####</td>
                </tr>
                <tr>
                  <td className="py-2">Aerial Duels Won</td>
                  <td className="text-center text-red-600 font-semibold">#####</td>
                  <td className="text-center">#####</td>
                </tr>
                <tr>
                  <td className="py-2">Successful Dribbles</td>
                  <td className="text-center text-red-600 font-semibold">#####</td>
                  <td className="text-center">#####</td>
                </tr>
                <tr>
                  <td className="py-2">Successful Tackles</td>
                  <td className="text-center text-red-600 font-semibold">#####</td>
                  <td className="text-center">#####</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 