/**
 * DELTA SYNTH — Theme & Design System Constants (SPACE EDITION)
 * 
 * Theme: Outer Space / Cosmic
 * Palette: Deep Space Black · Starfield White · Nebula Red · Cosmic Blue
 * Background: Vast starfield / nebula sky
 * 
 * Complies with AGENT.md:
 * - Font: Leelawadee UI / Kanit / Inter
 * - Primary: #CC2200 (Nebula Red)
 * - Dark: #1A1A1A (Deep Space)
 * - Light: #F0F0F0 (Starlight White)
 * - Hover: #FF4422 (Solar Flare)
 * - Pressed: #991100 (Dying Star)
 * - Highlight: #CC2200 (Supernova Core)
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

export const THEME = {
  colors: {
    // --- Core Palette ---
    primary: '#CC2200',            // Nebula Red — signature accent
    primaryHover: '#FF4422',       // Solar Flare — hover state
    primaryPressed: '#991100',     // Dying Star — pressed/active
    primaryHighlight: '#CC2200',   // Supernova Core — glow/highlight

    // --- Backgrounds (Space / Starfield) ---
    bgDark: '#0A0A12',             // Deep Space — near-black with hint of indigo
    bgDarker: '#050508',           // Event Horizon — deepest void
    bgCard: 'rgba(10, 10, 18, 0.85)',     // Glassmorphism card over stars
    bgGlass: 'rgba(10, 10, 18, 0.70)',    // Semi-transparent space glass
    bgSpace: 'linear-gradient(180deg, #0A0A1F 0%, #1A0B2E 50%, #2D1B4E 100%)', // Cosmic sky gradient
    bgNebula: 'radial-gradient(ellipse at 30% 20%, rgba(204,34,0,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0,176,255,0.10) 0%, transparent 50%)', // Nebula glow overlay

    // --- Borders ---
    borderDark: '#1E1E2A',         // Subtle space station panel seam
    borderGlow: 'rgba(204, 34, 0, 0.4)',   // Red-rimmed nebula glow
    borderStar: 'rgba(240, 240, 240, 0.15)', // Faint starlight border

    // --- Text ---
    textLight: '#F0F0F0',          // Starlight White
    textMuted: '#8A8AA0',          // Distant Galaxy Grey
    textDark: '#0A0A12',           // Void Black
    textCosmic: '#E0E0FF',         // Soft Cosmic Lavender

    // --- Status ---
    success: '#00E676',            // Green Nebula
    warning: '#FFD600',            // Yellow Dwarf Star
    error: '#FF1744',              // Red Giant
    info: '#00B0FF',               // Blue Supergiant

    // --- Cosmic Accents ---
    starWhite: '#FFFFFF',          // Bright Star
    starYellow: '#FFF9C4',         // Warm Star
    starBlue: '#B3E5FC',           // Blue Giant
    nebulaPurple: '#B388FF',       // Purple Nebula
    nebulaPink: '#FF4081',         // Pink Nebula
    dustCloud: 'rgba(255,255,255,0.05)', // Cosmic Dust
    galaxyCore: 'rgba(204, 34, 0, 0.6)',  // Red Galactic Core
    eventHorizon: '#000000'        // True Black Void
  },

  // --- Space Effect Tokens (for CSS / canvas rendering) ---
  effects: {
    starfield: {
      count: 120,
      minSize: 0.5,
      maxSize: 2.5,
      twinkleSpeed: 2000
    },
    nebulaGlow: '0 0 20px rgba(204, 34, 0, 0.3)',
    starGlow: '0 0 6px rgba(255, 255, 255, 0.8)',
    cosmicDropShadow: '0 4px 24px rgba(0, 0, 0, 0.7)',
    textGlow: '0 0 8px rgba(240, 240, 240, 0.4)'
  },

  fonts: {
    primary: 'Leelawadee UI, Kanit, Inter, sans-serif',
    heading: 'Leelawadee UI, Kanit, sans-serif',
    monospace: 'Consolas, "Courier New", monospace',
    cosmic: '"Orbitron", "Exo 2", Leelawadee UI, Kanit, sans-serif'  // Sci-fi font for space labels
  },

  toast: {
    maxWidth: 280,
    maxHeight: 80,
    offsetRight: 16,
    offsetBottom: 20,
    borderRadius: 6,
    durationMs: 3500,
    bg: 'rgba(10, 10, 18, 0.92)',     // Space-glass toast
    borderColor: 'rgba(204, 34, 0, 0.4)'
  },

  animation: {
    durationFast: 200,
    durationNormal: 350,
    durationSlow: 500,
    easing: 'ease-in-out',
    twinkle: 'cosmicTwinkle 2s ease-in-out infinite',
    float: 'cosmicFloat 6s ease-in-out infinite',
    glowPulse: 'cosmicGlowPulse 3s ease-in-out infinite'
  },

  // --- CSS Keyframes (inject into stylesheet) ---
  keyframes: `
    @keyframes cosmicTwinkle {
      0%, 100% { opacity: 0.3; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    @keyframes cosmicFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    @keyframes cosmicGlowPulse {
      0%, 100% { box-shadow: 0 0 8px rgba(204, 34, 0, 0.3); }
      50% { box-shadow: 0 0 24px rgba(204, 34, 0, 0.6); }
    }
  `
};

export default THEME;
