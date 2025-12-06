// ONE-TIME ACTIONS (Triggers)
export const ACTION_COMMANDS = [
  { label: "Clear Display", hex: 0x01 },
  { label: "Return Home", hex: 0x02 },
  { label: "Move Cursor Left", hex: 0x10 },
  { label: "Move Cursor Right", hex: 0x14 },
  { label: "Shift Screen Left", hex: 0x18 },
  { label: "Shift Screen Right", hex: 0x1C }
];

// STATE GROUPS (Configurations)
export const ENTRY_MODES = [
  { label: "Left to Right (Inc)", hex: 0x06 },
  { label: "Right to Left (Dec)", hex: 0x04 },
];

export const CURSOR_MODES = [
  { label: "Hidden", hex: 0x0C },
  { label: "Underline", hex: 0x0E },
  { label: "Blinking Block", hex: 0x0F },
];

export const BUS_MODES = [
  { label: "4-Bit Mode", hex: 0x28 },
  { label: "8-Bit Mode", hex: 0x38 },
];

export const DISPLAY_POWER = [
  { label: "Display ON", hex: 0x0C },  // 0x0C = Display On, Cursor Off (Standard)
  { label: "Display OFF", hex: 0x08 }, // 0x08 = Display Off (Data retained, pixels off)
];

export const LINE_MODES = [
  { label: "2 Lines (16x2)", hex: 0x28 }, // N=1 (2-Line Mode)
  { label: "1 Line (16x1)", hex: 0x20 }, // N=0 (1-Line Mode)
];