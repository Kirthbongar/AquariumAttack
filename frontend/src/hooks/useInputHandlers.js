import { useCallback, useEffect } from 'react';
import { GameLogic } from '../utils/gameLogic';

export function useInputHandlers({
  canvasRef,
  gameScreen,
  getGameState,
  getCoins,
  addFood,
  modifyCoins,
  removeCoin,
  togglePause,
  resetGame
}) {
  const handleClick = useCallback((e) => {
    if (gameScreen !== "playing") return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const state = getGameState();

    if (y < 50) {
      console.log("Shop clicked at", x);
      return;
    }

    if (state.coins >= 5 && addFood(x, y)) {
      modifyCoins(-5);
    }

    const coins = getCoins();
    const clickedCoin = GameLogic.getClickedCoin(coins, x, y);
    if (clickedCoin) {
      modifyCoins(clickedCoin.value);
      removeCoin(clickedCoin.id);
    }
  }, [gameScreen, canvasRef, getGameState, getCoins, addFood, modifyCoins, removeCoin]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === ' ') {
      e.preventDefault();
      togglePause();
    }
    if (e.key === 'r' && e.ctrlKey) {
      e.preventDefault();
      resetGame();
    }
  }, [togglePause, resetGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return { handleClick };
}