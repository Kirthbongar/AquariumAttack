export const GAME_CONSTANTS = {
  // Fish constants
  FISH_SPEED: 50,
  FISH_EAT_DISTANCE: 5,
  FISH_GROWTH_FOOD_COUNT: 3,
  FISH_SIZE_INCREMENT: 10,
  FISH_STAGES: 3,
  
  // Coin constants
  COIN_DROP_SPEED: 80,
  COIN_BASE_SPAWN_TIME: 4,
  COIN_SPAWN_VARIANCE: 3,
  
  // Food constants
  FOOD_COST: 5,
  FOOD_FALL_DURATION: 6,
  FOOD_SIZE: 5,
  DEFAULT_MAX_FOOD: 3,
  DEFAULT_FOOD_VALUE: 1,
  
  // Game constants
  DEFAULT_COINS: 50,
  SHOP_HEIGHT: 50,
  UI_UPDATE_INTERVAL: 0.1, // 100ms
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  
  // Canvas constants
  OBJECT_BOUNDARY_OFFSET: 20,
  
  // Colors
  COLORS: {
    FISH_STAGE_1: "#ff6b6b",
    FISH_STAGE_2: "#4ecdc4", 
    FISH_STAGE_3: "#45b7d1",
    FOOD: "#feca57",
    COIN: "#f39c12",
    COIN_BORDER: "#d68910",
    SHOP_AREA: "#d3d3d3",
    AQUARIUM_BG: "#00aaff"
  }
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    RESET_REQUEST: "/auth/request-password-reset",
    RESET_PASSWORD: "/auth/reset-password"
  },
  GAME: {
    PROGRESS: "/game/progress",
    LEADERBOARD: "/game/leaderboard"
  },
  PROTECTED: "/protected"
};