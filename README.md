# Space Invaders 404 🚀👾

**A container-agnostic Space Invaders game component that can be embedded anywhere.**

Perfect for:
- **404 Pages** - Turn "page not found" into fun
- **Landing Pages** - Interactive engagement
- **Widgets** - Sidebar games or Easter eggs
- **Documentation** - Playful examples
- **Portfolios** - Showcase your skills

![Space Invaders 404 Game](https://github.com/manoslinh/space-invaders-404/raw/main/screenshot.png)

## 🎯 What We're Building

A **standalone, reusable game component** with:
- **Zero dependencies** on page context (doesn't know about 404 pages)
- **Mobile-first** design with touch controls
- **Pure separation** of game logic, rendering, and UI
- **Easy customization** - themes, difficulty, callbacks
- **Multiple integration options** - React, vanilla JS, frameworks

### Architecture Philosophy
```
404 Page Example (just one use case)
         ↓
   SpaceInvaders404 Component (container-agnostic)
         ↓
   ┌─────────────────────┐
   │  Game Engine        │ ← Pure logic
   │  Canvas Renderer    │ ← Pure drawing  
   └─────────────────────┘
```

The game component doesn't care where it's used. A 404 page is just one example.

## ✨ Features

### 🎮 Core Gameplay
- **Full Space Invaders Experience** - Shoot invaders, avoid bullets, survive waves
- **Progressive Difficulty** - Gets slightly harder each wave (configurable)
- **High Score Persistence** - LocalStorage keeps your best score
- **Multiple Control Schemes** - Keyboard, mouse drag, touch controls

### 📱 Mobile-First Design
- **Touch-Optimized** - Drag controls work perfectly on mobile
- **Responsive Canvas** - Adapts to container size
- **Mobile-Specific UI** - Larger touch targets, simplified instructions
- **Performance Optimized** - Smooth 60fps on mobile devices

### 🎨 Visual & Customization
- **Emoji Invaders** - Starts with classic 👾, transitions to random emojis
- **Theme Support** - Dark/light modes with customizable colors
- **Configurable Difficulty** - Presets from "relaxed" to "insane"
- **Extensible Architecture** - Replace emojis, add power-ups, customize HUD

### ⚡ Technical Excellence
- **Zero Runtime Dependencies** - Pure React + Canvas
- **TypeScript First** - Full type safety and IntelliSense
- **Separation of Concerns** - Game logic ≠ Rendering ≠ Component
- **Tree Shakable** - Only bundle what you use

## 🚧 Development Status

**Current Phase**: Core architecture complete, package setup in progress

### ✅ Completed
- Game engine (pure logic)
- Canvas renderer (pure drawing)  
- React component (container-agnostic)
- TypeScript types and utilities
- 404 page example
- Comprehensive documentation

### 🚧 In Progress
- Package configuration (`package.json`, build setup)
- Vanilla JS version
- Testing suite
- CI/CD pipeline

### 📋 Coming Soon
- npm package publication
- More framework examples (Vue, Svelte)
- Advanced customization options
- Performance optimizations

See [TODO.md](./TODO.md) for detailed progress tracking.

---

## 🚀 Quick Start

*Note: Package not yet published to npm. Currently in development.*

### Installation

```bash
npm install space-invaders-404
# or
yarn add space-invaders-404
# or
pnpm add space-invaders-404
```

### Basic Usage (React/Next.js)

```jsx
import { SpaceInvaders404 } from 'space-invaders-404';

function NotFoundPage() {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>But while you're here, enjoy a quick arcade game!</p>
      
      <SpaceInvaders404 />
      
      <div className="navigation">
        <a href="/">Home</a>
        <a href="/contact">Contact</a>
      </div>
    </div>
  );
}
```

### Standalone HTML Version

```html
<!DOCTYPE html>
<html>
<head>
  <title>404 - Space Invaders</title>
  <style>
    body { 
      margin: 0; 
      background: #0f172a; 
      color: white; 
      font-family: system-ui;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
    }
    canvas { 
      border: 2px solid #334155; 
      border-radius: 8px; 
      max-width: 100%;
    }
  </style>
</head>
<body>
  <h1>404 👾</h1>
  <p>Page not found. Enjoy the game!</p>
  
  <canvas id="gameCanvas" width="800" height="500"></canvas>
  
  <script type="module">
    import { initGame } from 'space-invaders-404/vanilla';
    const canvas = document.getElementById('gameCanvas');
    initGame(canvas);
  </script>
  
  <p><a href="/">← Back home</a></p>
</body>
</html>
```

## 🎮 Game Controls

- **← → Arrow Keys** or **A/D** - Move spaceship
- **Drag/Touch** - Move spaceship (mobile/touch devices)
- **R** - Restart game
- **Click outside canvas** - Pause game
- **Click on canvas** - Resume game

## ⚙️ Configuration

The component accepts props for customization:

```jsx
<SpaceInvaders404
  width={800}           // Canvas width
  height={500}          // Canvas height
  playerLives={3}       // Starting lives
  playerSpeed={420}     // Movement speed
  invaderSpeed={40}     // Initial invader speed
  bulletSpeed={520}     // Player bullet speed
  difficultyCurve={0.05} // 5% increase per wave
  showHighScore={true}  // Display high score
  theme="dark"          // 'dark' or 'light'
  onGameOver={(score) => {
    console.log(`Game over! Score: ${score}`);
  }}
/>
```

## 🎨 Theming

### CSS Custom Properties

```css
:root {
  --si404-bg: #0f172a;
  --si404-text: #ffffff;
  --si404-border: #334155;
  --si404-player: #1e90ff;
  --si404-invader: #ff4757;
  --si404-bullet-player: #1e90ff;
  --si404-bullet-invader: #ff4757;
  --si404-score: #ffd700;
}
```

### Custom Styling

Wrap the component and style it:

```jsx
<div className="game-wrapper">
  <SpaceInvaders404 />
</div>

<style jsx>{`
  .game-wrapper {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }
`}</style>
```

## 🔧 Advanced Customization

### Custom Emoji Set

```jsx
import { SpaceInvaders404, setCustomEmojis } from 'space-invaders-404';

// Replace the default emoji progression
setCustomEmojis([
  '👾', '👽', '🤖', '🦾', '🦿',  // Tech/robot theme
  '🐙', '🦑', '🦀', '🐡', '🐬',  // Sea creature theme
  '🍕', '🍔', '🌭', '🥨', '🍩',  // Food theme
]);

function NotFoundPage() {
  return <SpaceInvaders404 />;
}
```

### Difficulty Presets

```jsx
import { SpaceInvaders404, difficultyPresets } from 'space-invaders-404';

function NotFoundPage() {
  return (
    <SpaceInvaders404
      {...difficultyPresets.relaxed}    // Very easy, casual
      // {...difficultyPresets.normal}   // Balanced (default)
      // {...difficultyPresets.challenging} // Harder
      // {...difficultyPresets.insane}   // Very difficult
    />
  );
}
```

### Custom Game Over Screen

```jsx
import { SpaceInvaders404 } from 'space-invaders-404';

function CustomGameOver({ score, highScore, onRestart }) {
  return (
    <div className="custom-game-over">
      <h2>Mission Failed! 🚀</h2>
      <p>Your score: <strong>{score}</strong></p>
      <p>High score: <strong>{highScore}</strong></p>
      <button onClick={onRestart}>Try Again</button>
    </div>
  );
}

function NotFoundPage() {
  return (
    <SpaceInvaders404
      renderGameOver={(props) => <CustomGameOver {...props} />}
    />
  );
}
```

## 📱 Mobile Considerations

The game automatically:
- Adjusts canvas size for mobile screens
- Switches to touch controls
- Optimizes font sizes and spacing
- Removes pause functionality (mobile users don't need it)
- Changes "Press R to restart" to "Tap anywhere to restart"

For best mobile experience:
```jsx
<SpaceInvaders404
  mobileBreakpoint={768} // Switch to mobile mode below this width
  touchSensitivity={1.5} // Adjust touch responsiveness
/>
```

## 🎯 Performance

- Uses `requestAnimationFrame` for smooth 60fps animation
- Game state managed with `useRef` to avoid re-renders every frame
- Canvas operations optimized for mobile devices
- No unnecessary re-renders of React components

## 🔌 Integration Examples

### Next.js App Router

```jsx
// app/not-found.tsx
import { SpaceInvaders404 } from 'space-invaders-404';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">404 👾</h1>
      <p className="text-lg mb-8">Page not found. Enjoy the game!</p>
      
      <div className="w-full max-w-4xl">
        <SpaceInvaders404 />
      </div>
      
      <div className="mt-8 space-x-4">
        <a href="/" className="text-blue-400 hover:text-blue-300">Home</a>
        <a href="/projects" className="text-blue-400 hover:text-blue-300">Projects</a>
        <a href="/contact" className="text-blue-400 hover:text-blue-300">Contact</a>
      </div>
    </div>
  );
}
```

### Gatsby

```jsx
// src/pages/404.js
import React from 'react';
import { SpaceInvaders404 } from 'space-invaders-404';

const NotFoundPage = () => (
  <div style={{ 
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
  }}>
    <SpaceInvaders404 />
  </div>
);

export default NotFoundPage;
```

### Vue.js (via wrapper)

```vue
<template>
  <div class="not-found">
    <h1>404 👾</h1>
    <div ref="gameContainer"></div>
  </div>
</template>

<script>
import { mountGame } from 'space-invaders-404/vue';

export default {
  mounted() {
    mountGame(this.$refs.gameContainer);
  }
};
</script>
```

## 🛠️ Development

### Clone and Run

```bash
git clone https://github.com/manoslinh/space-invaders-404.git
cd space-invaders-404
npm install
npm run dev
```

### Project Structure

```
space-invaders-404/
├── src/
│   ├── components/
│   │   └── SpaceInvaders404.tsx    # Main React component
│   ├── lib/
│   │   ├── game-engine.ts          # Core game logic
│   │   ├── canvas-renderer.ts      # Canvas drawing
│   │   └── utils.ts                # Utilities
│   ├── vanilla/
│   │   └── index.ts                # Vanilla JS version
│   └── vue/
│       └── wrapper.vue             # Vue.js wrapper
├── examples/                       # Example implementations
├── tests/                          # Test files
└── package.json
```

### Building

```bash
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Lint code
```

## 🏗️ Development

### Current Branch: `develop`
We follow Git Flow:
- `main` - Production releases only
- `develop` - Integration branch for features
- Feature branches - `feature/*` for new work

### Getting Started for Development
```bash
# Clone and checkout develop branch
git clone https://github.com/manoslinh/space-invaders-404.git
cd space-invaders-404
git checkout develop

# After package setup is complete:
npm install
npm run dev  # Start development server
```

See [TODO.md](./TODO.md) for detailed development roadmap.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs** - Open an issue with steps to reproduce
2. **Suggest Features** - Share your ideas for improvements
3. **Submit Pull Requests** - Fix bugs or add features
4. **Improve Documentation** - Help make the docs better

### Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/space-invaders-404.git
cd space-invaders-404

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📄 License

MIT © Emmanouil Mandrakis

## 🙏 Acknowledgments

- Inspired by classic Space Invaders (1978)
- Built with React + Canvas
- Emoji support from Unicode Consortium
- Thanks to all contributors and testers!

## 🔗 Links

- [GitHub Repository](https://github.com/manoslinh/space-invaders-404)
- [npm Package](https://www.npmjs.com/package/space-invaders-404)
- [Issue Tracker](https://github.com/manoslinh/space-invaders-404/issues)
- [Demo](https://space-invaders-404.vercel.app)

---

Made with 👾 by [Emmanouil Mandrakis](https://github.com/manoslinh)