export const positions = [
  "Gardien",
  "Défenseur",
  "Milieu",
  "Attaquant"
] as const;

export const competitionLevels = [
  "PLSQ",
  "League1 Ontario",
  "OPDL",
  "LSEQ",
  "LSQM",
  "League1 BC",
  "PLSQ Reserve",
  "Ontario League 2",
  "Quebec AAA"
] as const;

export type Position = typeof positions[number];
export type CompetitionLevel = typeof competitionLevels[number]; 