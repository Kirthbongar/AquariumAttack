import { useRef, useState, useCallback } from "react";

export function useGameState() {
  // Core game state - use refs for performance (no re-renders on each frame)
  const gameStateRef = useRef({
    // Player stats
    coins: 50,
    elapsedTime: 0,
    maxFood: 3,
    foodValue: 1,
    
    // Game objects
    fish: [
      { id: 1, x: 100, y: 300, size: 20, eaten: 0, stage: 1, coinTimer: 0, nextCoinTime: 4 + Math.random() * 3 },
      { id: 2, x: 300, y: 400, size: 20, eaten: 0, stage: 1, coinTimer: 0, nextCoinTime: 4 + Math.random() * 3 },
    ],
    food: [],
    coins_objects: [],
    
    // Game settings
    paused: false,
    gameSpeed: 1,
    
    // Performance tracking
    lastUpdate: 0,
    frameCount: 0
  });

  // UI state - only update React state when UI needs to re-render
  const [uiState, setUIState] = useState({
    coins: gameStateRef.current.coins,
    elapsedTime: gameStateRef.current.elapsedTime,
    fishCount: gameStateRef.current.fish.length,
    foodCount: gameStateRef.current.food.length,
    coinCount: gameStateRef.current.coins_objects.length
  });

  // Update UI state less frequently (every 100ms instead of every frame)
  const updateUITimer = useRef(0);
  const UPDATE_UI_INTERVAL = 0.1; // 100ms

  const updateUIState = useCallback((forceUpdate = false) => {
    const now = performance.now() / 1000;
    if (forceUpdate || now - updateUITimer.current > UPDATE_UI_INTERVAL) {
      updateUITimer.current = now;
      const state = gameStateRef.current;
      
      setUIState({
        coins: state.coins,
        elapsedTime: state.elapsedTime,
        fishCount: state.fish.length,
        foodCount: state.food.length,
        coinCount: state.coins_objects.length
      });
    }
  }, []);

  // Load saved game state
  const loadGameState = useCallback((savedState) => {
    if (savedState && savedState.currentGameState) {
      const saved = savedState.currentGameState;
      gameStateRef.current = {
        ...gameStateRef.current,
        coins: saved.coins || 50,
        elapsedTime: saved.elapsedTime || 0,
        maxFood: saved.maxFood || 3,
        foodValue: saved.foodValue || 1,
      };
      updateUIState(true);
    }
  }, [updateUIState]);

  // Getter functions for accessing game state
  const getGameState = useCallback(() => gameStateRef.current, []);
  const getFish = useCallback(() => gameStateRef.current.fish, []);
  const getFood = useCallback(() => gameStateRef.current.food, []);
  const getCoins = useCallback(() => gameStateRef.current.coins_objects, []);
  
  // State modification functions
  const modifyCoins = useCallback((amount) => {
    gameStateRef.current.coins += amount;
    updateUIState(true);
  }, [updateUIState]);

  const setMaxFood = useCallback((value) => {
    gameStateRef.current.maxFood = value;
  }, []);

  const setFoodValue = useCallback((value) => {
    gameStateRef.current.foodValue = value;
    updateUIState(true);
  }, [updateUIState]);

  const addFish = useCallback((fishData) => {
    const newFish = {
      id: Date.now() + Math.random(),
      x: fishData.x || 100,
      y: fishData.y || 300,
      size: fishData.size || 20,
      eaten: 0,
      stage: 1,
      coinTimer: 0,
      nextCoinTime: 4 + Math.random() * 3,
      ...fishData
    };
    gameStateRef.current.fish.push(newFish);
  }, []);

  const addFood = useCallback((x, y) => {
    if (gameStateRef.current.food.length >= gameStateRef.current.maxFood) {
      return false;
    }
    
    const newFood = {
      id: Date.now() + Math.random(),
      x,
      y,
      startY: y,
      targetY: window.innerHeight - 20,
      fallDuration: 6,
      spawnTime: performance.now(),
    };
    
    gameStateRef.current.food.push(newFood);
    return true;
  }, []);

  const addCoin = useCallback((coinData) => {
    const newCoin = {
      id: Date.now() + Math.random(),
      x: coinData.x,
      y: coinData.y,
      value: coinData.value || 5,
      ...coinData
    };
    gameStateRef.current.coins_objects.push(newCoin);
  }, []);

  const removeCoin = useCallback((coinId) => {
    const coinIndex = gameStateRef.current.coins_objects.findIndex(c => c.id === coinId);
    if (coinIndex !== -1) {
      const coin = gameStateRef.current.coins_objects[coinIndex];
      gameStateRef.current.coins_objects.splice(coinIndex, 1);
      return coin;
    }
    return null;
  }, []);

  const removeFood = useCallback((foodId) => {
    const foodIndex = gameStateRef.current.food.findIndex(f => f.id === foodId);
    if (foodIndex !== -1) {
      gameStateRef.current.food.splice(foodIndex, 1);
      return true;
    }
    return false;
  }, []);

  const updateTime = useCallback((deltaTime) => {
    gameStateRef.current.elapsedTime += deltaTime;
  }, []);

  const setPaused = useCallback((paused) => {
    gameStateRef.current.paused = paused;
  }, []);

  const togglePause = useCallback(() => {
    gameStateRef.current.paused = !gameStateRef.current.paused;
    return gameStateRef.current.paused;
  }, []);

  const resetGame = useCallback(() => {
    gameStateRef.current = {
      coins: 50,
      elapsedTime: 0,
      maxFood: 3,
      foodValue: 1,
      fish: [
        { id: 1, x: 100, y: 300, size: 20, eaten: 0, stage: 1, coinTimer: 0, nextCoinTime: 4 + Math.random() * 3 },
        { id: 2, x: 300, y: 400, size: 20, eaten: 0, stage: 1, coinTimer: 0, nextCoinTime: 4 + Math.random() * 3 },
      ],
      food: [],
      coins_objects: [],
      paused: false,
      gameSpeed: 1,
      lastUpdate: 0,
      frameCount: 0
    };
    updateUIState(true);
  }, [updateUIState]);

  return {
    // State access
    gameState: gameStateRef.current,
    uiState,
    getGameState,
    getFish,
    getFood,
    getCoins,
    
    // State modification
    modifyCoins,
    setMaxFood,
    setFoodValue,
    addFish,
    addFood,
    addCoin,
    removeCoin,
    removeFood,
    updateTime,
    setPaused,
    togglePause,
    resetGame,
    updateUIState,
    loadGameState
  };
}