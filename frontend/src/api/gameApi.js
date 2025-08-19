import API from './api';

export const gameApi = {
  // Get user's game progress
  getProgress: async () => {
    const response = await API.get('/game/progress');
    return response.data;
  },

  // Save game progress
  saveProgress: async (progressData) => {
    const response = await API.post('/game/progress', progressData);
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async (limit = 10) => {
    const response = await API.get(`/game/leaderboard?limit=${limit}`);
    return response.data;
  },

  // Reset progress (for testing)
  resetProgress: async () => {
    const response = await API.delete('/game/progress');
    return response.data;
  },

  // Auto-save current game state
  autoSave: async (gameState) => {
    try {
      return await gameApi.saveProgress({
        currentGameState: {
          coins: gameState.coins,
          elapsedTime: gameState.elapsedTime,
          maxFood: gameState.maxFood,
          foodValue: gameState.foodValue,
          fishCount: gameState.fish.length
        },
        totalPlayTime: gameState.elapsedTime,
        lastPlayed: new Date()
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      return null;
    }
  },

  // Save final game results
  saveGameEnd: async (gameState, finalScore) => {
    try {
      return await gameApi.saveProgress({
        highScore: finalScore,
        totalCoinsEarned: gameState.coins,
        totalPlayTime: gameState.elapsedTime,
        gamesPlayed: 1,
        currentGameState: {
          coins: gameState.coins,
          elapsedTime: gameState.elapsedTime,
          maxFood: gameState.maxFood,
          foodValue: gameState.foodValue,
          fishCount: gameState.fish.length
        }
      });
    } catch (error) {
      console.error('Failed to save game end:', error);
      return null;
    }
  }
};