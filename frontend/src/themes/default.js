// src/themes/default.js

// --- Extracted Hex Values from the 'Default Cyan/Neon' theme ---

// 1. MAIN BACKGROUND/UI: The dominant dark background and terminal colors.
const BODY_BACKGROUND = '#0f172a';           // Main Body Background (Dark Slate)
const TERMINAL_BACKGROUND = '#050b14';       // Deep Dark Blue for Terminal/Inner Panels
const DEEP_SLATE_GRADIENT = '#030612';       // Deepest dark (for App.jsx gradient end)

// 2. LCD DISPLAY: The characteristic cyan/neon screen colors.
const DISPLAY_BG = '#1a2e2e';                // Background of the LCD glass (Dark Green/Blue)
const LIT_PIXEL = '#4DD0E1';                 // Bright Cyan for lit pixels (Pulse ON)
const OFF_PIXEL = '#0f1f22';                 // The background color of an unlit pixel (Pulse OFF)

// 3. HARDWARE/PCB: The physical colors of the simulator's components.
const PCB_FRAME = '#0c2229';                 // Outer PCB/LCD Frame Background
const PCB_TRACE = '#06b6d4';                 // PCB Traces / Cyan Toggle Glow
const PIN_BG = '#1a1a1a';                    // LCD Pin Background
const MOUNT_HOLE = '#b8860b';                // Mounting Hole Border (Bronze/Gold)

// 4. BUTTONS/INDICATORS (GPIO/Data Bus): The primary interaction colors.
const RS_ON = '#00F0FF';                     // RS=HIGH/Data: Bright Cyan (Primary Neon Accent)
const RW_ON = '#facc15';                     // R/W=HIGH/Read: Bright Yellow
const EN_PULSE = '#facc15';                  // EN/Pulse: Bright Yellow
const DATA_ON = '#00F0FF';                   // Data Pins ON: Bright Cyan

// 5. TEXT/ACCENTS: Glow and utility colors.
const NEON_GLOW_ACCENT = '#00F0FF';          // General 'Glow' accent (Primary Neon Accent)
const SHADOW_GLOW_ACCENT = '#22d3ee';        // Cyan Glow Color (Shadow accent)
const GLASS_OVERLAY = 'rgba(255, 255, 255, 0.05)'; // Glass Transparency (Overlay)
const SCROLL_TRACK = '#1e293b';              // Terminal Scrollbar Track
const SCROLL_THUMB = '#334155';              // Terminal Scrollbar Thumb


export const defaultTheme = {
  // 1. BRAND & ACCENT COLORS
  brand: {
    neon: NEON_GLOW_ACCENT,
    glow: SHADOW_GLOW_ACCENT,
    glass: GLASS_OVERLAY,
    yellow: EN_PULSE,
  },

  // 2. MAIN BACKGROUNDS
  background: {
    body: BODY_BACKGROUND,
    terminal: TERMINAL_BACKGROUND,
    deepSlate: DEEP_SLATE_GRADIENT,
  },

  // 3. LCD & PIXEL STATES
  lcd: {
    offPixel: OFF_PIXEL,
    onPixel: LIT_PIXEL,
    pulseOff: OFF_PIXEL,
    pulseOn: LIT_PIXEL,
    screenBg: DISPLAY_BG,
    pcbFrame: PCB_FRAME,
    pcbTrace: PCB_TRACE,
    pinBg: PIN_BG,
    mountHole: MOUNT_HOLE,
  },

  // 4. UI COMPONENTS (Specific colors for DataPins/Toggles)
  ui: {
    rsOn: RS_ON,
    rwOn: RW_ON,
    enPulse: EN_PULSE,
    dataPinOn: DATA_ON,
    scrollTrack: SCROLL_TRACK,
    scrollThumb: SCROLL_THUMB,
  }
};