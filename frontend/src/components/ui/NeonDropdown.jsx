import React from 'react';
import { ChevronDown } from 'lucide-react';

const NeonDropdown = ({ value, options, onChange, isDisabled = false }) => {
  return (
    <div className="relative w-full">
      {/* The Visual Part (Shows disabled styling via opacity) */}
      <div className={`
        bg-slate-900 border rounded px-3 py-2 text-sm flex justify-between items-center shadow-[0_0_5px_rgba(34,211,238,0.2)] pointer-events-none
        ${isDisabled ? 'opacity-50 border-gray-700/50 text-gray-500' : 'border-cyan-500/50 text-cyan-300'}
      `}>
        {value}
        <ChevronDown size={14} />
      </div>

      {/* The Functional Part (The invisible real dropdown on top) */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled} // <--- APPLY DISABLED ATTRIBUTE HERE
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-sm"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-slate-900 text-cyan-300">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NeonDropdown;