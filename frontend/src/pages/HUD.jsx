export default function HUD({ coins, elapsedTime }) {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, color: "black", padding: "5px", fontFamily: "Arial" }}>
      <span style={{ marginRight: "20px" }}>Coins: {coins}</span>
      <span>Time: {Math.floor(elapsedTime)}s</span>
    </div>
  );
}
