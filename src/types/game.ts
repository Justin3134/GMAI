export type CharacterClass = 'knight' | 'wizard' | 'rogue';

export interface Character {
  name: string;
  class: CharacterClass;
  level: number;
  health: number;
  maxHealth: number;
  magic: number;
  maxMagic: number;
  xp: number;
  xpToNextLevel: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  quantity: number;
}

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earnedAt?: Date;
}

export interface Location {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface GameState {
  gameId: string;
  character: Character;
  location: Location;
  inventory: InventoryItem[];
  achievements: Achievement[];
  currentStory: string;
  questProgress: number;
  totalQuests: number;
}

export interface EducationalChallenge {
  id: string;
  subject: 'math' | 'vocabulary' | 'reading' | 'science';
  difficulty: number;
  question: string;
  options: string[];
  correctAnswer: number;
  hint?: string;
  context?: string;
}

export interface AgentDecision {
  agentName: string;
  agentEmoji: string;
  action: string;
  status: 'pending' | 'success' | 'warning' | 'error';
  timestamp: Date;
  details?: string;
  duration?: number;
}

export interface ChildProgress {
  childId: string;
  childName: string;
  totalAdventures: number;
  totalMinutes: number;
  skills: {
    math: { progress: number; details: string[] };
    vocabulary: { progress: number; wordsLearned: number };
    reading: { progress: number };
    science: { progress: number };
  };
  achievements: Achievement[];
  safetyBlocks: number;
}

export interface StudentProgress {
  name: string;
  adventures: number;
  mathScore: number;
  readingScore: number;
  lastPlayed: string;
}
