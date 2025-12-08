import React, { useState, useEffect } from 'react';
import NeonDropdown from '../ui/NeonDropdown';
// Assuming the import path is correct
import { ENTRY_MODES, CURSOR_MODES, DISPLAY_POWER, LINE_MODES, BUS_MODES } from '../../utils/LcdCommands';

// Define constants for the constraints based on your command table
const DISPLAY_ON_LABEL = 'Display ON';
const DISPLAY_OFF_LABEL = 'Display OFF';
const CURSOR_HIDDEN_LABEL = 'Hidden';

// Based on your command list, assuming:
const DISPLAY_ON_HEX = 0x0C;
const CURSOR_HIDDEN_HEX = 0x0C; // 0x0C means Display ON, Cursor OFF (Hidden)

const StatePanel = ({ config, onConfigChange, isInputDisabled }) => { // <--- ADDED isInputDisabled
    // INTERNAL STATE: Use internal state for smooth UI interaction
    const [entryLabel, setEntryLabel] = useState(config.entryMode);
    const [cursorLabel, setCursorLabel] = useState(config.cursorStyle);
    const [busLabel, setBusLabel] = useState(config.busWidth);
    const [displayLabel, setDisplayLabel] = useState(config.displayVisible);
    const [lineLabel, setLineLabel] = useState(config.lineCount);

    // Synchronize internal state when props change (e.g., if LcdController resets)
    useEffect(() => {
        setEntryLabel(config.entryMode);
        setCursorLabel(config.cursorStyle);
        setBusLabel(config.busWidth);
        setDisplayLabel(config.displayVisible);
        setLineLabel(config.lineCount);
    }, [config]);


    // Helper to find the Hex command for a given label in a list
    const getCommandData = (label, list) => list.find(item => item.label === label);

    // --- UNIFIED DROPDOWN HANDLER: Incorporating Constraints ---
    const handleDropdownChange = (newValue, setter, propertyName, commandList = null) => {

        if (isInputDisabled) return; // <--- IGNORE EVENT IF DISABLED

        // Use local state values for calculating constraints *before* updating them
        let newDisplayLabel = displayLabel;
        let newCursorLabel = cursorLabel;
        let commands = []; // Array to hold sequenced commands

        // 1. Determine the command for the *direct* action, and apply temporary state change
        const currentHex = commandList ? getCommandData(newValue, commandList)?.hex : undefined;

        // Update the temporary labels based on the user's action
        if (propertyName === 'displayVisible') newDisplayLabel = newValue;
        if (propertyName === 'cursorStyle') newCursorLabel = newValue;

        // 2. APPLY CONSTRAINTS (Logic sequence is critical)

        // --- CONSTRAINT 1: Display OFF forces Cursor Hidden ---
        if (propertyName === 'displayVisible' && newValue === DISPLAY_OFF_LABEL) {
            if (newCursorLabel !== CURSOR_HIDDEN_LABEL) {
                newCursorLabel = CURSOR_HIDDEN_LABEL;
                // Add the Cursor Hidden command to the sequence BEFORE Display OFF
                commands.push(CURSOR_HIDDEN_HEX);
            }
        }

        // --- CONSTRAINT 2: Cursor Visible forces Display ON ---
        if (propertyName === 'cursorStyle' && newValue !== CURSOR_HIDDEN_LABEL) {
            if (newDisplayLabel === DISPLAY_OFF_LABEL) {
                newDisplayLabel = DISPLAY_ON_LABEL;
                // Add the Display ON command to the sequence
                commands.push(DISPLAY_ON_HEX);
            }
        }

        // 3. Add the command for the user's direct action *after* constraints (if applicable)
        if (currentHex !== undefined) {
             commands.push(currentHex);
        }

        // 4. Update the internal state variables for the current component
        setter(newValue); // Update the state the user directly changed

        if (newDisplayLabel !== displayLabel) {
            setDisplayLabel(newDisplayLabel); // Update Display state
        }
        if (newCursorLabel !== cursorLabel) {
            setCursorLabel(newCursorLabel); // Update Cursor state
        }

        // 5. Construct the full future config and dispatch to parent
        const newConfig = {
            busWidth: propertyName === 'busWidth' ? newValue : busLabel,
            lineCount: propertyName === 'lineCount' ? newValue : lineLabel,
            entryMode: propertyName === 'entryMode' ? newValue : entryLabel,
            displayVisible: newDisplayLabel,
            cursorStyle: newCursorLabel,
        };

        // Dispatch all resulting commands to the parent
        onConfigChange({
            newConfig: newConfig,
            changedProp: propertyName,
            commands: commands // Pass array of hex values for Display/Entry/Cursor/Constraint actions
        });
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
                        onChange={(val) => handleDropdownChange(val, setDisplayLabel, 'displayVisible', DISPLAY_POWER)}
                        isDisabled={isInputDisabled} // <--- PASSED PROP
                    />
                </div>

                {/* Item 2: Entry Mode */}
                <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Entry Mode</span>
                    <NeonDropdown
                        value={entryLabel}
                        options={ENTRY_MODES.map(e => e.label)}
                        onChange={(val) => handleDropdownChange(val, setEntryLabel, 'entryMode', ENTRY_MODES)}
                        isDisabled={isInputDisabled} // <--- PASSED PROP
                    />
                </div>

                {/* Item 3: Cursor Style */}
                <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Cursor Style</span>
                    <NeonDropdown
                        value={cursorLabel}
                        options={CURSOR_MODES.map(c => c.label)}
                        onChange={(val) => handleDropdownChange(val, setCursorLabel, 'cursorStyle', CURSOR_MODES)}
                        isDisabled={isInputDisabled} // <--- PASSED PROP
                    />
                </div>

                {/* Item 4: Bus Interface (Triggers Function Set Calc) */}
                <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Bus Interface (Width)</span>
                    <NeonDropdown
                        value={busLabel}
                        options={BUS_MODES.map(b => b.label)}
                        onChange={(val) => handleDropdownChange(val, setBusLabel, 'busWidth')}
                        isDisabled={isInputDisabled} // <--- PASSED PROP
                    />
                </div>

                {/* Item 5: Line Count (Triggers Function Set Calc) */}
                <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Line Count</span>
                    <NeonDropdown
                        value={lineLabel}
                        options={LINE_MODES.map(l => l.label)}
                        onChange={(val) => handleDropdownChange(val, setLineLabel, 'lineCount')}
                        isDisabled={isInputDisabled} // <--- PASSED PROP
                    />
                </div>

            </div>
        </div>
    );
};

export default StatePanel;