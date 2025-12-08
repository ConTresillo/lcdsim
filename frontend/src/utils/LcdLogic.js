// src/utils/LcdLogic.js

/**
 * Pure function to execute the Clear Display command (0x01).
 * @param {object} currentLcdRows - The current DDRAM data.
 * @returns {object} The new DDRAM data, with all cells set to space (ASCII 32).
 */
const ASCII_SPACE = 32;

export const executeClearDisplay = (currentLcdRows) => {
  // DDRAM clearing logic: set all 16x2 cells to ASCII space (32)
  return {
    row1: Array(16).fill(ASCII_SPACE),
    row2: Array(16).fill(ASCII_SPACE)
  };
};

// ... Add other command execution functions here later (e.g., executeReturnHome)