// src/themes/classic.js

// --- Extracted Hex Values from the "DjLCDSIM" image ---

// 1. MAIN BACKGROUND/UI: The dominant blueprint/grid background.
const COLOR_BODY_BG = '#03173d';        // Dark/Navy Blueprint Background (approx)
const COLOR_TERMINAL_BG = '#00081d';    // Deep Dark Blue for Terminal/Inner Panels

// 2. LCD DISPLAY: The characteristic bright green screen.
const COLOR_DISPLAY_BG = '#4c9d53';     // Background of the LCD glass (a darkish green)
const COLOR_LIT_PIXEL = '#90ee90';      // Bright Neon Green for lit pixels (LightGreen)
const COLOR_OFF_PIXEL = '#0f3113';      // The background color of an unlit pixel

// 3. HARDWARE/PCB: The physical colors of the simulator's components.
const COLOR_PCB_FRAME = '#37474f';      // Dark Slate Grey/Blue for outer frame
const COLOR_PCB_TRACE = '#008080';      // Teal for PCB traces
const COLOR_PIN_BG = '#263238';         // Very dark grey/blue for pin backgrounds
const COLOR_MOUNT_HOLE = '#546e7a';     // Medium grey for mounting holes

// 4. BUTTONS/INDICATORS (GPIO/Data Bus): From the image's buttons.
const COLOR_RS_ON = '#ff0000';          // RS=HIGH/Data: Bright Red
const COLOR_RW_ON = '#008000';          // R/W=HIGH/Read: Bright Green
const COLOR_EN_PULSE = '#ffa500';       // EN/Pulse: Orange
const COLOR_DATA_ON = '#ff0000';        // Data Pins ON: Bright Red

// 5. TEXT/ACCENTS: White/Gray for text, Blue/Green for accents.
const COLOR_NEON = '#90ee90';           // General 'Glow' accent (Bright Green)
const COLOR_GLOW = '#3cb371';           // Medium Sea Green for shadow/glow

export const classicTheme = {
  // 1. BRAND & ACCENT COLORS
  brand: {
    neon: COLOR_NEON,
    glow: COLOR_GLOW,
    glass: 'rgba(255, 255, 255, 0.05)', // Still keeping a standard glass overlay
    yellow: COLOR_EN_PULSE,             // EN Pulse Color
  },

  // 2. MAIN BACKGROUNDS (For App.jsx, Terminal, Panels)
  background: {
    body: COLOR_BODY_BG,                // Dark Navy
    terminal: COLOR_TERMINAL_BG,        // Deep Dark Blue
    deepSlate: '#000000',               // Deepest dark (for gradient end)
  },

  // 3. LCD & PIXEL STATES
  lcd: {
    // The main dark color of the character segment when OFF (used by Cell.jsx)
    offPixel: COLOR_OFF_PIXEL,          // Dark Green
    // The bright color of the lit pixel (used by Cell.jsx)
    onPixel: COLOR_LIT_PIXEL,           // Neon Green
    // Blinking Animation Toggle
    pulseOff: COLOR_OFF_PIXEL,
    pulseOn: COLOR_LIT_PIXEL,
    // Screen Glass
    screenBg: COLOR_DISPLAY_BG,         // The background behind the pixels
    // PCB Hardware
    pcbFrame: COLOR_PCB_FRAME,          // Slate Grey/Blue
    pcbTrace: COLOR_PCB_TRACE,          // Teal
    pinBg: COLOR_PIN_BG,
    mountHole: COLOR_MOUNT_HOLE,
  },

  // 4. UI COMPONENTS (Specific colors for DataPins/Toggles)
  ui: {
    dataPinOn: COLOR_DATA_ON,
    toggleRs: COLOR_RS_ON,
    toggleRw: COLOR_RW_ON,
  }
};
