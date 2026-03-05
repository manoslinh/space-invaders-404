/**
 * SpaceInvaders404 React Component
 * 
 * A standalone Space Invaders game component that can be embedded anywhere.
 * This is the main export of the package - container-agnostic and reusable.
 */

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { GameEngine } from '../lib/game-engine';
import { CanvasRenderer } from '../lib/canvas-renderer';
import { saveHighScore, defaultConfig, type GameConfig, type GameRef } from '../lib';

export interface SpaceInvaders404Props extends Partial<GameConfig> {
  /** Canvas width (if not provided, uses container width) */
  width?: number;
  /** Canvas height (if not provided, uses container height or aspect ratio) */
  height?: number;
  /** CSS class for the canvas container */
  className?: string;
  /** Inline styles for the canvas container */
  style?: React.CSSProperties;
  /** Whether to show debug overlay */
  debug?: boolean;
}

/**
 * SpaceInvaders404 Component
 * 
 * A container-agnostic Space Invaders game that can be embedded anywhere.
 * Supports keyboard, mouse, and touch controls.
 */
export const SpaceInvaders404 = forwardRef<GameRef, SpaceInvaders404Props>((props, ref) => {
  const {
    width,
    height,
    className = '',
    style = {},
    debug = false,
    // Game config props
    playerLives = defaultConfig.playerLives,
    playerSpeed = defaultConfig.playerSpeed,
    invaderSpeed = defaultConfig.invaderSpeed,
    bulletSpeed = defaultConfig.bulletSpeed,
    difficultyCurve = defaultConfig.difficultyCurve,
    theme = defaultConfig.theme,
    showHighScore = defaultConfig.showHighScore,
    onGameOver,
    onScoreUpdate,
    onWaveChange,
  } = props;
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  // State
  const [isInitialized, setIsInitialized] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  // Keyboard input
  const keysRef = useRef({ left: false, right: false });
  
  // Drag control refs (touch + mouse)
  const draggingRef = useRef(false);
  const dragPointerIdRef = useRef<number | null>(null);
  const grabOffsetXRef = useRef(0);
  
  // Initialize game engine and renderer
  const initializeGame = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Determine canvas dimensions
    let canvasWidth = width || container.clientWidth;
    let canvasHeight = height || Math.min(500, container.clientHeight);
    
    // Ensure minimum size
    canvasWidth = Math.max(320, canvasWidth);
    canvasHeight = Math.max(400, canvasHeight);
    
    // Set canvas internal dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    setCanvasSize({ width: canvasWidth, height: canvasHeight });
    
    // Create game configuration
    const config: GameConfig = {
      playerLives,
      playerSpeed,
      invaderSpeed,
      bulletSpeed,
      difficultyCurve,
      theme,
      showHighScore,
      onGameOver: (score) => {
        // Save high score
        saveHighScore(score);
        // Call user callback
        onGameOver?.(score);
      },
      onScoreUpdate,
      onWaveChange,
    };
    
    // Initialize game engine and renderer
    gameEngineRef.current = new GameEngine(canvasWidth, canvasHeight, config);
    rendererRef.current = new CanvasRenderer(ctx, theme, showHighScore);
    
    setIsInitialized(true);
  };
  
  // Game loop
  const gameLoop = () => {
    const game = gameEngineRef.current;
    const renderer = rendererRef.current;
    
    if (!game || !renderer) return;
    
    const now = performance.now();
    const lastFrameAt = game['lastFrameAt']; // Access private property via bracket notation
    const dt = Math.min(0.033, (now - lastFrameAt) / 1000);
    game['lastFrameAt'] = now; // Update private property
    
    // Update game state
    game.update(dt, now, keysRef.current);
    
    // Render frame
    renderer.draw(game);
    
    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };
  
  // Handle resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const game = gameEngineRef.current;
    
    if (!canvas || !container || !game) return;
    
    // Calculate new dimensions
    let newWidth = width || container.clientWidth;
    let newHeight = height || Math.min(500, container.clientHeight);
    
    // Ensure minimum size
    newWidth = Math.max(320, newWidth);
    newHeight = Math.max(400, newHeight);
    
    // Update canvas
    canvas.width = newWidth;
    canvas.height = newHeight;
    setCanvasSize({ width: newWidth, height: newHeight });
    
    // Update game engine with new dimensions
    game.updateCanvasSize(newWidth, newHeight);
  };
  
  // Keyboard event handlers
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keysRef.current.left = true;
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keysRef.current.right = true;
    if (e.key.toLowerCase() === "r") resetGame();
  };
  
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keysRef.current.left = false;
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keysRef.current.right = false;
  };
  
  // Pointer event handlers for drag controls
  const handlePointerDown = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    const game = gameEngineRef.current;
    if (!canvas || !game) return;
    
    // If game is paused, resume it first
    if (game.getState() === "paused") {
      game.resume();
    }
    
    // Only allow dragging if game is running
    if (game.getState() !== "running") return;
    
    canvas.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    dragPointerIdRef.current = e.pointerId;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const player = game.getPlayer();
    grabOffsetXRef.current = x - (player.pos.x + player.w / 2);
  };
  
  const handlePointerMove = (e: React.PointerEvent) => {
    const game = gameEngineRef.current;
    const canvas = canvasRef.current;
    if (!game || !canvas) return;
    if (!draggingRef.current) return;
    if (dragPointerIdRef.current !== e.pointerId) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const desiredCenterX = x - grabOffsetXRef.current;
    const player = game.getPlayer();
    const newX = desiredCenterX - player.w / 2;
    const w = rect.width;
    player.pos.x = Math.max(0, Math.min(newX, w - player.w));
    e.preventDefault();
  };
  
  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragPointerIdRef.current === e.pointerId) {
      draggingRef.current = false;
      dragPointerIdRef.current = null;
    }
  };
  
  // Game control functions
  const resetGame = () => {
    gameEngineRef.current?.reset();
  };
  
  const pauseGame = () => {
    gameEngineRef.current?.pause();
  };
  
  const resumeGame = () => {
    gameEngineRef.current?.resume();
  };
  
  // Expose game controls via ref
  useImperativeHandle(ref, () => ({
    reset: resetGame,
    pause: pauseGame,
    resume: resumeGame,
    getScore: () => gameEngineRef.current?.getScore() || 0,
    getHighScore: () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem("spaceInvadersHighScore");
        return saved ? parseInt(saved, 10) : 0;
      }
      return 0;
    },
    getWave: () => gameEngineRef.current?.getWave() || 1,
    getLives: () => gameEngineRef.current?.getLives() || 0,
  }));
  
  // Initialize on mount
  useEffect(() => {
    initializeGame();
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);
    
    // Start game loop once initialized
    if (isInitialized) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [isInitialized]);
  
  // Restart game loop when initialized
  useEffect(() => {
    if (isInitialized) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isInitialized]);
  
  // Handle click for pause/resume
  const handleCanvasClick = (e: React.MouseEvent) => {
    const game = gameEngineRef.current;
    if (!game) return;
    
    // Resume when paused, and restart when game over
    if (game.getState() === "paused") {
      game.resume();
    } else if (game.getState() === "lost") {
      e.preventDefault();
      resetGame();
    }
    
    e.stopPropagation();
  };
  
  // Handle container click for pause
  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isCanvas = target.tagName === 'CANVAS' || target.closest('canvas');
    
    if (!isCanvas) {
      pauseGame();
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={`space-invaders-404 ${className}`}
      style={{
        position: 'relative',
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '500px',
        maxWidth: '100%',
        ...style,
      }}
      onClick={handleContainerClick}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          touchAction: 'none',
          borderRadius: '8px',
          border: `2px solid ${theme === 'dark' ? '#334155' : '#cbd5e1'}`,
        }}
      />
      
      {debug && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}>
          {canvasSize.width}×{canvasSize.height}
        </div>
      )}
    </div>
  );
});

SpaceInvaders404.displayName = 'SpaceInvaders404';

export default SpaceInvaders404;