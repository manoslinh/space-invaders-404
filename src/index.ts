/**
 * Space Invaders 404 - Main Package Entry Point
 * 
 * A standalone Space Invaders game component for embedding anywhere.
 * Perfect for 404 pages, landing pages, or as a fun interactive widget.
 */

export { SpaceInvaders404, type SpaceInvaders404Props } from './components/SpaceInvaders404';
export { defaultConfig, difficultyPresets, generateRandomName } from './lib/utils';
export type { GameConfig, GameRef } from './lib/types';

// Re-export everything from lib for advanced usage
export * from './lib/types';
export * from './lib/utils';
export { GameEngine } from './lib/game-engine';
export { CanvasRenderer } from './lib/canvas-renderer';

/**
 * Default export is the main React component
 */
export default SpaceInvaders404;