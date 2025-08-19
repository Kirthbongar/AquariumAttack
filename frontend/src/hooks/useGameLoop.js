import { useEffect, useRef } from 'react';
import { GameLogic } from '../utils/gameLogic';
import { Renderer } from '../utils/renderer';

export function useGameLoop({
  canvasRef,
  gameState,
  getFish,
  getFood,
  getCoins,
  getGameState,
  updateTime,
  removeFood,
  removeCoin,
  addCoin,
  updateUIState
}) {
  const animationIdRef = useRef();

  useEffect(() => {
    if (gameState !== "playing") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let lastTime = performance.now();

    const gameLoop = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const state = getGameState();
      
      if (state.paused) {
        animationIdRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      updateTime(deltaTime);

      const fish = getFish();
      const food = getFood();
      
      fish.forEach(fishObj => {
        const targetFood = GameLogic.findNearestFood(fishObj, food);
        const moveResult = GameLogic.updateFishMovement(fishObj, targetFood, deltaTime);
        
        if (moveResult.shouldEatFood) {
          removeFood(moveResult.foodId);
          GameLogic.feedFish(fishObj);
        }

        const coinData = GameLogic.trySpawnCoin(fishObj, state.foodValue, deltaTime);
        if (coinData) {
          addCoin(coinData);
        }
      });

      food.forEach(foodItem => {
        const reachedBottom = GameLogic.updateFoodPosition(foodItem, currentTime);
        if (reachedBottom || GameLogic.isOffScreen(foodItem, canvas.height)) {
          removeFood(foodItem.id);
        }
      });

      const coins = getCoins();
      coins.forEach(coin => {
        GameLogic.updateCoinPosition(coin, deltaTime);
        if (GameLogic.isOffScreen(coin, canvas.height)) {
          removeCoin(coin.id);
        }
      });

      updateUIState();
      Renderer.drawAll(ctx, state, canvas.width, canvas.height);

      animationIdRef.current = requestAnimationFrame(gameLoop);
    };

    animationIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [gameState, canvasRef, getFish, getFood, getCoins, getGameState, updateTime, removeFood, removeCoin, addCoin, updateUIState]);
}