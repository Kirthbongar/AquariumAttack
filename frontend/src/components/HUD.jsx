import React from 'react';

export function HUD({ uiState, isPaused, user, onBackToDashboard }) {
  return (
    <>
      {/* Main HUD */}
      <div className="absolute top-2 left-2 z-10 bg-black bg-opacity-75 text-white p-3 rounded-lg">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <div>💰 Coins: ${uiState.coins}</div>
          <div>⏱️ Time: {Math.floor(uiState.elapsedTime)}s</div>
          <div>🐟 Fish: {uiState.fishCount}</div>
          <div>🍎 Food: {uiState.foodCount}</div>
        </div>
        
        {isPaused && (
          <div className="text-yellow-400 text-center mt-2 font-bold">
            ⏸️ PAUSED
          </div>
        )}
        
        <div className="text-xs text-gray-300 mt-2 border-t border-gray-600 pt-2">
          <div>Space: Pause | Ctrl+R: Reset</div>
          <div>Click: Drop food ($5) | Click coins to collect</div>
        </div>
      </div>

      {/* User info and back button */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-4">
        <div className="bg-black bg-opacity-75 text-white p-2 rounded-lg text-sm">
          Playing as: {user?.email.split('@')[0]}
        </div>
        <button
          onClick={onBackToDashboard}
          className="bg-gray-700 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
        >
          ← Dashboard
        </button>
      </div>
    </>
  );
}