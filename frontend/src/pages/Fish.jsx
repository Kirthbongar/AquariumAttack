const Fish = {
  draw: (ctx, fish) => {
    ctx.beginPath();
    ctx.arc(fish.x, fish.y, fish.size, 0, Math.PI * 2);
    ctx.fillStyle = fish.stage === 1 ? "orange" : fish.stage === 2 ? "red" : "purple";
    ctx.fill();
    ctx.closePath();
  },
};

export default Fish;
