/**
 * DELTA SYNTH — Theme & Design System Constants
 * 
 * Complies with AGENT.md:
 * - Font: Leelawadee UI / Kanit / Inter
 * - Primary: #CC2200
 * - Dark: #1A1A1A
 * - Light: #F0F0F0
 * - Hover: #FF4422
 * - Pressed: #991100
 * - Highlight: #CC2200
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

export const THEME = {
  colors: {
    primary: '#CC2200',
    primaryHover: '#FF4422',
    primaryPressed: '#991100',
    primaryHighlight: '#CC2200',
    bgDark: '#1A1A1A',
    bgDarker: '#0D0D0D',
    bgCard: 'rgba(26, 26, 26, 0.85)',
    bgGlass: 'rgba(26, 26, 26, 0.70)',
    borderDark: '#2D2D2D',
    borderGlow: 'rgba(204, 34, 0, 0.4)',
    textLight: '#F0F0F0',
    textMuted: '#A0A0A0',
    textDark: '#1A1A1A',
    success: '#00C853',
    warning: '#FFD600',
    error: '#D50000',
    info: '#00B0FF'
  },
  fonts: {
    primary: 'Leelawadee UI, Kanit, Inter, sans-serif',
    heading: 'Leelawadee UI, Kanit, sans-serif',
    monospace: 'Consolas, "Courier New", monospace'
  },
  toast: {
    maxWidth: 280,
    maxHeight: 80,
    offsetRight: 16,
    offsetBottom: 20,
    borderRadius: 6,
    durationMs: 3500
  },
  animation: {
    durationFast: 200,
    durationNormal: 350,
    durationSlow: 500,
    easing: 'ease-in-out'
  }
};

export default THEME;
