import React from 'react';

const DataPin = ({ label, active, onClick, isDisabled = false }) => ( // <--- ACCEPT isDisabled
  <div
    onClick={isDisabled ? null : onClick} // <--- DISABLE CLICK HANDLER
    className={`
      w-10 h-10 rounded border flex items-center justify-center font-mono text-sm select-none
      
      /* ANIMATION: Smooth 200ms speed */
      transition-all duration-75 ease-out
      
      ${isDisabled 
        ? 'cursor-not-allowed opacity-50 border-gray-700 bg-gray-800/20 text-gray-600 scale-100' // <--- DISABLED STATE
        : 'cursor-pointer hover:scale-110' // <--- ENABLED STATE
      }
      
      ${active 
        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_#22d3ee] scale-110' // Active (ON)
        : 'border-gray-700 bg-gray-800/20 text-gray-600 hover:border-gray-500 hover:text-gray-400' // Inactive (OFF)
      }
    `}
  >
    {label}
  </div>
);

export default DataPin;