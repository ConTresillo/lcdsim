// utils/LcdCommands.js (Adjusted to match LCD function set options)

// ONE-TIME ACTIONS (Triggers)
export const ACTION_COMMANDS = [
  { label: "Clear Display", hex: 0x01 },
  { label: "Return Home", hex: 0x02 },
  { label: "Move Cursor Left", hex: 0x10 },
  { label: "Move Cursor Right", hex: 0x14 },
  { label: "Shift Screen Left", hex: 0x18 },
  { label: "Shift Screen Right", hex: 0x1C },
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

// NOTE: These HEX values below are for reference only.
// The final FUNCTION SET COMMAND will be calculated by LcdController.
export const BUS_MODES = [
  { label: "4-Bit Mode", referenceHex: 0x20 }, // DL=0 (4-Bit) is bit 4
  { label: "8-Bit Mode", referenceHex: 0x30 }, // DL=1 (8-Bit) is bit 4/5
];

export const DISPLAY_POWER = [
  { label: "Display ON", hex: 0x0C },
  { label: "Display OFF", hex: 0x08 },
];

export const LINE_MODES = [
  { label: "2 Lines (16x2)", referenceHex: 0x08 }, // N=1 (2-Line) is bit 3
  { label: "1 Line (16x1)", referenceHex: 0x00 }, // N=0 (1-Line) is bit 3
];