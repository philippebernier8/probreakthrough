import { Position, CompetitionLevel } from './constants';

export interface PlayerProfile {
  id: string;
  name: string;
  position: Position;
  club: string;
  competitionLevel: CompetitionLevel;
  photoUrl?: string;
  height?: number;
}

export interface MatchStats {
  id: string;
  playerId: string;
  matchNumber: number;
  opponent: string;
  date: string;
  stats: {
    pIndex: number;
    minutes: number;
    goals: number;
    assists: number;
    shots: {
      total: number;
      onTarget: number;
    };
    passes: {
      total: number;
      successful: number;
      keyPasses: number;
    };
    duels: {
      ground: {
        total: number;
        won: number;
      };
      aerial: {
        total: number;
        won: number;
      };
    };
    tackles: {
      total: number;
      successful: number;
    };
  };
} 