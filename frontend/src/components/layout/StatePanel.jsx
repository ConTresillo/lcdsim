import React, { useState } from 'react';
import NeonDropdown from '../ui/NeonDropdown';
import { ENTRY_MODES, CURSOR_MODES, BUS_MODES, DISPLAY_POWER, LINE_MODES } from '../../utils/LcdCommands';

// Constants for constraint checking
const DISPLAY_ON_CMD = 0x0C; // Used for "Display ON" constraint
const DISPLAY_OFF_HEX = 0x08;
const CURSOR_HIDDEN_LABEL = "Hidden";
// Find the Hex for Cursor Hidden
const CURSOR_HIDDEN_CMD = CURSOR_MODES.find(c => c.label === CURSOR_HIDDEN_LABEL)?.hex;

const StatePanel = ({ onConfigChange }) => {
  const [entryLabel, setEntryLabel] = useState(ENTRY_MODES[0].label);
  const [cursorLabel, setCursorLabel] = useState(CURSOR_MODES[1].label);
  const [busLabel, setBusLabel] = useState(BUS_MODES[0].label);
  const [displayLabel, setDisplayLabel] = useState(DISPLAY_POWER[0].label);
  const [lineLabel, setLineLabel] = useState(LINE_MODES[0].label);

  // --- MODIFIED HANDLE SELECTION FUNCTION ---
  const handleSelection = (label, list, setLabel) => {
    setLabel(label);
    const cmd = list.find(item => item.label === label);
    if (!cmd) return;

    // 1. CONSTRAINT 1: Cursor Requires Display ON (Previous logic)
    if (list === CURSOR_MODES) {
        // If cursor is visible (Underline/Blinking), enforce Display ON
        if (cmd.hex === 0x0E || cmd.hex === 0x0F) {
            if (displayLabel === "Display OFF") {
                onConfigChange(DISPLAY_ON_CMD);
                setDisplayLabel("Display ON");
            }
        }
    }

    // 2. CONSTRAINT 2: Display OFF Requires Cursor Hidden (New logic)
    if (list === DISPLAY_POWER && cmd.hex === DISPLAY_OFF_HEX) {
        // If Display is turned OFF, force Cursor state to Hidden
        if (cursorLabel !== CURSOR_HIDDEN_LABEL) {
            setCursorLabel(CURSOR_HIDDEN_LABEL);
            // Send the Cursor Hidden command too, to update the flag in Python (0x0C)
            onConfigChange(CURSOR_HIDDEN_CMD);
        }
    }

    // 3. Send the original command
    onConfigChange(cmd.hex);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 w-full">
      <label className="text-cyan-400 text-xs font-bold tracking-widest block mb-4 border-b border-cyan-900/50 pb-1">
        CONFIGURATION STATE
      </label>

      {/* --- NORMAL VERTICAL STACK --- */}
      <div className="flex flex-col gap-4">

        {/* Item 1: Display Visibility */}
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Display Visibility</span>
          <NeonDropdown
            value={displayLabel}
            options={DISPLAY_POWER.map(d => d.label)}
            onChange={(val) => handleSelection(val, DISPLAY_POWER, setDisplayLabel)}
          />
        </div>

        {/* Item 2: Entry Mode */}
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Entry Mode</span>
          <NeonDropdown
            value={entryLabel}
            options={ENTRY_MODES.map(e => e.label)}
            onChange={(val) => handleSelection(val, ENTRY_MODES, setEntryLabel)}
          />
        </div>

        {/* Item 3: Cursor Style */}
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Cursor Style</span>
          <NeonDropdown
            value={cursorLabel}
            options={CURSOR_MODES.map(c => c.label)}
            onChange={(val) => handleSelection(val, CURSOR_MODES, setCursorLabel)}
          />
        </div>

        {/* Item 4: Bus Interface (Width) */}
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Bus Interface (Width)</span>
          <NeonDropdown
            value={busLabel}
            options={BUS_MODES.map(b => b.label)}
            onChange={(val) => handleSelection(val, BUS_MODES, setBusLabel)}
          />
        </div>

        {/* Item 5: Line Count */}
        <div>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Line Count</span>
          <NeonDropdown
            value={lineLabel}
            options={LINE_MODES.map(l => l.label)}
            onChange={(val) => handleSelection(val, LINE_MODES, setLineLabel)}
          />
        </div>

      </div>
    </div>
  );
};

export default StatePanel;