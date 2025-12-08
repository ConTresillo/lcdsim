// src/utils/DataLogic.js

const DDRAM_WIDTH = 40;
const ROW1_DDRAM_OFFSET = 0x40; // 64

/**
 * Parses user input (Hex, Decimal, ASCII) into an array of ASCII character codes.
 * @param {string} input - The raw input string.
 * @param {string} format - The format ('Hex', 'Decimal', 'Binary', 'ASCII').
 * @returns {number[]} Array of ASCII codes to be written to DDRAM.
 */
export const parseInputToAsciiCodes = (input, format) => {
    const codes = [];

    if (!input) return [];

    switch (format) {
        case 'Hex':
            // Match 1 or 2 hex characters (byte representation)
            const hexParts = input.match(/[0-9a-fA-F]{1,2}/g);
            if (hexParts) {
                for (const part of hexParts) {
                    codes.push(parseInt(part, 16));
                }
            }
            break;
        case 'Decimal':
            // Match any number
            const decimalParts = input.match(/\d+/g);
            if (decimalParts) {
                for (const part of decimalParts) {
                    codes.push(parseInt(part, 10));
                }
            }
            break;
        case 'Binary':
            // Match 8-bit binary strings
            const binaryParts = input.match(/[01]{8}/g);
            if (binaryParts) {
                for (const part of binaryParts) {
                    codes.push(parseInt(part, 2));
                }
            }
            break;
        case 'ASCII':
        default:
            // Direct character to ASCII code conversion
            for (let i = 0; i < input.length; i++) {
                codes.push(input.charCodeAt(i));
            }
            break;
    }

    // Filter out invalid codes
    return codes.filter(code => code >= 0 && code <= 255);
};

/**
 * Executes the Data Write operation (RS=1, EN pulse).
 * Writes the ASCII code to the current DDRAM address and calculates the new cursor position.
 * @param {object} state - The current LCD state.
 * @param {number} asciiCode - The ASCII code to write.
 * @returns {object} { newLcdRows, newCursorCol, newCursorRow }
 */
export const executeDataWrite = (state, asciiCode) => {
    let { cursorRow, cursorCol, lcdRows, entryMode } = state;
    let newCursorCol = cursorCol;
    let newCursorRow = cursorRow; // Initialize to current row

    const newRows = {
        row1: [...lcdRows.row1],
        row2: [...lcdRows.row2],
    };

    // 1. Write Data (Based on current absolute DDRAM Address: cursorCol)
    let physicalArrayCol = -1;

    if (cursorRow === 0) {
        // Row 1 DDRAM range: 0x00 to 0x27 (0 to 39)
        if (cursorCol >= 0 && cursorCol < DDRAM_WIDTH) {
            physicalArrayCol = cursorCol;
            newRows.row1[physicalArrayCol] = asciiCode;
        }
    } else {
        // Row 2 DDRAM range: 0x40 to 0x67 (64 to 103)
        if (cursorCol >= ROW1_DDRAM_OFFSET && cursorCol < (ROW1_DDRAM_OFFSET + DDRAM_WIDTH)) {
            physicalArrayCol = cursorCol - ROW1_DDRAM_OFFSET; // Map 64-103 down to 0-39
            newRows.row2[physicalArrayCol] = asciiCode;
        }
    }

    // 2. Update cursor position (Auto-Increment/Decrement)
    const isIncrement = entryMode === 'Left to Right (Inc)';

    // NOTE: This logic ensures cursorCol tracks the *absolute DDRAM Address*
    if (isIncrement) {
        newCursorCol++;
    } else {
        newCursorCol--;
    }

    // 3. Prevent cursor from moving past DDRAM boundaries (Wrapping/Stay at Edge)
    if (newCursorCol < 0) {
        newCursorCol = 0; // Stay at the beginning of R1 buffer
    } else if (newCursorCol >= ROW1_DDRAM_OFFSET && newCursorCol < (ROW1_DDRAM_OFFSET + DDRAM_WIDTH)) {
        // We are on Row 2
        // If incremented past R2 limit (0x67)
        if (newCursorCol >= (ROW1_DDRAM_OFFSET + DDRAM_WIDTH)) {
            newCursorCol = ROW1_DDRAM_OFFSET + DDRAM_WIDTH - 1;
        }
        newCursorRow = 1; // Explicitly keep it at Row 1 (DDRAM addresses 0x40 to 0x67)
    } else if (newCursorCol >= DDRAM_WIDTH && newCursorCol < ROW1_DDRAM_OFFSET) {
        // We are in the "dead zone" (0x28 to 0x3F). Cursor should stay at the end of R1 buffer.
        newCursorCol = DDRAM_WIDTH - 1;
    }


    return {
        newLcdRows: newRows,
        newCursorCol: newCursorCol,
        newCursorRow: newCursorRow
    };
};