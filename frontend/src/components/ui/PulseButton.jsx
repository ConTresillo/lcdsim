import React from 'react';

// Now accepts 'isActive' from parent instead of using local state
const PulseButton = ({ label, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-10 h-10 rounded border flex items-center justify-center font-bold text-xs cursor-pointer select-none
        transition-all duration-100 ease-out
        
        ${isActive 
          // HIGH STATE (Active Pulse): Bright glowing yellow, pressed in
          ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_0_15px_#facc15] scale-95' 
          
          // LOW STATE (Normal): Dim
          : 'bg-yellow-500/20 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black shadow-[0_0_10px_rgba(250,204,21,0.2)] hover:scale-110'
        }
      `}
    >
      {label}
    </button>
  );
};

export default PulseButton;