// src/utils/LcdLogic.js

const ASCII_SPACE = 32;
const DDRAM_WIDTH = 40; // DDRAM is 40 cells wide

/**
 * Pure function to execute the Clear Display command (0x01).
 * @returns {object} The new DDRAM data, with all 40x2 cells set to space (ASCII 32).
 */
export const executeClearDisplay = () => {
  return {
    row1: Array(DDRAM_WIDTH).fill(ASCII_SPACE),
    row2: Array(DDRAM_WIDTH).fill(ASCII_SPACE)
  };
};