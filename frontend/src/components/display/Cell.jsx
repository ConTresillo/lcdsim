import React from 'react';
import { Font5x7 } from '../../utils/CharMap';

const Cell = ({ char }) => {
  // 1. Get the ASCII code (0-255)
  const charCode = char ? char.charCodeAt(0) : 32;

  // 2. Lookup the pattern from your new Hustle Font file
  const charData = Font5x7[charCode] || Font5x7[32];

  // 3. Render the Grid
  return (
    <div className="flex flex-col gap-[1px]">
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

export default Cell;