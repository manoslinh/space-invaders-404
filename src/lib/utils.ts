/**
 * Utility functions for Space Invaders 404 game
 */

/**
 * Clamp a value between min and max
 */
export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Axis-aligned bounding box collision detection
 */
export function aabb(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

/**
 * Get emoji for current wave
 * All invaders start as 👾, then gradually transition to random emojis
 */
export function getEmojiForWave(wave: number): string {
  // Wave 1-3: All invaders are 👾
  if (wave <= 3) return "👾";
  
  // After wave 3, start mixing in random emojis
  // Curated list of fun emojis (no flags)
  const allEmojis = [
    // Space & tech
    "👽", "🛸", "🚀", "🪐", "🌠", "⭐", "🌟", "☄️", "🌌", "🛰️", "🤖", "🔭", "🌙", "☀️", "🪐",
    // Animals
    "🐙", "🦑", "🦀", "🐡", "🐬", "🐳", "🦈", "🐊", "🦖", "🐉", "🦅", "🦉", "🦇", "🐺", "🦊",
    "🐯", "🦁", "🐮", "🐷", "🐭", "🐹", "🐰", "🐻", "🐨", "🐼", "🐸", "🐵",
    // Food
    "🍕", "🍔", "🌭", "🥨", "🍩", "🍪", "🎂", "🍦", "🍫", "🍿", "🍎", "🍌", "🍇", "🍓", "🥑",
    // Objects
    "📱", "💻", "🕹️", "🎮", "🎸", "🎺", "🎨", "📚", "✏️", "🔑", "💡", "⏰", "💰", "💎", "🎁",
    // Faces
    "😀", "😎", "🤓", "😜", "🤪", "😈", "👻", "💀", "🤡", "👹", "👺",
    // Vehicles
    "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛵", "🚲",
    // More fun ones
    "🦄", "🧙", "🧚", "🧛", "🧜", "🧝", "🦹", "🦸", "🧞", "🧟", "🎃", "🎅", "🤶", "🧑‍🎄",
    "👰", "🤵", "🧑‍🚀", "🧑‍🚒", "🧑‍🌾", "🧑‍🍳", "🧑‍🎓", "🧑‍🎤", "🧑‍🏫", "🧑‍🏭", "🧑‍💻",
    "🦋", "🐞", "🦂", "🦗", "🕷️", "🦉", "🦚", "🦜", "🦢", "🦩"
  ];
  
  // Calculate ratio: more waves = more random emojis, fewer 👾
  const maxWaveForTransition = 20;
  const transitionProgress = Math.min(1, (wave - 3) / (maxWaveForTransition - 3));
  
  // Early waves: mostly 👾 with some random
  // Later waves: mostly random with some 👾
  if (Math.random() < (1 - transitionProgress * 0.8)) {
    return "👾";
  } else {
    return allEmojis[Math.floor(Math.random() * allEmojis.length)];
  }
}

/**
 * Generate a random player name
 */
export function generateRandomName(): string {
  const adjectives = ["Galactic", "Cosmic", "Stellar", "Nebula", "Quantum", "Solar", "Lunar", "Orbital", "Celestial", "Astral"];
  const nouns = ["Voyager", "Explorer", "Pioneer", "Guardian", "Defender", "Champion", "Hero", "Warrior", "Captain", "Commander"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun}`;
}

/**
 * Get high score from localStorage
 */
export function getHighScore(): number {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem("spaceInvadersHighScore");
    return saved ? parseInt(saved, 10) : 0;
  }
  return 0;
}

/**
 * Save high score to localStorage
 */
export function saveHighScore(score: number): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem("spaceInvadersHighScore", score.toString());
  }
}

/**
 * Default game configuration
 */
export const defaultConfig = {
  playerLives: 3,
  playerSpeed: 420,
  invaderSpeed: 40,
  bulletSpeed: 520,
  difficultyCurve: 0.05, // 5% increase per wave
  theme: "dark" as const,
  showHighScore: true,
};

/**
 * Difficulty presets
 */
export const difficultyPresets = {
  relaxed: {
    playerLives: 5,
    playerSpeed: 380,
    invaderSpeed: 30,
    bulletSpeed: 450,
    difficultyCurve: 0.03,
  },
  normal: defaultConfig,
  challenging: {
    playerLives: 3,
    playerSpeed: 460,
    invaderSpeed: 60,
    bulletSpeed: 580,
    difficultyCurve: 0.08,
  },
  insane: {
    playerLives: 1,
    playerSpeed: 500,
    invaderSpeed: 80,
    bulletSpeed: 650,
    difficultyCurve: 0.12,
  },
};