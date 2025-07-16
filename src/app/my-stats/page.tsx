"use client";

// import { useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';

/*
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
*/

/*
interface CareerStats {
  year: string;
  club: string;
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

interface LastMatchStats {
  date: string;
  match: number;
  opponent: string;
  indexP: number;
  minutes: number;
  goals: number;
  assists: number;
  shots: number;
  shotsOnTarget: number;
  shotsAccuracy: number;
  passes: number;
  successfulPasses: number;
  passAccuracy: number;
  keyPasses: number;
  keyPassesSuccess: number;
  keyPassAccuracy: number;
  duels: number;
  duelsWon: number;
  duelSuccess: number;
  aerialDuels: number;
  aerialDuelsWon: number;
  aerialSuccess: number;
  dribbles: number;
  dribblesSuccess: number;
  dribbleAccuracy: number;
  tackles: number;
  tacklesSuccess: number;
  tackleAccuracy: number;
}
*/


export default function StatsPage() {
  /*
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
*/

  return (
    <ProtectedRoute>
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

          {/* CAREER */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">CAREER</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 w-48 text-black">Year/Club MP</th>
                    <th className="text-center py-2 w-24 text-black">Start</th>
                    <th className="text-center py-2 w-24 text-black">Goals</th>
                    <th className="text-center py-2 w-24 text-black">YC</th>
                    <th className="text-center py-2 w-24 text-black">RC</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-black">
                  <tr>
                    <td className="py-2">2024</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                  </tr>
                  <tr>
                    <td className="py-2">2023</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                  </tr>
                  <tr>
                    <td className="py-2">2022</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* MOYENNE SUR 90 MINUTES */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-red-600 mb-4">MOYENNE SUR 90 MINUTES</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-black">
                <thead>
                  <tr className="border-b text-center">
                    <th className="py-1 px-1">Index-P</th>
                    <th className="py-1 px-1">Min</th>
                    <th className="py-1 px-1">Buts</th>
                    <th className="py-1 px-1">Assists</th>
                    <th className="py-1 px-1">Tirs</th>
                    <th className="py-1 px-1">Cadrés</th>
                    <th className="py-1 px-1">%</th>
                    <th className="py-1 px-1">Passes</th>
                    <th className="py-1 px-1">Réussies</th>
                    <th className="py-1 px-1">%</th>
                    <th className="py-1 px-1">P.clés</th>
                    <th className="py-1 px-1">Réussies</th>
                    <th className="py-1 px-1">%</th>
                    <th className="py-1 px-1">Duels</th>
                    <th className="py-1 px-1">Gagnés</th>
                    <th className="py-1 px-1">%</th>
                    <th className="py-1 px-1">Aériens</th>
                    <th className="py-1 px-1">Gagnés</th>
                    <th className="py-1 px-1">%</th>
                    <th className="py-1 px-1">Dribbles</th>
                    <th className="py-1 px-1">Réussis</th>
                    <th className="py-1 px-1">%</th>
                    <th className="py-1 px-1">Tackles</th>
                    <th className="py-1 px-1">Réussis</th>
                    <th className="py-1 px-1">%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center hover:bg-gray-50">
                    <td className="py-1 px-1 text-red-600">#####</td>
                    <td className="py-1 px-1">90</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                    <td className="py-1 px-1">#####</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 20 DERNIERS MATCHS */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-red-600 mb-4">20 DERNIERS MATCHS</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-black">
                <thead>
                  <tr className="border-b text-center">
                    <th className="py-1 px-1">Match</th>
                    <th className="py-1 px-1">Adversaire</th>
                    <th className="py-1 px-1">Index-P</th>
                    <th className="py-1 px-1">Min</th>
                    <th className="py-1 px-1">Buts</th>
                    <th className="py-1 px-1">Assists</th>
                    <th className="py-1 px-1">Tirs</th>
                    <th className="py-1 px-1">Cadrés</th>
                    <th className="py-1 px-1">%</th>
                    <th className="py-1 px-1">Passes</th>
                    <th className="py-1 px-1">Réussies</th>
                    <th className="py-1 px-1">%</th>
                    <th className="py-1 px-1">P.clés</th>
                    <th className="py-1 px-1">Réussies</th>
                    <th className="py-1 px-1">%</th>
                    <th className="py-1 px-1">Duels</th>
                    <th className="py-1 px-1">Gagnés</th>
                    <th className="py-1 px-1">%</th>
                    <th className="py-1 px-1">Aériens</th>
                    <th className="py-1 px-1">Gagnés</th>
                    <th className="py-1 px-1">%</th>
                    <th className="py-1 px-1">Dribbles</th>
                    <th className="py-1 px-1">Réussis</th>
                    <th className="py-1 px-1">%</th>
                    <th className="py-1 px-1">Tackles</th>
                    <th className="py-1 px-1">Réussis</th>
                    <th className="py-1 px-1">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[...Array(20)].map((_, index) => (
                    <tr key={index} className="text-center hover:bg-gray-50">
                      <td className="py-1 px-1">{index + 1}</td>
                      <td className="py-1 px-1">-</td>
                      <td className="py-1 px-1 text-red-600">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                      <td className="py-1 px-1">0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 