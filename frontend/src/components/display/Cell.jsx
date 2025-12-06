import React, { useState, memo } from 'react';
import { Font5x7 } from '../../utils/CharMap';

// ✅ UPDATED PROPS: Receive isActiveCursor and cursorStyle
const Cell = ({ char, onCellClick, row, col, isActiveCursor, cursorStyle }) => {

  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
      if (onCellClick) {
          onCellClick(row, col);
      }
  };

  // --- CURSOR VISUAL LOGIC ---
  const isCursorVisible = isActiveCursor && cursorStyle !== 'Hidden';
  const isBlinking = isCursorVisible && cursorStyle === 'Blinking Block';
  const isUnderline = isCursorVisible && cursorStyle === 'Underline';

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
            
            // Apply cursor blinking animation to the whole cell container
            ${isBlinking ? 'animate-pulse' : ''} 
            
            ${isHovered ? 'scale-[1.1] bg-slate-800 rounded-sm' : 'scale-100'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
    >
      {/* Loop through 8 Rows (0 to 7) */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((rowPixel) => ( // Renamed to rowPixel to avoid collision
        <div key={rowPixel} className="flex gap-[1px]">

          {/* Loop through 5 Columns */}
          {[0, 1, 2, 3, 4].map((colPixel) => {
            const colByte = charData[colPixel];
            const isCharacterOn = (colByte >> rowPixel) & 1;

            // --- PIXEL OVERRIDE LOGIC ---
            let pixelClasses = '';

            if (isUnderline && rowPixel === 7) {
                // Underline Cursor: Always ON for the last row
                pixelClasses = 'bg-cyan-300 shadow-[0_0_4px_#22d3ee] opacity-100';
            } else if (isBlinking && rowPixel >= 0) {
                // Blinking Block Cursor: Invert color or force ON for the block area
                pixelClasses = 'bg-cyan-500 shadow-[0_0_4px_#22d3ee] opacity-100'; // Full solid block
            } else if (isCharacterOn) {
                // Standard Character Pixel
                pixelClasses = 'bg-cyan-300 shadow-[0_0_4px_#22d3ee] opacity-100';
            } else {
                // Standard OFF Pixel
                pixelClasses = 'bg-[#0f1f22] border border-cyan-900/20 opacity-100';
            }

            // Override background if Blinking Block is active
            if (isBlinking && !isCharacterOn) {
                // If Blinking Block is active, force entire cell background to be the cursor color
                // This creates the inversion effect without complex CSS filters.
                pixelClasses = 'bg-cyan-500 shadow-[0_0_4px_#22d3ee] opacity-100';
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

// You will also need to define the blinking animation in your global CSS (e.g., index.css or global.css):
/* @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}
.animate-pulse {
    animation: pulse 1s infinite;
}
*/

export default memo(Cell);