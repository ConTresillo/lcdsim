import React from 'react';
import Cell from './Cell';

// --- 1. MountingHole Component ---
const MountingHole = ({ position }) => (
  <div
    className={`
      absolute ${position} 
      w-3 h-3 
      rounded-full 
      bg-[#111] 
      border-2 border-[#b8860b] 
      shadow-[inset_0_0_2px_black] 
      opacity-80 
      blur-[2px]
    `}
  ></div>
);

// --- 2. Main LcdScreen Component ---
// ADDED prop: onCellClick
const LcdScreen = ({ row1Data, row2Data, backlight, onCellClick }) => {
  const r1 = row1Data && row1Data.length === 16 ? row1Data : Array(16).fill(32);
  const r2 = row2Data && row2Data.length === 16 ? row2Data : Array(16).fill(32);

  // LOGIC: If backlight is OFF, the glass gets dark and text gets dim.
  const screenStateClass = backlight === "OFF"
    ? "opacity-40 grayscale brightness-50" // Dimmed state
    : "opacity-100 brightness-100";        // ON state

  return (
    <div className="relative p-1 w-fit mx-auto">

      {/* ================================================= */}
      {/* === OUTER PCB BOARD (Always Visible)          === */}
      {/* ================================================= */}
      <div className="absolute inset-0 bg-[#0c2229] opacity-50 rounded-xl border border-slate-700 shadow-2xl"></div>

      {/* PCB Traces (Same) */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <pattern id="traces" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10 h20 M10 0 v20" stroke="#06b6d4" strokeWidth="1" fill="none"/>
          <circle cx="10" cy="10" r="2" fill="#06b6d4"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#traces)" />
        <path d="M10 10 Q 30 10 30 30" stroke="#06b6d4" strokeWidth="1.5" fill="none" className="opacity-50"/>
        <path d="M280 10 Q 260 10 260 30" stroke="#06b6d4" strokeWidth="1.5" fill="none" className="opacity-50"/>
      </svg>

      {/* Pins (Same) */}
      <div className="relative z-10 flex justify-center gap-2 mb-1 pt-1 opacity-80">
         {[...Array(16)].map((_, i) => (
           <div key={i} className="flex flex-col items-center gap-[1px]">
             <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] border border-[#b87333] shadow-inner"></div>
             <span className="text-[6px] text-gray-400 font-mono">{i+1}</span>
           </div>
         ))}
      </div>

      <MountingHole position="top-2 left-2" />
      <MountingHole position="top-2 right-2" />
      <MountingHole position="bottom-2 left-2" />
      <MountingHole position="bottom-2 right-2" />


      {/* ================================================= */}
      {/* === THE SCREEN BEZEL & GLASS                  === */}
      {/* ================================================= */}
      <div className="relative bg-slate-900 px-3 py-2 rounded-md shadow-lg border-t border-slate-700 mx-2 mb-2 z-20">
         <div className="absolute top-1/2 left-1 w-1 h-1 bg-slate-800 rounded-full shadow-inner"></div>
         <div className="absolute top-1/2 right-1 w-1 h-1 bg-slate-800 rounded-full shadow-inner"></div>

         {/* === INNER GLASS (This part reacts to Backlight) === */}
         <div
            className={`
              bg-[#1a2e2e] py-2 px-3 rounded border-2 border-slate-700/50 
              shadow-[inset_0_0_15px_rgba(0,0,0,1)] 
              relative overflow-hidden flex flex-col items-center justify-center gap-1
              transition-all duration-500 ease-in-out
              ${screenStateClass} 
            `}
         >
            {/* Backlight Glow (Only visible when ON due to parent opacity) */}
            <div className="absolute inset-0 bg-cyan-500/10 blur-xl pointer-events-none"></div>

            <div className="absolute top-0 right-0 w-[150%] h-full bg-gradient-to-b from-white/5 to-transparent transform -skew-x-45 pointer-events-none z-20"></div>

            {/* ROW 1: Index 0 */}
            <div className="flex gap-[2px] md:gap-[3px] relative z-10">
                {r1.map((code, i) => (
                    <Cell
                        key={`r1-${i}`}
                        char={String.fromCharCode(code)}
                        row={0} // Row index 0
                        col={i} // Column index 0-15
                        onCellClick={onCellClick} // Pass the handler down
                    />
                ))}
            </div>

            {/* ROW 2: Index 1 */}
            <div className="flex gap-[2px] md:gap-[3px] relative z-10">
                {r2.map((code, i) => (
                    <Cell
                        key={`r2-${i}`}
                        char={String.fromCharCode(code)}
                        row={1} // Row index 1
                        col={i} // Column index 0-15
                        onCellClick={onCellClick} // Pass the handler down
                    />
                ))}
            </div>
         </div>
      </div>

    </div>
  );
};

export default LcdScreen;