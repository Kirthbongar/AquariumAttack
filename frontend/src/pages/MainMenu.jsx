import { useEffect, useRef } from "react";

export default function MainMenu({ setGameState }) {
  const canvasRef = useRef(null);

  const buttons = [
    { text: "Play", x: 300, y: 200, width: 200, height: 50, action: () => setGameState("playing") },
    { text: "Instructions", x: 300, y: 270, width: 200, height: 50, action: () => setGameState("instructions") },
    { text: "Quit", x: 300, y: 340, width: 200, height: 50, action: () => console.log("Quit pressed") },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Draw buttons and title
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#fff";
      ctx.font = "36px Arial";
      ctx.fillText("Insaniquarium Deluxe", 180, 100);

      buttons.forEach(btn => {
        ctx.fillStyle = "#555";
        ctx.fillRect(btn.x, btn.y, btn.width, btn.height);
        ctx.fillStyle = "#fff";
        ctx.font = "24px Arial";
        ctx.fillText(btn.text, btn.x + 40, btn.y + 32);
      });
    }

    draw();

    function handleClick(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      buttons.forEach(btn => {
        if (x >= btn.x && x <= btn.x + btn.width && y >= btn.y && y <= btn.y + btn.height) {
          btn.action();
        }
      });
    }

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [setGameState]);

  return <canvas ref={canvasRef} width={800} height={600} />;
}
