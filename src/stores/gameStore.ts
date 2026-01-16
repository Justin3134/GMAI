import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Character, CharacterClass, InventoryItem, Achievement, Location, EducationalChallenge, AgentDecision } from '@/types/game';

interface GameStore {
  // Game state
  gameState: GameState | null;
  isPlaying: boolean;
  currentChallenge: EducationalChallenge | null;
  showChallenge: boolean;
  agentDecisions: AgentDecision[];
  showAgentPanel: boolean;
  
  // Voice state
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  
  // Actions
  createCharacter: (name: string, characterClass: CharacterClass) => void;
  updateHealth: (delta: number) => void;
  updateMagic: (delta: number) => void;
  addXP: (amount: number) => void;
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string) => void;
  addAchievement: (achievement: Achievement) => void;
  updateLocation: (location: Location) => void;
  updateStory: (story: string) => void;
  
  // Challenge actions
  setChallenge: (challenge: EducationalChallenge | null) => void;
  setShowChallenge: (show: boolean) => void;
  
  // Agent panel actions
  addAgentDecision: (decision: AgentDecision) => void;
  clearAgentDecisions: () => void;
  setShowAgentPanel: (show: boolean) => void;
  
  // Voice actions
  setIsListening: (listening: boolean) => void;
  setTranscript: (transcript: string) => void;
  
  // Game flow
  startNewGame: () => void;
  continueGame: () => void;
  resetGame: () => void;
}

const DEFAULT_LOCATIONS: Location[] = [
  { id: 'village', name: 'Sunny Village', emoji: '🏘️', description: 'A peaceful village where your adventure begins.' },
  { id: 'forest', name: 'Whispering Woods', emoji: '🌲', description: 'A magical forest full of talking creatures.' },
  { id: 'castle', name: 'Crystal Castle', emoji: '🏰', description: 'A magnificent castle floating in the clouds.' },
  { id: 'caves', name: 'Echo Caves', emoji: '🦇', description: 'Mysterious caves that echo with ancient wisdom.' },
  { id: 'beach', name: 'Mermaid Bay', emoji: '🏖️', description: 'A beautiful beach where mermaids share riddles.' },
];

const DEFAULT_ITEMS: InventoryItem[] = [
  { id: 'map', name: 'Magic Map', emoji: '🗺️', description: 'Shows the way to hidden treasures', quantity: 1 },
  { id: 'potion', name: 'Health Potion', emoji: '🧪', description: 'Restores 1 heart', quantity: 2 },
];

const createDefaultCharacter = (name: string, characterClass: CharacterClass): Character => ({
  name,
  class: characterClass,
  level: 1,
  health: 5,
  maxHealth: 5,
  magic: 3,
  maxMagic: 3,
  xp: 0,
  xpToNextLevel: 100,
});

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: null,
      isPlaying: false,
      isSpeaking: false,
      currentChallenge: null,
      showChallenge: false,
      agentDecisions: [],
      showAgentPanel: false,
      isListening: false,
      transcript: '',
      
      createCharacter: (name, characterClass) => {
        const character = createDefaultCharacter(name, characterClass);
        const gameState: GameState = {
          gameId: `game-${Date.now()}`,
          character,
          location: DEFAULT_LOCATIONS[0],
          inventory: [...DEFAULT_ITEMS],
          achievements: [],
          currentStory: `Welcome, ${name} the ${characterClass}! Your adventure begins in ${DEFAULT_LOCATIONS[0].name}. The villagers need your help to find the legendary Star Crystal before the Shadow King takes it!`,
          questProgress: 0,
          totalQuests: 5,
        };
        set({ gameState, isPlaying: true });
      },
      
      updateHealth: (delta) => {
        const { gameState } = get();
        if (!gameState) return;
        const newHealth = Math.max(0, Math.min(gameState.character.maxHealth, gameState.character.health + delta));
        set({
          gameState: {
            ...gameState,
            character: { ...gameState.character, health: newHealth },
          },
        });
      },
      
      updateMagic: (delta) => {
        const { gameState } = get();
        if (!gameState) return;
        const newMagic = Math.max(0, Math.min(gameState.character.maxMagic, gameState.character.magic + delta));
        set({
          gameState: {
            ...gameState,
            character: { ...gameState.character, magic: newMagic },
          },
        });
      },
      
      addXP: (amount) => {
        const { gameState } = get();
        if (!gameState) return;
        let newXP = gameState.character.xp + amount;
        let newLevel = gameState.character.level;
        let xpToNext = gameState.character.xpToNextLevel;
        
        while (newXP >= xpToNext) {
          newXP -= xpToNext;
          newLevel++;
          xpToNext = Math.floor(xpToNext * 1.5);
        }
        
        set({
          gameState: {
            ...gameState,
            character: {
              ...gameState.character,
              xp: newXP,
              level: newLevel,
              xpToNextLevel: xpToNext,
              maxHealth: 5 + newLevel - 1,
              maxMagic: 3 + Math.floor((newLevel - 1) / 2),
            },
          },
        });
      },
      
      addItem: (item) => {
        const { gameState } = get();
        if (!gameState) return;
        const existingItem = gameState.inventory.find((i) => i.id === item.id);
        let newInventory;
        if (existingItem) {
          newInventory = gameState.inventory.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        } else {
          newInventory = [...gameState.inventory, item];
        }
        set({ gameState: { ...gameState, inventory: newInventory } });
      },
      
      removeItem: (itemId) => {
        const { gameState } = get();
        if (!gameState) return;
        const newInventory = gameState.inventory
          .map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0);
        set({ gameState: { ...gameState, inventory: newInventory } });
      },
      
      addAchievement: (achievement) => {
        const { gameState } = get();
        if (!gameState) return;
        if (gameState.achievements.some((a) => a.id === achievement.id)) return;
        set({
          gameState: {
            ...gameState,
            achievements: [...gameState.achievements, { ...achievement, earnedAt: new Date() }],
          },
        });
      },
      
      updateLocation: (location) => {
        const { gameState } = get();
        if (!gameState) return;
        set({ gameState: { ...gameState, location } });
      },
      
      updateStory: (story) => {
        const { gameState } = get();
        if (!gameState) return;
        set({ gameState: { ...gameState, currentStory: story } });
      },
      
      setChallenge: (challenge) => set({ currentChallenge: challenge }),
      setShowChallenge: (show) => set({ showChallenge: show }),
      
      addAgentDecision: (decision) => {
        set((state) => ({
          agentDecisions: [...state.agentDecisions.slice(-9), decision],
        }));
      },
      
      clearAgentDecisions: () => set({ agentDecisions: [] }),
      setShowAgentPanel: (show) => set({ showAgentPanel: show }),
      
      setIsListening: (listening) => set({ isListening: listening }),
      setTranscript: (transcript) => set({ transcript }),
      
      startNewGame: () => set({ isPlaying: true }),
      continueGame: () => set({ isPlaying: true }),
      resetGame: () => set({ gameState: null, isPlaying: false, agentDecisions: [] }),
    }),
    {
      name: 'adventure-tales-game',
      partialize: (state) => ({ gameState: state.gameState }),
    }
  )
);
