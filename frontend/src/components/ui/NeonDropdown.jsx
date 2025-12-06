import React from 'react';
import { ChevronDown } from 'lucide-react';

const NeonDropdown = ({ value, options, onChange }) => {
  return (
    <div className="relative w-full">
      {/* The Visual Part (What you see) */}
      <div className="bg-slate-900 border border-cyan-500/50 rounded px-3 py-2 text-cyan-300 text-sm flex justify-between items-center shadow-[0_0_5px_rgba(34,211,238,0.2)] pointer-events-none">
        {value}
        <ChevronDown size={14} />
      </div>

      {/* The Functional Part (The invisible real dropdown on top) */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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