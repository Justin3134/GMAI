const API_URL = 'http://localhost:3001';

export interface StartGameRequest {
  kidName: string;
  characterClass: string;
  kidId: string;
}

export interface GameActionRequest {
  gameId: string;
  kidAction: string;
  gameState: any;
  kidId: string;
}

export interface GameResponse {
  narration: string;
  audioUrl: string | null;
  imageUrl: string | null;
  gameState: any;
  agentDecisions: any;
  challenge: any;
}

export const api = {
  startGame: async (data: StartGameRequest): Promise<any> => {
    const response = await fetch(`${API_URL}/api/game/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to start game');
    return response.json();
  },

  sendAction: async (data: GameActionRequest): Promise<GameResponse> => {
    const response = await fetch(`${API_URL}/api/game/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to send action');
    return response.json();
  },

  getGameState: async (gameId: string): Promise<any> => {
    const response = await fetch(`${API_URL}/api/game/state/${gameId}`);
    if (!response.ok) throw new Error('Failed to get game state');
    return response.json();
  },

  getParentProgress: async (kidId: string): Promise<any> => {
    const response = await fetch(`${API_URL}/api/parent/progress/${kidId}`);
    if (!response.ok) throw new Error('Failed to get progress');
    return response.json();
  },

  getTeacherOverview: async (kidId: string): Promise<any> => {
    const response = await fetch(`${API_URL}/api/teacher/overview/${kidId}`);
    if (!response.ok) throw new Error('Failed to get overview');
    return response.json();
  },
};

