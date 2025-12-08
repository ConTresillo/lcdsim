// src/utils/LcdParser.js

/**
 * Converts a hex string ('0x28') to an integer.
 * @param {string | number} code
 * @returns {number}
 */
export const toInt = (code) => {
  if (typeof code === 'number') return code;
  return parseInt(code.replace('0x', ''), 16);
};

/**
 * Converts an integer command value to its padded hex string representation.
 * @param {number} val
 * @returns {string}
 */
export const toHexStr = (val) => '0x' + val.toString(16).toUpperCase().padStart(2, '0');

/**
 * Calculates the HD44780 Function Set Command based on bus width and line count.
 * @param {string} width - e.g., '4-Bit Mode' or '8-Bit Mode'
 * @param {string} lines - e.g., '1 Line (16x1)' or '2 Lines (16x2)'
 * @returns {string} The hex command string (e.g., '0x28')
 */
export const getFunctionSetCommand = (width, lines) => {
  const is2Line = lines.includes('2 Lines');
  const is8Bit = width.includes('8-Bit');

  if (is8Bit && is2Line) return '0x38';
  if (is8Bit && !is2Line) return '0x30';
  if (!is8Bit && is2Line) return '0x28';
  if (!is8Bit && !is2Line) return '0x20';

  return '0x??';
};

/**
 * Calculates the DDRAM Address command for a specific row and column.
 * NOTE: The internal DDRAM is 40 cells wide (0-39).
 * @param {number} row (0 or 1)
 * @param {number} col (0-39, internal DDRAM column)
 * @returns {number} DDRAM Address command (0x80 | Address)
 */
export const getDDRAMCommand = (row, col) => {
  const rowOffset = row === 0 ? 0x00 : 0x40; // DDRAM Row 2 starts at 0x40

  // Ensure the column address respects the 40-cell boundary
  const ddramCol = Math.min(col, 39);

  return 0x80 | rowOffset | ddramCol; // DDRAM Set Address command is 0x80
};