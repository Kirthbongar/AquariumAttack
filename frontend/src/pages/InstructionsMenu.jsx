import { useEffect, useRef } from "react";

export default function InstructionsMenu({ setGameState }) {
  const canvasRef = useRef(null);

  const backButton = { text: "Back", x: 300, y: 500, width: 200, height: 50, action: () => setGameState("menu") };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#fff";
      ctx.font = "28px Arial";
      ctx.fillText("Instructions", 280, 80);

      ctx.font = "20px Arial";
      const instructions = [
        "• Feed your fish regularly.",
        "• Collect coins to buy upgrades.",
        "• Defend against attacking aliens.",
        "• Survive as long as possible!"
      ];
      instructions.forEach((line, i) => ctx.fillText(line, 50, 150 + i * 30));

      // Draw back button
      ctx.fillStyle = "#555";
      ctx.fillRect(backButton.x, backButton.y, backButton.width, backButton.height);
      ctx.fillStyle = "#fff";
      ctx.fillText(backButton.text, backButton.x + 60, backButton.y + 32);
    }

    draw();

    function handleClick(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= backButton.x && x <= backButton.x + backButton.width && y >= backButton.y && y <= backButton.y + backButton.height) {
        backButton.action();
      }
    }

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [setGameState]);

  return <canvas ref={canvasRef} width={800} height={600} />;
}
