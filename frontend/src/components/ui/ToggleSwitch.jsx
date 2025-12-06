import React from 'react';

const ToggleSwitch = ({ label, active, onClick, subtitle }) => (
  <div className="flex items-center justify-between mb-4 gap-4">
    <div className="flex flex-col">
      <span className="text-cyan-400 font-bold tracking-wider">{label}</span>
      <span className="text-[10px] text-gray-500">{subtitle}</span>
    </div>
    <div onClick={onClick} className={`w-12 h-6 rounded-full cursor-pointer p-1 transition-all duration-300 ${active ? 'bg-cyan-900 shadow-[0_0_10px_#06b6d4]' : 'bg-gray-700'}`}>
      <div className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${active ? 'translate-x-6 bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'translate-x-0 bg-gray-400'}`} />
    </div>
  </div>
);

export default ToggleSwitch;