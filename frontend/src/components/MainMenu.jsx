import React from 'react';

export function MainMenu({ onStartGame }) {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-b from-blue-400 to-blue-600">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          🐟 Insaniquarium 🐟
        </h1>
        <p className="text-xl text-blue-100 mb-8">
          Feed your fish, collect coins, and grow your aquarium!
        </p>
        <button 
          onClick={onStartGame}
          className="bg-white text-blue-500 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
        >
          🎮 Start Game
        </button>
      </div>
    </div>
  );
}