import React from 'react';

const DataPin = ({ label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`
      w-10 h-10 rounded border flex items-center justify-center font-mono text-sm cursor-pointer select-none
      
      /* ANIMATION: Smooth 200ms speed */
      transition-all duration-75 ease-out
      
      /* HOVER: Scale up regardless of state */
      hover:scale-110
      
      ${active 
        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_#22d3ee] scale-110' // Active (ON)
        : 'border-gray-700 bg-gray-800/20 text-gray-600 hover:border-gray-500 hover:text-gray-400' // Inactive (OFF) -> Hover lightens border AND text
      }
    `}
  >
    {label}
  </div>
);

export default DataPin;