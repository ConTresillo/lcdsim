import React from 'react';

const NeonButton = ({ onClick, label }) => (
  <button
    onClick={onClick}
    // Added: 'w-full' (fill space), 'py-2' (match dropdown height), 'text-sm' (match font size)
    className="w-full py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded px-4 text-sm font-bold hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_10px_rgba(34,211,238,0.2)] flex items-center justify-center"
  >
    {label}
  </button>
);

export default NeonButton;