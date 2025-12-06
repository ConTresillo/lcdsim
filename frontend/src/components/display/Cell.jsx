import React, { useState, memo } from 'react';
import { Font5x7 } from '../../utils/CharMap';

const Cell = ({ char, onCellClick, row, col, isActiveCursor, cursorStyle, isBlinkingPhase }) => {

  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
      if (onCellClick) {
          onCellClick(row, col);
      }
  };

  // --- CURSOR LOGIC VARIABLES ---
  const isCursorVisible = isActiveCursor && cursorStyle !== 'Hidden';
  const isBlinkingStyle = isCursorVisible && cursorStyle === 'Blinking Block';
  const isUnderlineStyle = isCursorVisible && cursorStyle === 'Underline';

  // 1. Get the ASCII code (0-255)
  const charCode = char ? char.charCodeAt(0) : 32;

  // 2. Lookup the pattern
  const charData = Font5x7[charCode] || Font5x7[32];

  // 3. Render the Grid
  return (
    <div
        className={`
            flex flex-col gap-[1px]
            cursor-pointer 
            transition-transform duration-75 ease-out
            
            // NOTE: Removed 'animate-pulse' class here!
            
            ${isHovered ? 'scale-[1.1] bg-slate-800 rounded-sm' : 'scale-100'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
    >
      {/* Loop through 8 Rows (0 to 7) */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((rowPixel) => ( // Renamed to rowPixel
        <div key={rowPixel} className="flex gap-[1px]">

          {/* Loop through 5 Columns */}
          {[0, 1, 2, 3, 4].map((colPixel) => {
            const colByte = charData[colPixel];
            const isCharacterOn = (colByte >> rowPixel) & 1;

            let pixelClasses = '';

            // --- PIXEL RENDERING LOGIC (The core fix) ---

            if (isBlinkingStyle && isBlinkingPhase) {
                // Scenario 1: BLINKING BLOCK - Visible Phase
                // Forces the block background to be the active color, creating an inversion effect.
                pixelClasses = 'bg-cyan-500 shadow-[0_0_4px_#22d3ee] opacity-100';
            }
            else if (isUnderlineStyle && rowPixel === 7) {
                // Scenario 2: UNDERLINE CURSOR - Always Visible
                // Forces the last row pixel (row 7) to be ON.
                pixelClasses = 'bg-cyan-300 shadow-[0_0_4px_#22d3ee] opacity-100';
            }
            else if (isCharacterOn) {
                // Scenario 3: STANDARD CHARACTER PIXEL - Always Visible when the char data dictates
                pixelClasses = 'bg-cyan-300 shadow-[0_0_4px_#22d3ee] opacity-100';
            }
            else {
                // Scenario 4: OFF PIXEL (Covers character space, hidden blink phase, and empty space)
                pixelClasses = 'bg-[#0f1f22] border border-cyan-900/20 opacity-100';
            }

            // If Blinking is active but in the hidden phase (isBlinkingPhase = false),
            // the logic falls through to Scenario 4 or Scenario 3, correctly showing the character
            // or the empty space beneath the cursor.

            return (
              <div
                key={colPixel}
                // Apply the calculated classes
                className={`w-[2px] h-[2px] md:w-[3px] md:h-[3px] rounded-[0.5px] transition-colors duration-200 ${pixelClasses}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default memo(Cell);