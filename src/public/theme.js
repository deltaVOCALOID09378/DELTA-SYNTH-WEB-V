/**
 * DELTA SYNTH — Theme & Design System Constants
 * 
 * Complies with AGENT.md:
 * - Font: Leelawadee UI / Kanit / Inter
 * - Primary: #9075FF
 * - Dark: #0A0B16
 * - Light: #F4F2FB
 * - Hover: #4FE3D0
 * - Pressed: #6F8DFF
 * - Highlight: #4FE3D0
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

export const THEME = {
  colors: {
    primary: '#9075FF',
    primaryHover: '#4FE3D0',
    primaryPressed: '#6F8DFF',
    primaryHighlight: '#4FE3D0',
    bgDark: '#0A0B16',
    bgDarker: '#10111F',
    bgCard: 'rgba(21, 23, 42, 0.92)',
    bgGlass: 'rgba(21, 23, 42, 0.72)',
    borderDark: 'rgba(196, 190, 230, 0.14)',
    borderGlow: 'rgba(79, 227, 208, 0.35)',
    textLight: '#F4F2FB',
    textMuted: '#9C97B8',
    textDark: '#0A0B16',
    success: '#4FE3D0',
    warning: '#F4C364',
    error: '#FF7A6B',
    info: '#6F8DFF'
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
