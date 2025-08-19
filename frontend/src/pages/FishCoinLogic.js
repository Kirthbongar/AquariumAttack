// FishCoinLogic.js
export function trySpawnCoin(fish, foodValue, deltaTime) {
  if (fish.stage <= 1) return null; // Only grown fish drop coins

  // Increment coin timer
  fish.coinTimer += deltaTime;

  if (fish.coinTimer >= fish.nextCoinTime) {
    const coinValue = fish.stage === 2 ? 5 * foodValue : 10 * foodValue;
    fish.coinTimer = 0;
    fish.nextCoinTime = 4 + Math.random() * 3; // random 4-7 sec interval
    return {
      id: Date.now() + Math.random(),
      x: fish.x,
      y: fish.y,
      value: coinValue,
    };
  }

  return null;
}