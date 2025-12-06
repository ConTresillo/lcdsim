import React, { useState, memo } from 'react'; // <-- Import memo
import { Font5x7 } from '../../utils/CharMap';

// ADDED props: onCellClick, row, col
const Cell = ({ char, onCellClick, row, col }) => {

  // NEW STATE: For the hover effect
  const [isHovered, setIsHovered] = useState(false);

  // Handler to call the parent function with the cell's coordinates
  const handleClick = () => {
      if (onCellClick) {
          onCellClick(row, col);
      }
  };

  // 1. Get the ASCII code (0-255)
  const charCode = char ? char.charCodeAt(0) : 32;

  // 2. Lookup the pattern from your new Hustle Font file
  const charData = Font5x7[charCode] || Font5x7[32];

  // 3. Render the Grid
  return (
    <div
        className={`
            // Base styling for the cell container (adjust padding to control size)
            flex flex-col gap-[1px]
            cursor-pointer 
            transition-transform duration-150 ease-out
            // Hover styling for scaling up
            ${isHovered ? 'scale-[1.1] bg-slate-800 rounded-sm' : 'scale-100'}
        `}
        onMouseEnter={() => setIsHovered(true)} // Handle hover start
        onMouseLeave={() => setIsHovered(false)} // Handle hover end
        onClick={handleClick} // Handle click event
    >
      {/* Loop through 8 Rows */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => (
        <div key={row} className="flex gap-[1px]">

          {/* Loop through 5 Columns */}
          {[0, 1, 2, 3, 4].map((col) => {
            const colByte = charData[col];
            const isOn = (colByte >> row) & 1;

            return (
              <div
                key={col}
                // UPDATED STYLES:
                className={`w-[2px] h-[2px] md:w-[3px] md:h-[3px] rounded-[0.5px] transition-colors duration-200
                  ${isOn 
                    ? 'bg-cyan-300 shadow-[0_0_4px_#22d3ee] opacity-100' // ON: Bright & Glowing
                    : 'bg-[#0f1f22] border border-cyan-900/20 opacity-100' // OFF: Dark Grid Block (Visible)
                  }`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

// EXPORT THE MEMOIZED VERSION
export default memo(Cell); // <-- FIX APPLIED HERE