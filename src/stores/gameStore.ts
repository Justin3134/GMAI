import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Character, CharacterClass, InventoryItem, Achievement, Location, EducationalChallenge, AgentDecision } from '@/types/game';
import { api } from '@/lib/api';

interface GameStore {
  // Game state
  gameState: GameState | null;
  isPlaying: boolean;
  currentChallenge: EducationalChallenge | null;
  showChallenge: boolean;
  agentDecisions: AgentDecision[];
  showAgentPanel: boolean;
  
  // Backend state
  backendGameId: string | null;
  sceneImageUrl: string | null;
  isLoadingAction: boolean;
  currentAudioUrl: string | null;
  
  // Answer tracking
  answersCorrect: number;
  answersWrong: number;
  totalQuestions: number;
  
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
  
  // Backend actions
  setBackendGameId: (id: string) => void;
  setSceneImageUrl: (url: string | null) => void;
  setIsLoadingAction: (loading: boolean) => void;
  setCurrentAudioUrl: (url: string | null) => void;
  sendActionToBackend: (action: string) => Promise<void>;
  playAudio: (url: string) => void;
  recordAnswer: (correct: boolean) => void;
  
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
      backendGameId: null,
      sceneImageUrl: null,
      isLoadingAction: false,
      currentAudioUrl: null,
      answersCorrect: 0,
      answersWrong: 0,
      totalQuestions: 0,
      isListening: false,
      transcript: '',
      
      createCharacter: async (name, characterClass) => {
        const character = createDefaultCharacter(name, characterClass);
        const gameState: GameState = {
          gameId: `game-${Date.now()}`,
          character,
          location: DEFAULT_LOCATIONS[0],
          inventory: [...DEFAULT_ITEMS],
          achievements: [],
          currentStory: 'Starting your adventure...',
          questProgress: 0,
          totalQuests: 5,
        };
        set({ gameState, isPlaying: true });

        // Call backend to start game with AI-generated story
        console.log('🎮 Starting game... Calling backend at http://localhost:3001/api/game/start');
        try {
          const response = await api.startGame({
            kidName: name,
            characterClass,
            kidId: name.toLowerCase().replace(/\s+/g, '_'),
          });

          console.log('✅ Backend response:', response);

          if (!response.gameId) {
            throw new Error('Backend did not return gameId');
          }

          const updatedGameState = {
            ...gameState,
            currentStory: response.welcomeNarration
          };

          set({
            backendGameId: response.gameId,
            gameState: updatedGameState,
            sceneImageUrl: response.imageUrl || null,
          });

          // Verify it was saved
          setTimeout(() => {
            const currentState = get();
            console.log('🎮 Game started - State verified:', {
              backendGameId: currentState.backendGameId,
              hasGameState: !!currentState.gameState,
              verified: currentState.backendGameId === response.gameId
            });
            
            if (!currentState.backendGameId) {
              console.error('❌ CRITICAL: backendGameId was not saved!');
            }
          }, 100);
          
          // Play welcome audio
          if (response.audioUrl) {
            console.log('🔊 Playing welcome audio...');
            set({ currentAudioUrl: response.audioUrl });
            get().playAudio(response.audioUrl);
          } else {
            console.warn('⚠️ No audio URL received from backend');
          }

          // Display welcome image
          if (response.imageUrl) {
            console.log('🖼️ Welcome image loaded');
          }
        } catch (error) {
          console.error('❌ FAILED TO START GAME:', error);
          console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
          });
          alert('⚠️ Could not connect to backend server. Make sure it is running on http://localhost:3001\n\nError: ' + error.message);
          // Fallback to local story
          set({
            gameState: {
              ...gameState,
              currentStory: `Welcome, ${name} the ${characterClass}! Your adventure begins in ${DEFAULT_LOCATIONS[0].name}. The villagers need your help to find the legendary Star Crystal before the Shadow King takes it!`,
            },
          });
        }
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
      
      setBackendGameId: (id) => set({ backendGameId: id }),
      setSceneImageUrl: (url) => set({ sceneImageUrl: url }),
      setIsLoadingAction: (loading) => set({ isLoadingAction: loading }),
      setCurrentAudioUrl: (url) => set({ currentAudioUrl: url }),
      
      playAudio: (url: string) => {
        if (!url) {
          console.warn('⚠️ playAudio called with empty URL');
          return;
        }
        console.log('🔊 Attempting to play audio, length:', url.substring(0, 50) + '...');
        const audio = new Audio(url);
        audio.play()
          .then(() => console.log('✅ Audio playing successfully'))
          .catch((error) => {
            console.error('❌ Failed to play audio:', error.name, error.message);
            console.log('💡 Tip: Click anywhere on the page first to enable audio');
          });
      },
      
      sendActionToBackend: async (action: string) => {
        const { gameState, backendGameId } = get();
        
        console.log('🎤 Attempting to send action...', {
          action,
          hasGameState: !!gameState,
          hasBackendGameId: !!backendGameId,
          backendGameId: backendGameId
        });
        
        if (!gameState || !backendGameId) {
          console.error('❌ Cannot send action: missing gameState or backendGameId', {
            hasGameState: !!gameState,
            hasBackendGameId: !!backendGameId
          });
          alert('⚠️ Game not properly initialized. Please refresh and start a new game.');
          return;
        }

        console.log('✅ Sending action to backend:', action);
        set({ isLoadingAction: true });
        try {
          const response = await api.sendAction({
            gameId: backendGameId,
            kidAction: action,
            gameState,
            kidId: gameState.character.name.toLowerCase().replace(/\s+/g, '_'),
          });

          console.log('📖 Received response:', { 
            hasNarration: !!response.narration, 
            hasImage: !!response.imageUrl,
            hasAudio: !!response.audioUrl 
          });

          // Update story text from Anthropic
          get().updateStory(response.narration);

          // Update scene image from Freepik
          if (response.imageUrl) {
            set({ sceneImageUrl: response.imageUrl });
          }

          // Play audio from ElevenLabs
          if (response.audioUrl) {
            set({ currentAudioUrl: response.audioUrl });
            get().playAudio(response.audioUrl);
          }

          // Show challenge if generated
          if (response.challenge) {
            get().setChallenge(response.challenge);
            get().setShowChallenge(true);
          }

          // Log agent decisions to demo panel
          if (response.agentDecisions) {
            const agentMap: Record<string, { emoji: string; name: string }> = {
              story: { emoji: '📖', name: 'Story Agent' },
              safety: { emoji: '🛡️', name: 'Safety Agent' },
              rules: { emoji: '⚖️', name: 'Rules Agent' },
            };

            Object.entries(response.agentDecisions).forEach(([agent, data]: [string, any]) => {
              const info = agentMap[agent] || { emoji: '🤖', name: agent };
              get().addAgentDecision({
                agentName: info.name,
                agentEmoji: info.emoji,
                action: data.text ? `Generated: ${data.text.substring(0, 40)}...` : 'Processing',
                status: 'success',
                duration: data.time || 0,
                timestamp: new Date(),
              });
            });
          }
        } catch (error) {
          console.error('Failed to send action:', error);
          get().addAgentDecision({
            agentName: 'System',
            agentEmoji: '⚠️',
            action: 'Failed to connect to backend',
            status: 'error',
            timestamp: new Date(),
          });
        } finally {
          set({ isLoadingAction: false });
        }
      },
      
      setIsListening: (listening) => set({ isListening: listening }),
      setTranscript: (transcript) => set({ transcript }),
      
      recordAnswer: (correct) => {
        set((state) => ({
          answersCorrect: state.answersCorrect + (correct ? 1 : 0),
          answersWrong: state.answersWrong + (correct ? 0 : 1),
          totalQuestions: state.totalQuestions + 1,
        }));
      },
      
      startNewGame: () => set({ isPlaying: true }),
      continueGame: () => set({ isPlaying: true }),
      resetGame: () => set({ 
        gameState: null, 
        isPlaying: false, 
        agentDecisions: [], 
        backendGameId: null, 
        sceneImageUrl: null, 
        currentAudioUrl: null,
        answersCorrect: 0,
        answersWrong: 0,
        totalQuestions: 0,
      }),
    }),
    {
      name: 'adventure-tales-game',
      partialize: (state) => ({ 
        gameState: state.gameState,
        backendGameId: state.backendGameId,
        sceneImageUrl: state.sceneImageUrl,
        answersCorrect: state.answersCorrect,
        answersWrong: state.answersWrong,
        totalQuestions: state.totalQuestions,
      }),
    }
  )
);
