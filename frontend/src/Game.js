// ===============================
// FILE: Game.jsx (Main component)
// ===============================
import { useRef, useState, useEffect } from "react";
import { useGameState } from "./hooks/useGameState";
import { useGameLoop } from "./hooks/useGameLoop";
import { useInputHandlers } from "./hooks/useInputHandlers";
import { HUD } from "./components/HUD";
import { MainMenu } from "./components/MainMenu";

export default function Game() {
  const canvasRef = useRef(null);
  const [gameScreen, setGameScreen] = useState("menu");
  
  const gameStateHook = useGameState();
  const {
    uiState,
    getGameState,
    getFish,
    getFood,
    getCoins,
    modifyCoins,
    addFood,
    addCoin,
    removeCoin,
    removeFood,
    updateTime,
    togglePause,
    resetGame,
    updateUIState
  } = gameStateHook;

  // Canvas resize handling
  useEffect(() => {
    if (gameScreen !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [gameScreen]);

  // Game loop
  useGameLoop({
    canvasRef,
    gameState: gameScreen,
    getFish,
    getFood,
    getCoins,
    getGameState,
    updateTime,
    removeFood,
    removeCoin,
    addCoin,
    updateUIState
  });

  // Input handling
  const { handleClick } = useInputHandlers({
    canvasRef,
    gameScreen,
    getGameState,
    getCoins,
    addFood,
    modifyCoins,
    removeCoin,
    togglePause,
    resetGame
  });

  return (
    <div className="w-full h-screen bg-blue-500">
      {gameScreen === "menu" && (
        <MainMenu onStartGame={() => setGameScreen("playing")} />
      )}
      
      {gameScreen === "playing" && (
        <>
          <HUD 
            uiState={uiState} 
            isPaused={getGameState().paused}
          />
          
          <canvas
            ref={canvasRef}
            onClick={handleClick}
            className="block cursor-crosshair"
            style={{ backgroundColor: "#00aaff" }}
          />
        </>
      )}
    </div>
  );
}