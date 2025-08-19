export class Renderer {
  static clearCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
  }

  static drawShopArea(ctx, width) {
    ctx.fillStyle = "#d3d3d3";
    ctx.fillRect(0, 0, width, 50);
  }

  static drawFish(ctx, fish) {
    const colors = {
      1: "#ff6b6b",
      2: "#4ecdc4",
      3: "#45b7d1"
    };
    
    ctx.fillStyle = colors[fish.stage] || colors[1];
    ctx.beginPath();
    ctx.arc(fish.x, fish.y, fish.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw fish eye
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(fish.x + fish.size * 0.3, fish.y - fish.size * 0.2, fish.size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(fish.x + fish.size * 0.3, fish.y - fish.size * 0.2, fish.size * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawFood(ctx, food) {
    ctx.fillStyle = "#feca57";
    ctx.beginPath();
    ctx.arc(food.x, food.y, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(food.x - 2, food.y - 2, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawCoin(ctx, coin) {
    ctx.fillStyle = "#f39c12";
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = "#d68910";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = "#000";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(coin.value.toString(), coin.x, coin.y);
  }

  static drawAll(ctx, gameState, canvasWidth, canvasHeight) {
    this.clearCanvas(ctx, canvasWidth, canvasHeight);
    this.drawShopArea(ctx, canvasWidth);
    
    gameState.fish.forEach(fish => this.drawFish(ctx, fish));
    gameState.food.forEach(food => this.drawFood(ctx, food));
    gameState.coins_objects.forEach(coin => this.drawCoin(ctx, coin));
  }
}