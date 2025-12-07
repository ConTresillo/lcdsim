import React, { useState, memo } from 'react';
import { Font5x7 } from '../../utils/CharMap';

// ✅ ADDED: isActiveCursor and cursorStyle props
const Cell = ({ char, onCellClick, row, col, isActiveCursor, cursorStyle }) => {

  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
      if (onCellClick) {
          onCellClick(row, col);
      }
  };

  // --- CURSOR LOGIC VARIABLES ---
  // The cursor is visible if it's the active cell AND the style is NOT Hidden.
  const isCursorVisible = isActiveCursor && cursorStyle !== 'Hidden';

  // Note: Since you asked for an underline effect for *any* non-hidden style,
  // we use isCursorVisible directly to light up row 7.

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
            
            ${isHovered ? 'scale-[1.1] bg-slate-800 rounded-sm' : 'scale-100'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
    >
      {/* Loop through 8 Rows (0 to 7) */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((rowPixel) => (
        <div key={rowPixel} className="flex gap-[1px]">

          {/* Loop through 5 Columns */}
          {[0, 1, 2, 3, 4].map((colPixel) => {
            const colByte = charData[colPixel];
            const isCharacterOn = (colByte >> rowPixel) & 1;

            let pixelClasses = '';

            // --- DEFINITIVE PIXEL RENDERING LOGIC ---

            if (isCursorVisible && rowPixel === 7) {
                // SCENARIO 1: UNDERLINE CURSOR (Highest priority - only last row, index 7)
                // Forces the last row pixel (row 7) ON if cursor is visible.
                pixelClasses = 'bg-cyan-300 shadow-[0_0_4px_#22d3ee] opacity-100';
            }
            else if (isCharacterOn) {
                // SCENARIO 2: STANDARD CHARACTER PIXEL
                pixelClasses = 'bg-cyan-300 shadow-[0_0_4px_#22d3ee] opacity-100';
            }
            else {
                // SCENARIO 3: STANDARD OFF PIXEL (Empty space)
                pixelClasses = 'bg-[#0f1f22] border border-cyan-900/20 opacity-100';
            }

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