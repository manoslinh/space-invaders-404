/**
 * Canvas Renderer for Space Invaders 404
 * 
 * Handles all drawing operations to the canvas, separated from game logic.
 */

import type { GameEngine } from './game-engine';
import { getHighScore } from './utils';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private theme: "dark" | "light";
  private showHighScore: boolean;
  private highScore: number = 0;
  
  constructor(
    ctx: CanvasRenderingContext2D,
    theme: "dark" | "light" = "dark",
    showHighScore: boolean = true
  ) {
    this.ctx = ctx;
    this.theme = theme;
    this.showHighScore = showHighScore;
    this.highScore = getHighScore();
  }
  
  /**
   * Draw the entire game frame
   */
  draw(game: GameEngine): void {
    const w = game.getCanvasWidth();
    const h = game.getCanvasHeight();
    const isMobile = game.getIsMobile();
    const state = game.getState();
    
    // Clear canvas with theme-appropriate background
    this.clearCanvas(w, h);
    
    // Draw stars/background
    this.drawStars(w, h);
    
    // Draw HUD (score, lives, wave)
    this.drawHUD(game, w, h, isMobile);
    
    // Draw game entities
    this.drawPlayer(game.getPlayer());
    this.drawInvaders(game.getInvaders());
    this.drawBullets(game.getBullets());
    
    // Draw game over overlay if needed
    if (state === "lost") {
      this.drawGameOver(game.getScore(), w, h, isMobile);
    }
    
    // Update high score if needed
    const score = game.getScore();
    if (score > this.highScore) {
      this.highScore = score;
    }
  }
  
  /**
   * Clear the canvas with theme-appropriate background
   */
  private clearCanvas(w: number, h: number): void {
    if (this.theme === "dark") {
      this.ctx.fillStyle = "#0f172a"; // Dark blue-black
    } else {
      this.ctx.fillStyle = "#f8fafc"; // Light slate
    }
    this.ctx.fillRect(0, 0, w, h);
  }
  
  /**
   * Draw starfield background
   */
  private drawStars(w: number, h: number): void {
    this.ctx.fillStyle = this.theme === "dark" ? "#999" : "#666";
    this.ctx.globalAlpha = 0.35;
    for (let i = 0; i < 60; i++) {
      const x = ((i * 97) % 997) % w;
      const y = ((i * 193) % 991) % h;
      this.ctx.fillRect(x, y, 1, 1);
    }
    this.ctx.globalAlpha = 1;
  }
  
  /**
   * Draw HUD (score, lives, wave, high score)
   */
  private drawHUD(game: GameEngine, w: number, h: number, isMobile: boolean): void {
    const score = game.getScore();
    const wave = game.getWave();
    const lives = game.getLives();
    const difficulty = 1 + (wave * 0.05); // Simplified difficulty calculation
    
    // Set text properties based on theme
    this.ctx.fillStyle = this.theme === "dark" ? "#e2e8f0" : "#1e293b";
    this.ctx.textAlign = "left";
    
    const leftMargin = 20;
    let currentY = 30;
    
    // Title - 404 with emoji
    this.ctx.font = "bold 16px system-ui, -apple-system, Segoe UI, Roboto, 'Segoe UI Emoji', 'Apple Color Emoji'";
    this.ctx.textBaseline = "top";
    this.ctx.fillText(`Space Invaders 👾`, leftMargin, currentY);
    currentY += 40;
    
    // Score - with emoji
    this.ctx.font = "18px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(`🏆 ${score}`, leftMargin, currentY);
    currentY += 32;
    
    // Lives - with emoji
    this.ctx.fillText(`❤️ ${lives}`, leftMargin, currentY);
    currentY += 32;
    
    // High score if enabled
    if (this.showHighScore) {
      this.ctx.fillText(`⭐ ${Math.max(score, this.highScore)}`, leftMargin, currentY);
      currentY += 32;
    }
    
    // Wave and difficulty - smaller
    this.ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto";
    this.ctx.textBaseline = "top";
    this.ctx.fillText(`Wave ${wave} • Diff ${difficulty.toFixed(1)}`, leftMargin, currentY);
    
    // Simple instructions at bottom
    this.ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "bottom";
    const instructions = isMobile 
      ? `Drag to move • Tap to restart` 
      : `Drag or ←→ to move • R restart`;
    const instructionsY = h - 20;
    this.ctx.fillText(instructions, w / 2, instructionsY);
  }
  
  /**
   * Draw the player's spaceship
   */
  private drawPlayer(player: any): void {
    const shipX = player.pos.x;
    const shipY = player.pos.y;
    const shipW = player.w;
    const shipH = player.h;
    
    // Main body (rounded rectangle)
    this.ctx.fillStyle = "#1e90ff";
    const radius = 8;
    this.ctx.beginPath();
    this.ctx.moveTo(shipX + radius, shipY);
    this.ctx.lineTo(shipX + shipW - radius, shipY);
    this.ctx.quadraticCurveTo(shipX + shipW, shipY, shipX + shipW, shipY + radius);
    this.ctx.lineTo(shipX + shipW, shipY + shipH - radius);
    this.ctx.quadraticCurveTo(shipX + shipW, shipY + shipH, shipX + shipW - radius, shipY + shipH);
    this.ctx.lineTo(shipX + radius, shipY + shipH);
    this.ctx.quadraticCurveTo(shipX, shipY + shipH, shipX, shipY + shipH - radius);
    this.ctx.lineTo(shipX, shipY + radius);
    this.ctx.quadraticCurveTo(shipX, shipY, shipX + radius, shipY);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Cockpit (domed)
    this.ctx.fillStyle = "#87ceeb";
    this.ctx.beginPath();
    this.ctx.ellipse(shipX + shipW/2, shipY + shipH/3, shipW/3, shipH/4, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Wings
    this.ctx.fillStyle = "#1c86ee";
    this.ctx.beginPath();
    this.ctx.moveTo(shipX - shipW * 0.15, shipY + shipH * 0.4);
    this.ctx.lineTo(shipX, shipY + shipH * 0.7);
    this.ctx.lineTo(shipX, shipY + shipH * 0.4);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.moveTo(shipX + shipW, shipY + shipH * 0.4);
    this.ctx.lineTo(shipX + shipW + shipW * 0.15, shipY + shipH * 0.4);
    this.ctx.lineTo(shipX + shipW, shipY + shipH * 0.7);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Engine glow (pulsing)
    const pulse = (Math.sin(performance.now() / 200) + 1) / 2;
    this.ctx.fillStyle = `rgba(255, 100, 100, ${0.5 + pulse * 0.3})`;
    this.ctx.beginPath();
    this.ctx.ellipse(shipX + shipW/2, shipY + shipH + 5, shipW/4, 8 + pulse * 4, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Engine nozzles
    this.ctx.fillStyle = "#333";
    this.ctx.fillRect(shipX + shipW * 0.3, shipY + shipH - 5, shipW * 0.15, 8);
    this.ctx.fillRect(shipX + shipW * 0.55, shipY + shipH - 5, shipW * 0.15, 8);
  }
  
  /**
   * Draw all invaders
   */
  private drawInvaders(invaders: any[]): void {
    this.ctx.font = "24px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    
    for (const inv of invaders) {
      if (!inv.alive) continue;
      this.ctx.fillText(inv.emoji, inv.pos.x + inv.w / 2, inv.pos.y + inv.h / 2);
    }
  }
  
  /**
   * Draw all bullets
   */
  private drawBullets(bullets: any[]): void {
    for (const b of bullets) {
      if (!b.alive) continue;
      this.ctx.fillStyle = b.from === "player" ? "#1e90ff" : "#ff4757";
      this.ctx.fillRect(b.pos.x, b.pos.y, b.w, b.h);
    }
  }
  
  /**
   * Draw game over overlay
   */
  private drawGameOver(score: number, w: number, h: number, isMobile: boolean): void {
    // Full screen dark overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.92)";
    this.ctx.fillRect(0, 0, w, h);
    
    // Reset text settings
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = "#fff";
    
    // Calculate vertical center
    const centerY = h / 2;
    
    // Game Over text
    this.ctx.font = "bold 28px system-ui, -apple-system, Segoe UI, Roboto";
    this.ctx.fillText("Game Over", w / 2, centerY - 70);
    
    // Skull emoji below
    this.ctx.font = "36px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";
    this.ctx.fillText("💀", w / 2, centerY - 30);
    
    // Final score
    this.ctx.font = "22px system-ui, -apple-system, Segoe UI, Roboto";
    this.ctx.fillText(`Final Score: ${score}`, w / 2, centerY + 10);
    
    // Restart instruction
    this.ctx.font = "18px system-ui, -apple-system, Segoe UI, Roboto";
    const restartText = isMobile ? "Tap anywhere to restart" : "Press R or tap to restart";
    this.ctx.fillText(restartText, w / 2, centerY + 50);
    
    // High score if applicable
    if (score > 0) {
      this.ctx.font = "16px system-ui, -apple-system, Segoe UI, Roboto";
      this.ctx.fillStyle = "#ffd700";
      this.ctx.fillText(`🏆 High Score: ${Math.max(score, this.highScore)}`, w / 2, centerY + 90);
    }
  }
  
  /**
   * Update high score from external source
   */
  updateHighScore(score: number): void {
    this.highScore = Math.max(this.highScore, score);
  }
}