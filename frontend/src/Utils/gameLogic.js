export class GameLogic {
  static trySpawnCoin(fish, foodValue, deltaTime) {
    fish.coinTimer += deltaTime;
    
    if (fish.coinTimer >= fish.nextCoinTime) {
      fish.coinTimer = 0;
      fish.nextCoinTime = 4 + Math.random() * 3;
      
      const coinValue = fish.stage * foodValue;
      return {
        x: fish.x,
        y: fish.y,
        value: coinValue
      };
    }
    return null;
  }

  static findNearestFood(fish, foodList) {
    if (foodList.length === 0) return null;
    
    return foodList.reduce((closest, food) => {
      const d1 = Math.hypot(fish.x - closest.x, fish.y - closest.y);
      const d2 = Math.hypot(fish.x - food.x, fish.y - food.y);
      return d2 < d1 ? food : closest;
    }, foodList[0]);
  }

  static updateFishMovement(fish, targetFood, deltaTime) {
    if (!targetFood) return;
    
    const dx = targetFood.x - fish.x;
    const dy = targetFood.y - fish.y;
    const dist = Math.hypot(dx, dy);
    const speed = 50;

    if (dist < 5) {
      return { shouldEatFood: true, foodId: targetFood.id };
    } else {
      fish.x += (dx / dist) * speed * deltaTime;
      fish.y += (dy / dist) * speed * deltaTime;
    }
    
    return { shouldEatFood: false };
  }

  static feedFish(fish) {
    fish.eaten += 1;
    
    if (fish.eaten % 3 === 0 && fish.stage < 3) {
      fish.stage += 1;
      fish.size += 10;
    }
  }

  static updateFoodPosition(food, currentTime) {
    const elapsed = (currentTime - food.spawnTime) / 1000;
    const progress = Math.min(elapsed / food.fallDuration, 1);
    food.y = food.startY + (food.targetY - food.startY) * progress;
    
    return progress >= 1;
  }

  static updateCoinPosition(coin, deltaTime) {
    coin.y += 80 * deltaTime;
  }

  static isOffScreen(object, canvasHeight) {
    return object.y >= canvasHeight - 20;
  }

  static getClickedCoin(coins, clickX, clickY, radius = 15) {
    return coins.find(coin => Math.hypot(coin.x - clickX, coin.y - clickY) < radius);
  }
}