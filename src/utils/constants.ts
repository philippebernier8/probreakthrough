export const positions = [
  'Forward',
  'Midfielder',
  'Defender',
  'Goalkeeper'
] as const;

export const competitionLevels = [
  'Professional',
  'Semi-Professional',
  'Amateur',
  'Youth Academy',
  'College'
] as const;

export type Position = typeof positions[number];
export type CompetitionLevel = typeof competitionLevels[number]; 