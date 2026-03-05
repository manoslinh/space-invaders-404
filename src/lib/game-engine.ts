/**
 * Space Invaders 404 Game Engine
 * 
 * This is the core game logic, separated from rendering and React components.
 * It manages game state, updates entities, and handles collisions.
 */

import { clamp, aabb, getEmojiForWave } from './utils';
import type { Vec, Bullet, Invader, Player, GameState, GameConfig } from './types';

export class GameEngine {
  // Game state
  private player: Player;
  private invaders: Invader[] = [];
  private bullets: Bullet[] = [];
  private state: GameState = "running";
  private score: number = 0;
  private wave: number = 1;
  private difficulty: number = 1;
  
  // Game mechanics
  private invaderDir: 1 | -1 = 1;
  private invaderSpeed: number;
  private invaderDrop: number = 15;
  private invaderShootChancePerSec: number = 0.3;
  private boundsPadding: number = 20;
  
  // Timing
  private lastFrameAt: number = 0;
  private lastInvaderMove: number = 0;
  private lastWaveSpawn: number = 0;
  
  // Configuration
  private config: GameConfig;
  private canvasWidth: number;
  private canvasHeight: number;
  private isMobile: boolean;
  
  // Callbacks
  private onGameOver?: (score: number) => void;
  private onScoreUpdate?: (score: number) => void;
  private onWaveChange?: (wave: number) => void;
  
  constructor(
    width: number,
    height: number,
    config: GameConfig
  ) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.config = config;
    this.isMobile = width < 500;
    
    // Store callbacks
    this.onGameOver = config.onGameOver;
    this.onScoreUpdate = config.onScoreUpdate;
    this.onWaveChange = config.onWaveChange;
    
    // Initialize game mechanics from config
    this.invaderSpeed = config.invaderSpeed;
    
    // Create initial game state
    this.reset();
  }
  
  /**
   * Reset the game to initial state
   */
  reset(): void {
    // Responsive game elements
    const playerWidth = this.isMobile ? 35 : 40;
    const playerHeight = this.isMobile ? 35 : 40;
    const invaderSize = this.isMobile ? 28 : 32;
    const invaderCols = this.isMobile ? 6 : 8;
    const invaderRows = this.isMobile ? 3 : 4;
    const gapX = this.isMobile ? 12 : 16;
    const gapY = this.isMobile ? 16 : 20;
    const topOffset = this.isMobile ? 90 : 70;
    
    // Create player
    this.player = {
      w: playerWidth,
      h: playerHeight,
      pos: { 
        x: this.canvasWidth / 2 - playerWidth / 2, 
        y: this.canvasHeight - (this.isMobile ? 80 : 60) 
      },
      speed: this.config.playerSpeed,
      lives: this.config.playerLives,
      cooldownMs: 250, // Slower firing for relaxed gameplay
      lastShotAt: 0,
    };
    
    // Create initial invaders - ALL start as 👾
    this.invaders = [];
    const gridW = invaderCols * invaderSize + (invaderCols - 1) * gapX;
    const startX = Math.max(10, (this.canvasWidth - gridW) / 2);
    
    for (let r = 0; r < invaderRows; r++) {
      for (let c = 0; c < invaderCols; c++) {
        this.invaders.push({
          w: invaderSize,
          h: invaderSize,
          alive: true,
          emoji: "👾", // ALL start as 👾 for wave 1
          points: 10 + r * 5,
          shootChance: 0.05 + r * 0.05,
          pos: {
            x: startX + c * (invaderSize + gapX),
            y: topOffset + r * (invaderSize + gapY),
          },
        });
      }
    }
    
    // Reset other state
    this.bullets = [];
    this.state = "running";
    this.score = 0;
    this.wave = 1;
    this.difficulty = 1;
    this.invaderDir = 1;
    this.lastFrameAt = performance.now();
    this.lastInvaderMove = performance.now();
    this.lastWaveSpawn = performance.now();
    
    // Notify about reset
    this.onScoreUpdate?.(this.score);
    this.onWaveChange?.(this.wave);
  }
  
  /**
   * Update game state for one frame
   */
  update(dt: number, now: number, keys: { left: boolean; right: boolean }): void {
    if (this.state !== "running") return;
    
    // Update difficulty based on wave
    this.difficulty = 1 + (this.wave * this.config.difficultyCurve);
    this.invaderShootChancePerSec = 0.3 * this.difficulty;
    this.invaderSpeed = this.config.invaderSpeed + (this.wave * 0.5);
    
    // Player movement from keyboard
    let move = 0;
    if (keys.left) move -= 1;
    if (keys.right) move += 1;
    this.player.pos.x += move * this.player.speed * dt;
    this.player.pos.x = clamp(this.player.pos.x, 0, this.canvasWidth - this.player.w);
    
    // Auto-fire
    this.spawnPlayerBullet(now);
    
    // Check if we need new wave
    const aliveInvs = this.invaders.filter((i) => i.alive);
    if (aliveInvs.length === 0 || (now - this.lastWaveSpawn > 8000 && aliveInvs.length < 3)) {
      this.spawnNewWave();
    }
    
    // GENTLE invader movement - very slow descent instead of bouncing
    for (const inv of aliveInvs) {
      // Very slow downward movement (0.5-2 pixels per second)
      const downwardSpeed = 10 + (this.difficulty * 2);
      inv.pos.y += downwardSpeed * dt;
    }
    
    // Also move them slightly side-to-side for visual interest (very slow)
    if (now - this.lastInvaderMove > 2000) {
      this.invaderDir = (this.invaderDir === 1 ? -1 : 1) as 1 | -1;
      this.lastInvaderMove = now;
    }
    
    for (const inv of aliveInvs) {
      // Very slow side movement (10-20 pixels per second)
      const sideSpeed = 15 + (this.difficulty * 3);
      inv.pos.x += this.invaderDir * sideSpeed * dt;
      
      // Keep within bounds gently
      if (inv.pos.x < this.boundsPadding) inv.pos.x = this.boundsPadding;
      if (inv.pos.x + inv.w > this.canvasWidth - this.boundsPadding) {
        inv.pos.x = this.canvasWidth - this.boundsPadding - inv.w;
      }
    }
    
    // Check if invaders reached player (gentle check)
    let maxY = -Infinity;
    for (const inv of aliveInvs) {
      maxY = Math.max(maxY, inv.pos.y + inv.h);
    }
    
    if (maxY >= this.player.pos.y - 10) {
      this.gameOver();
      return;
    }
    
    // Invader shooting - VERY low chance that increases slowly
    const chance = this.invaderShootChancePerSec * dt * 0.5;
    if (Math.random() < chance) this.spawnInvaderBullet();
    
    // Update bullets (slower bullets)
    for (const b of this.bullets) {
      if (!b.alive) continue;
      // Slower bullets for relaxed gameplay
      const bulletSpeed = b.from === "player" ? -this.config.bulletSpeed : 120;
      b.pos.y += bulletSpeed * dt;
      if (b.pos.y < -40 || b.pos.y > this.canvasHeight + 40) b.alive = false;
    }
    
    // Collisions: player bullets vs invaders
    for (const b of this.bullets) {
      if (!b.alive || b.from !== "player") continue;
      for (const inv of this.invaders) {
        if (!inv.alive) continue;
        if (aabb(b.pos.x, b.pos.y, b.w, b.h, inv.pos.x, inv.pos.y, inv.w, inv.h)) {
          inv.alive = false;
          b.alive = false;
          this.score += inv.points;
          this.onScoreUpdate?.(this.score);
          break;
        }
      }
    }
    
    // Collisions: invader bullets vs player
    for (const b of this.bullets) {
      if (!b.alive || b.from !== "invader") continue;
      if (aabb(b.pos.x, b.pos.y, b.w, b.h, this.player.pos.x, this.player.pos.y, this.player.w, this.player.h)) {
        b.alive = false;
        this.player.lives -= 1;
        if (this.player.lives <= 0) {
          this.gameOver();
          return;
        }
      }
    }
    
    // Cleanup dead bullets
    this.bullets = this.bullets.filter((b) => b.alive);
  }
  
  /**
   * Spawn a new wave of invaders
   */
  private spawnNewWave(): void {
    const newWave = this.wave + 1;
    const invaderSize = this.isMobile ? 28 : 32;
    
    // Gentle wave spawning - fewer invaders that fill from above
    const baseInvaders = this.isMobile ? 4 : 6;
    const waveBonus = Math.min(10, Math.floor(newWave / 3));
    const invadersToAdd = baseInvaders + waveBonus;
    
    const topOffset = this.isMobile ? 80 : 70;
    
    // Clear dead invaders and add new ones
    this.invaders = this.invaders.filter(inv => inv.alive);
    
    // Add new invaders in a gentle pattern
    const cols = Math.min(6, Math.ceil(Math.sqrt(invadersToAdd)));
    const rows = Math.ceil(invadersToAdd / cols);
    const gridW = cols * invaderSize + (cols - 1) * 20;
    const startX = Math.max(20, (this.canvasWidth - gridW) / 2);
    
    for (let i = 0; i < invadersToAdd; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      this.invaders.push({
        w: invaderSize,
        h: invaderSize,
        alive: true,
        emoji: getEmojiForWave(newWave),
        points: 10 + row * 3,
        shootChance: 0.02 + Math.min(0.15, newWave * 0.005),
        pos: {
          x: startX + col * (invaderSize + 20),
          y: topOffset + row * (invaderSize + 15),
        },
      });
    }
    
    this.wave = newWave;
    this.lastWaveSpawn = performance.now();
    this.onWaveChange?.(this.wave);
  }
  
  /**
   * Spawn a bullet from the player
   */
  private spawnPlayerBullet(now: number): void {
    if (now - this.player.lastShotAt < this.player.cooldownMs) return;
    this.player.lastShotAt = now;
    this.bullets.push({
      from: "player",
      alive: true,
      w: 4,
      h: 10,
      pos: {
        x: this.player.pos.x + this.player.w / 2 - 2,
        y: this.player.pos.y - 12,
      },
      vel: { x: 0, y: -this.config.bulletSpeed },
    });
  }
  
  /**
   * Spawn a bullet from a random invader
   */
  private spawnInvaderBullet(): void {
    const alive = this.invaders.filter((i) => i.alive);
    if (alive.length === 0) return;
    
    const shooter = alive[Math.floor(Math.random() * alive.length)];
    if (Math.random() > shooter.shootChance) return;
    
    this.bullets.push({
      from: "invader",
      alive: true,
      w: 4,
      h: 10,
      pos: {
        x: shooter.pos.x + shooter.w / 2 - 2,
        y: shooter.pos.y + shooter.h + 2,
      },
      vel: { x: (Math.random() - 0.5) * 40, y: 320 },
    });
  }
  
  /**
   * End the game
   */
  private gameOver(): void {
    this.state = "lost";
    this.onGameOver?.(this.score);
  }
  
  /**
   * Pause the game
   */
  pause(): void {
    if (this.state === "running") {
      this.state = "paused";
    }
  }
  
  /**
   * Resume the game
   */
  resume(): void {
    if (this.state === "paused") {
      this.state = "running";
      this.lastFrameAt = performance.now();
    }
  }
  
  /**
   * Update canvas size (for responsive resizing)
   */
  updateCanvasSize(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.isMobile = width < 500;
    
    // Adjust player position
    this.player.pos.x = Math.min(this.player.pos.x, width - this.player.w);
    this.player.pos.y = Math.min(this.player.pos.y, height - this.player.h);
    
    // Adjust invaders
    this.invaders.forEach(inv => {
      inv.pos.x = Math.min(inv.pos.x, width - inv.w);
      inv.pos.y = Math.min(inv.pos.y, height - inv.h);
    });
    
    // Adjust bullets
    this.bullets = this.bullets.filter(b => b.pos.y >= 0 && b.pos.y <= height);
  }
  
  // Getters for game state
  getState(): GameState { return this.state; }
  getScore(): number { return this.score; }
  getWave(): number { return this.wave; }
  getLives(): number { return this.player.lives; }
  getPlayer(): Player { return this.player; }
  getInvaders(): Invader[] { return this.invaders; }
  getBullets(): Bullet[] { return this.bullets; }
  getCanvasWidth(): number { return this.canvasWidth; }
  getCanvasHeight(): number { return this.canvasHeight; }
  getIsMobile(): boolean { return this.isMobile; }
}