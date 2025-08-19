import { useRef, useState, useEffect } from "react";
import MainMenu from "./MainMenu";
import InstructionsMenu from "./InstructionsMenu";
import Shop from "./Shop";
import HUD from "./HUD";
import Fish from "./Fish";
import Food from "./Food";
import Coin from "./Coin";
import { trySpawnCoin } from "./FishCoinLogic";

export default function Game() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("menu");

  const [coins, setCoins] = useState(50);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [maxFood, setMaxFood] = useState(3);
  const [foodValue, setFoodValue] = useState(1);

  // Refs for mutable game state
  const fishListRef = useRef([
    { id: 1, x: 100, y: 300, size: 20, eaten: 0, stage: 1, coinTimer: 0, nextCoinTime: 4 + Math.random() * 3 },
    { id: 2, x: 300, y: 400, size: 20, eaten: 0, stage: 1, coinTimer: 0, nextCoinTime: 4 + Math.random() * 3 },
  ]);
  const foodListRef = useRef([]);
  const coinListRef = useRef([]);

  // React state for rendering
  const [fishList, setFishList] = useState(fishListRef.current);
  const [foodList, setFoodList] = useState(foodListRef.current);
  const [coinList, setCoinList] = useState(coinListRef.current);

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lastTime = performance.now();

    const update = (time) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      setElapsedTime(prev => prev + deltaTime);

      // --- Update Fish ---
      fishListRef.current = fishListRef.current.map(fish => {
        const newFish = { ...fish };

        // Find nearest food
        const targetFood = foodListRef.current.length
          ? foodListRef.current.reduce((closest, food) => {
              const d1 = Math.hypot(fish.x - closest.x, fish.y - closest.y);
              const d2 = Math.hypot(fish.x - food.x, fish.y - food.y);
              return d2 < d1 ? food : closest;
            }, foodListRef.current[0])
          : null;

        if (targetFood) {
          const dx = targetFood.x - newFish.x;
          const dy = targetFood.y - newFish.y;
          const dist = Math.hypot(dx, dy);
          const speed = 50;

          if (dist < 5) {
            // Eat food
            foodListRef.current = foodListRef.current.filter(f => f.id !== targetFood.id);
            newFish.eaten += 1;

            // Grow fish
            if (newFish.eaten % 3 === 0 && newFish.stage < 3) {
              newFish.stage += 1;
              newFish.size += 10;
            }
          } else {
            newFish.x += (dx / dist) * speed * deltaTime;
            newFish.y += (dy / dist) * speed * deltaTime;
          }
        }

        // Coin spawn logic
        const coin = trySpawnCoin(newFish, foodValue, deltaTime);
        if (coin) coinListRef.current.push(coin);

        return newFish;
      });

      // --- Update Food ---
      foodListRef.current = foodListRef.current
        .map(f => {
          const elapsed = (performance.now() - f.spawnTime) / 1000;
          const progress = Math.min(elapsed / f.fallDuration, 1);
          return { ...f, y: f.startY + (f.targetY - f.startY) * progress };
        })
        .filter(f => f.y < canvas.height - 10);

      // --- Update Coins ---
      coinListRef.current = coinListRef.current
        .map(c => ({ ...c, y: c.y + 80 * deltaTime }))
        .filter(c => c.y < canvas.height - 20);

      // Sync refs to React state once per frame
      setFishList([...fishListRef.current]);
      setFoodList([...foodListRef.current]);
      setCoinList([...coinListRef.current]);

      // --- Draw ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#d3d3d3";
      ctx.fillRect(0, 0, canvas.width, 50);
      fishListRef.current.forEach(fish => Fish.draw(ctx, fish));
      foodListRef.current.forEach(food => Food.draw(ctx, food));
      coinListRef.current.forEach(coin => Coin.draw(ctx, coin));

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [gameState, foodValue]);

  const handleClick = (e) => {
    if (gameState !== "playing") return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (y < 50) {
      Shop.handleClick(x, coins, setCoins, fishList, setFishList, maxFood, setMaxFood, foodValue, setFoodValue);
      return;
    }

    // Add food
    if (coins >= 5 && foodListRef.current.length < maxFood) {
      setCoins(prev => prev - 5);
      const canvas = canvasRef.current;
      const aquariumBottom = canvas.height;

      const newFood = {
        id: Date.now(),
        x,
        y,
        startY: y,
        targetY: aquariumBottom - 20,
        fallDuration: 6,
        spawnTime: performance.now(),
      };

      foodListRef.current.push(newFood);
      setFoodList([...foodListRef.current]);
    }

    // Collect coin
    const clickedCoinIndex = coinList.findIndex(c => Math.hypot(c.x - x, c.y - y) < 10);
    if (clickedCoinIndex !== -1) {
      const coin = coinList[clickedCoinIndex];
      setCoins(prev => prev + coin.value);
      coinListRef.current = coinListRef.current.filter((_, i) => i !== clickedCoinIndex);
      setCoinList([...coinListRef.current]);
    }
  };

  return (
    <div>
      {gameState === "menu" && <MainMenu setGameState={setGameState} />}
      {gameState === "instructions" && <InstructionsMenu setGameState={setGameState} />}
      {gameState === "playing" && (
        <>
          <HUD coins={coins} elapsedTime={elapsedTime} />
          <canvas
            ref={canvasRef}
            onClick={handleClick}
            style={{ display: "block", backgroundColor: "#00aaff" }}
          />
        </>
      )}
    </div>
  );
}
