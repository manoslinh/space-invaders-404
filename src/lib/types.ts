/**
 * Core game types for Space Invaders 404
 * These types define the game state, entities, and configuration
 */

export type Vec = { x: number; y: number };

export type Bullet = {
  pos: Vec;
  vel: Vec;
  w: number;
  h: number;
  from: "player" | "invader";
  alive: boolean;
};

export type Invader = {
  pos: Vec;
  w: number;
  h: number;
  alive: boolean;
  emoji: string;
  points: number;
  shootChance: number;
};

export type Player = {
  pos: Vec;
  w: number;
  h: number;
  speed: number;
  lives: number;
  cooldownMs: number;
  lastShotAt: number;
};

export type GameState = "running" | "paused" | "lost";

export type GameConfig = {
  // Canvas dimensions (if not provided, will use container size)
  width?: number;
  height?: number;
  
  // Game difficulty
  playerLives: number;
  playerSpeed: number;
  invaderSpeed: number;
  bulletSpeed: number;
  difficultyCurve: number; // Percentage increase per wave
  
  // Visual
  theme: "dark" | "light";
  showHighScore: boolean;
  
  // Callbacks
  onGameOver?: (score: number) => void;
  onScoreUpdate?: (score: number) => void;
  onWaveChange?: (wave: number) => void;
};

export type GameRef = {
  reset: () => void;
  pause: () => void;
  resume: () => void;
  getScore: () => number;
  getHighScore: () => number;
  getWave: () => number;
  getLives: () => number;
};