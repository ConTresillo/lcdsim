// ===== src\components\layout\ActionPanel.jsx (Updated) =====

import React, { useState, useRef, useEffect } from 'react'; // <-- ADDED useRef, useEffect
import NeonButton from '../ui/NeonButton';
import { ACTION_COMMANDS } from '../../utils/LcdCommands';
import { ChevronDown } from 'lucide-react';

const ActionPanel = ({ onExecute }) => {
  const [selectedHex, setSelectedHex] = useState(0x01);
  const [hexInput, setHexInput] = useState("0x01");
  const [isOpen, setIsOpen] = useState(false);

  // ADDED: Ref to track button position
  const dropdownRef = useRef(null);
  const [openUpward, setOpenUpward] = useState(false);

  // LOGIC: Check if there's enough space below to open downward.
  useEffect(() => {
    if (!isOpen || !dropdownRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const isRoomBelow = spaceBelow >= 200; // Assuming dropdown needs ~200px

    // If less than 200px below, open upward
    setOpenUpward(!isRoomBelow);
  }, [isOpen]); // Recalculate whenever open state changes

  const handleDropdownSelect = (hex) => {
    setSelectedHex(hex);
    setHexInput('0x' + hex.toString(16).toUpperCase().padStart(2, '0'));
    setIsOpen(false);
  };

  const handleManualInput = (e) => {
    setHexInput(e.target.value);
    const val = parseInt(e.target.value.replace("0x", ""), 16);
    if (!isNaN(val)) setSelectedHex(val);
  };

  return (
    <div className="flex flex-col gap-3">

      {/* Custom Dropdown Container: High Z-index. */}
      {/* ⚠️ FIX: Add ref to track position */}
      <div className="relative z-[99]" ref={dropdownRef}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-900 border border-cyan-500/30 rounded px-3 py-2 text-cyan-300 text-sm flex justify-between items-center cursor-pointer hover:border-cyan-400 transition-all"
        >
          {ACTION_COMMANDS.find(c => c.hex === selectedHex)?.label || "Select Action"}
          <ChevronDown size={14} />
        </div>

        {/* Dropdown List */}
        {isOpen && (
          <div
            className={`
              absolute left-0 w-full mt-1 bg-slate-900 border border-cyan-500/50 
              rounded shadow-xl max-h-40 overflow-y-auto z-[100]
              
              ${openUpward ? 'bottom-full mb-1' : 'top-full'}
            `}
          >
            {ACTION_COMMANDS.map((cmd) => (
              <div
                key={cmd.hex}
                onClick={() => handleDropdownSelect(cmd.hex)}
                className="px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20 cursor-pointer flex justify-between"
              >
                <span>{cmd.label}</span>
                <span className="text-gray-500 font-mono text-xs">{'0x' + cmd.hex.toString(16).toUpperCase().padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hex Input & Execute */}
      <div className="flex gap-2">
        <div className="w-24">
           <div className="bg-slate-900 border border-cyan-500/30 rounded flex items-center px-3 py-2 h-full">
              <input
                type="text"
                value={hexInput}
                onChange={handleManualInput}
                className="bg-transparent border-none text-cyan-300 w-full focus:outline-none font-mono text-center text-sm"
              />
           </div>
        </div>

        <div className="flex-1">
          <NeonButton label="EXECUTE" onClick={() => onExecute(selectedHex)} />
        </div>
      </div>

    </div>
  );
};

export default ActionPanel;