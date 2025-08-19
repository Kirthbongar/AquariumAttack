import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { setAuthToken } from "../api/api";
import { useGameState } from "../hooks/useGameState";
import { useGameLoop } from "../hooks/useGameLoop";
import { useInputHandlers } from "../hooks/useInputHandlers";
import { HUD } from "../components/HUD";
import { MainMenu } from "../components/MainMenu";

export default function Game() {
  const canvasRef = useRef(null);
  const [gameScreen, setGameScreen] = useState("menu");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Game state management
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

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    
    if (!token) {
      navigate("/");
      return;
    }
    
    setAuthToken(token);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  // Auto-save game progress
  useEffect(() => {
    if (gameScreen === "playing" && user) {
      const saveInterval = setInterval(async () => {
        try {
          const state = getGameState();
          await API.post("/game/progress", {
            currentGameState: {
              coins: state.coins,
              elapsedTime: state.elapsedTime,
              maxFood: state.maxFood,
              foodValue: state.foodValue,
              fishCount: state.fish.length
            },
            totalPlayTime: state.elapsedTime,
            lastPlayed: new Date()
          });
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
      }, 30000); // Save every 30 seconds

      return () => clearInterval(saveInterval);
    }
  }, [gameScreen, user, getGameState]);

  // Save on game end
  const handleGameEnd = async (finalScore) => {
    if (!user) return;

    try {
      const state = getGameState();
      await API.post("/game/progress", {
        highScore: finalScore,
        totalCoinsEarned: state.coins,
        totalPlayTime: state.elapsedTime,
        gamesPlayed: 1, // This would be incremented on backend
        currentGameState: {
          coins: state.coins,
          elapsedTime: state.elapsedTime,
          maxFood: state.maxFood,
          foodValue: state.foodValue,
          fishCount: state.fish.length
        }
      });
    } catch (error) {
      console.error("Failed to save game progress:", error);
    }
  };

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

  const handleBackToDashboard = () => {
    const finalScore = getGameState().coins;
    handleGameEnd(finalScore);
    navigate("/dashboard");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-blue-500">
      {gameScreen === "menu" && (
        <div className="relative h-full">
          <MainMenu onStartGame={() => setGameScreen("playing")} />
          
          {/* Back to Dashboard Button */}
          <div className="absolute top-4 left-4">
            <button
              onClick={handleBackToDashboard}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              ← Dashboard
            </button>
          </div>
          
          {/* User Info */}
          <div className="absolute top-4 right-4 text-white">
            <p>Welcome, {user.email.split('@')[0]}!</p>
          </div>
        </div>
      )}
      
      {gameScreen === "playing" && (
        <>
          <HUD 
            uiState={uiState} 
            isPaused={getGameState().paused}
            user={user}
            onBackToDashboard={handleBackToDashboard}
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