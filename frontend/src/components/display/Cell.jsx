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
  const isCursorVisible = isActiveCursor && cursorStyle !== 'Hidden';
  const isBlinkingBlockStyle = isCursorVisible && cursorStyle === 'Blinking Block';
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
            let animationClass = '';

            // --- DEFINITIVE PIXEL RENDERING LOGIC ---

            // Check if the current pixel must participate in the blinking logic
            const isInBlinkArea = isBlinkingBlockStyle && rowPixel >= 0 && rowPixel <= 6;

            // ✅ FIX: NEW HIGH-PRIORITY CHECK FOR STATIC ROW 7 UNDERLINE
            const isStaticUnderline =
                (isCursorVisible && rowPixel === 7);

            if (isStaticUnderline) {
                // SCENARIO 1: STATIC UNDERLINE ROW (Row 7 only, always bright cyan)
                // This covers both 'Underline' style and the static Row 7 part of the 'Blinking Block' style.
                pixelClasses = 'bg-cyan-300 shadow-[0_0_4px_#22d3ee] opacity-100';
            }
            else if (isInBlinkArea && !isCharacterOn) {
                // SCENARIO 2: BLINKING INVERSION (Dark pixel turns bright)
                // Applies pulse to turn the dark background color to the bright foreground color.
                animationClass = 'animate-pulse';
                pixelClasses = 'bg-[#0f1f22] border border-cyan-900/20 opacity-100';
            }
            else if (isCharacterOn) {
                // SCENARIO 3: STANDARD LIT PIXEL (Character data)
                // This includes rows 0-6 when the cursor is blinking over a lit pixel (no inversion/blink).
                pixelClasses = 'bg-cyan-300 shadow-[0_0_4px_#22d3ee] opacity-100';
            }
            else {
                // SCENARIO 4: STANDARD OFF PIXEL (Empty space)
                // If the cursor is hidden, or if it's outside the active cell.
                pixelClasses = 'bg-[#0f1f22] border border-cyan-900/20 opacity-100';
            }

            return (
              <div
                key={colPixel}
                // The animation is applied only to the unlit pixels in the blink area.
                className={`w-[2px] h-[2px] md:w-[3px] md:h-[3px] rounded-[0.5px] transition-colors duration-200 ${pixelClasses} ${animationClass}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default memo(Cell);