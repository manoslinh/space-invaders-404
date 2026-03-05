/**
 * 404 Page Example using SpaceInvaders404 Component
 * 
 * This demonstrates how to use the game component in a 404 page context.
 * The game is container-agnostic - it doesn't know it's on a 404 page.
 */

import React from 'react';
import { SpaceInvaders404, difficultyPresets } from '../../src';

export function NotFoundPage() {
  const handleGameOver = (score: number) => {
    console.log(`Game over! Final score: ${score}`);
    // You could submit to a leaderboard, analytics, etc.
  };

  const handleScoreUpdate = (score: number) => {
    // Optional: Update some UI with current score
    // console.log(`Current score: ${score}`);
  };

  const handleWaveChange = (wave: number) => {
    // Optional: React to wave changes
    // console.log(`New wave: ${wave}`);
  };

  return (
    <div style={styles.container}>
      {/* 404 Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>404 👾</h1>
        <p style={styles.subtitle}>
          Page not found. But while you're here, enjoy a quick arcade game!
        </p>
        <p style={styles.instructions}>
          Drag or use arrow keys to move • R to restart • Click outside game to pause
        </p>
      </header>

      {/* Game Container */}
      <div style={styles.gameContainer}>
        <SpaceInvaders404
          // Use relaxed difficulty for a casual 404 experience
          {...difficultyPresets.relaxed}
          // Optional callbacks
          onGameOver={handleGameOver}
          onScoreUpdate={handleScoreUpdate}
          onWaveChange={handleWaveChange}
          // Visual customization
          theme="dark"
          showHighScore={true}
          // Container styling
          style={{
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          }}
          // Optional: Fixed dimensions or responsive
          // width={800}
          // height={500}
        />
      </div>

      {/* Navigation Links */}
      <nav style={styles.navigation}>
        <a href="/" style={styles.link}>🏠 Home</a>
        <span style={styles.separator}>|</span>
        <a href="/projects" style={styles.link}>🚀 Projects</a>
        <span style={styles.separator}>|</span>
        <a href="/about" style={styles.link}>👤 About</a>
        <span style={styles.separator}>|</span>
        <a href="/contact" style={styles.link}>📧 Contact</a>
      </nav>

      {/* Additional Info */}
      <div style={styles.info}>
        <p style={styles.infoText}>
          This game is built with React + Canvas. Your high score is saved locally.
          Want to add this to your site? Check out the{' '}
          <a 
            href="https://github.com/manoslinh/space-invaders-404" 
            style={styles.githubLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repository
          </a>.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: '#e2e8f0',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    maxWidth: '800px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold' as const,
    margin: '0 0 10px 0',
    background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1.2rem',
    margin: '0 0 15px 0',
    opacity: 0.9,
  },
  instructions: {
    fontSize: '0.9rem',
    margin: '0',
    opacity: 0.7,
    fontFamily: 'monospace',
  },
  gameContainer: {
    width: '100%',
    maxWidth: '800px',
    height: '500px',
    marginBottom: '30px',
  },
  navigation: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '30px',
  },
  link: {
    color: '#60a5fa',
    textDecoration: 'none' as const,
    fontSize: '1rem',
    transition: 'color 0.2s',
    ':hover': {
      color: '#93c5fd',
      textDecoration: 'underline' as const,
    },
  },
  separator: {
    color: '#475569',
  },
  info: {
    maxWidth: '600px',
    textAlign: 'center' as const,
  },
  infoText: {
    fontSize: '0.9rem',
    lineHeight: 1.6,
    opacity: 0.8,
  },
  githubLink: {
    color: '#a78bfa',
    textDecoration: 'none' as const,
    fontWeight: 'bold' as const,
    ':hover': {
      textDecoration: 'underline' as const,
    },
  },
};

export default NotFoundPage;